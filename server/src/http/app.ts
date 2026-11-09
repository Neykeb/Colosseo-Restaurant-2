import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { clerkMiddleware } from "@clerk/express";
import { getAuth } from "@clerk/express";
import { fileURLToPath } from "node:url";
import { AdminProfileRepository } from "../repositories/admin-profile-repository";
import { z } from "zod";
import { BookingError, BookingService } from "../services/booking-service";
import { createRateLimit } from "./rate-limit";
import { requireAdminRole } from "../auth/admin-authorization";

interface CreateAppOptions {
  staticDirectory?: URL;
  bookingService?: BookingService;
  adminGuard?: RequestHandler;
}

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const reservationBodySchema = z.object({
  date: dateSchema,
  startTime: timeSchema,
  partySize: z.number().int().min(1).max(50),
  guest: z.object({ name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(254).optional(), phone: z.string().trim().min(5).max(40).optional() }).refine((guest) => guest.email || guest.phone, "Email or phone is required."),
  locale: z.enum(["de", "en", "it"]).default("de"),
  internalNote: z.string().trim().max(1_000).optional(),
});
const reservationStatusSchema = z.enum(["pending", "confirmed", "declined", "cancelled", "seated", "completed", "no_show"]);
const blockBodySchema = z.object({ date: dateSchema, startTime: timeSchema, endTime: timeSchema, label: z.string().trim().min(1).max(160) });

const correlationIdMiddleware: RequestHandler = (request, response, next) => {
  const incomingId = request.header("x-correlation-id")?.trim();
  const correlationId = incomingId && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(incomingId) ? incomingId : randomUUID();

  response.setHeader("x-correlation-id", correlationId);
  response.locals.correlationId = correlationId;
  next();
};

const notFoundHandler: RequestHandler = (request, response) => {
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found.",
      correlationId: response.locals.correlationId,
    },
  });
};

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const correlationId = response.locals.correlationId ?? randomUUID();
  const statusCode = Number.isInteger(error?.statusCode) && error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : error instanceof z.ZodError ? 422 : 500;

  if (!response.headersSent) {
    response.status(statusCode).json({
      error: {
        code: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : error instanceof BookingError ? error.code : error instanceof z.ZodError ? "VALIDATION_FAILED" : "REQUEST_ERROR",
        message: statusCode === 500 ? "An unexpected server error occurred." : error instanceof z.ZodError ? "The request data is invalid." : error.message,
        correlationId,
      },
    });
  }
};

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  const booking = options.bookingService ?? new BookingService();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  if (process.env.CLERK_SECRET_KEY) {
    const authorizedParties = process.env.CLERK_AUTHORIZED_PARTIES
      ? JSON.parse(process.env.CLERK_AUTHORIZED_PARTIES) as string[]
      : undefined;
    app.use(clerkMiddleware({ authorizedParties }));
  }
  app.use(correlationIdMiddleware);
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({ status: "ok", correlationId: response.locals.correlationId });
  });

  app.get("/api/public/config", async (_request, response, next) => {
    try {
      response.json(await booking.publicConfig());
    } catch (error) { next(error); }
  });

  app.get("/api/public/availability", async (request, response, next) => {
    try {
      const query = z.object({ date: dateSchema, partySize: z.coerce.number().int().min(1).max(50) }).parse(request.query);
      response.json({ date: query.date, partySize: query.partySize, slots: await booking.availability(query.date, query.partySize), snapshot: true });
    } catch (error) { next(error); }
  });

  app.post("/api/public/reservations", createRateLimit({ windowMs: 15 * 60_000, limit: 10 }), async (request, response, next) => {
    try {
      const idempotencyKey = z.string().trim().min(16).max(128).parse(request.header("idempotency-key"));
      const body = reservationBodySchema.parse(request.body);
      const reservation = await booking.create({ ...body, idempotencyKey, source: "public" });
      response.status(201).json(toPublicReservation(reservation));
    } catch (error) { next(error); }
  });

  app.get("/api/admin/me", async (request, response, next) => {
    try {
      if (!process.env.CLERK_SECRET_KEY) {
        response.status(503).json({ error: { code: "CLERK_NOT_CONFIGURED", message: "Admin authentication is not configured." } });
        return;
      }
      const { userId } = getAuth(request as never);
      if (!userId) {
        response.status(401).json({ error: { code: "AUTHENTICATION_REQUIRED", message: "Authentication is required." } });
        return;
      }
      const profile = await new AdminProfileRepository().findByClerkUserId(userId);
      if (!profile || !profile.active) {
        const configuredOwnerId = process.env.CLERK_OWNER_USER_ID;
        const configuredOwnerProfile = configuredOwnerId
          ? await new AdminProfileRepository().findByClerkUserId(configuredOwnerId)
          : null;
        const code = userId === configuredOwnerId
          ? "OWNER_PROFILE_LOOKUP_FAILED"
          : configuredOwnerProfile ? "OWNER_CLERK_ID_MISMATCH" : "ADMIN_PROFILE_REQUIRED";
        response.status(403).json({ error: { code, message: "An active admin profile is required." } });
        return;
      }
      response.json({ userId, role: profile.role, displayName: profile.displayName });
    } catch (error) {
      next(error);
    }
  });

  const defaultAdminGuard = requireAdminRole(async (userId) => new AdminProfileRepository().findByClerkUserId(userId));
  const adminGuard = options.adminGuard ?? ((request, response, next) => {
    const userId = process.env.CLERK_SECRET_KEY ? getAuth(request as never).userId : null;
    (request as typeof request & { auth?: { userId: string | null } }).auth = { userId };
    defaultAdminGuard(request, response, next);
  });

  app.get("/api/admin/reservations", adminGuard, async (request, response, next) => {
    try {
      const query = z.object({ date: dateSchema.optional(), status: reservationStatusSchema.optional() }).parse(request.query);
      response.json({ reservations: await booking.listReservations(query) });
    } catch (error) { next(error); }
  });

  app.post("/api/admin/reservations", adminGuard, async (request, response, next) => {
    try {
      const body = reservationBodySchema.parse(request.body);
      const idempotencyKey = request.header("idempotency-key")?.trim() || `admin_${randomUUID()}`;
      const reservation = await booking.create({ ...body, idempotencyKey, source: "admin" });
      response.status(201).json({ reservation });
    } catch (error) { next(error); }
  });

  app.patch("/api/admin/reservations/:reference/status", adminGuard, async (request, response, next) => {
    try {
      const status = reservationStatusSchema.parse(request.body?.status);
      const reference = z.string().parse(request.params.reference);
      const actorId = adminUserId(request);
      response.json({ reservation: await booking.updateStatus(reference, status, actorId) });
    } catch (error) { next(error); }
  });

  app.get("/api/admin/blocks", adminGuard, async (request, response, next) => {
    try {
      const query = z.object({ date: dateSchema.optional() }).parse(request.query);
      response.json({ blocks: await booking.listBlocks(query.date) });
    } catch (error) { next(error); }
  });

  app.post("/api/admin/blocks", adminGuard, async (request, response, next) => {
    try {
      const body = blockBodySchema.parse(request.body);
      const userId = adminUserId(request);
      response.status(201).json({ block: await booking.createBlock({ ...body, createdBy: userId }) });
    } catch (error) { next(error); }
  });

  app.delete("/api/admin/blocks/:reference", adminGuard, async (request, response, next) => {
    try {
      const reference = z.string().parse(request.params.reference);
      const actorId = adminUserId(request);
      response.json({ block: await booking.deactivateBlock(reference, actorId) });
    } catch (error) { next(error); }
  });

  if (options.staticDirectory) {
    const staticDirectory = fileURLToPath(options.staticDirectory);
    app.use(express.static(staticDirectory, { extensions: ["html"] }));
    app.get(/^(?!\/api(?:\/|$)).*/, (request, response, next) => {
      if (!request.accepts("html")) {
        next();
        return;
      }

      response.sendFile("index.html", { root: staticDirectory }, (error) => {
        if (error) next(error);
      });
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

function toPublicReservation(reservation: unknown) {
  const value = typeof (reservation as { toObject?: unknown })?.toObject === "function"
    ? (reservation as { toObject(): Record<string, unknown> }).toObject()
    : reservation as Record<string, unknown>;
  return { reference: value.publicId, date: value.date, startTime: value.startTime, endTime: value.endTime, partySize: value.partySize, status: value.status };
}

function adminUserId(request: express.Request): string {
  const attached = (request as express.Request & { auth?: { userId: string | null } }).auth?.userId;
  if (attached) return attached;
  return process.env.CLERK_SECRET_KEY ? getAuth(request as never).userId ?? "unknown-admin" : "test-admin";
}
