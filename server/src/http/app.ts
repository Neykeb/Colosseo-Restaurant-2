import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { clerkMiddleware } from "@clerk/express";
import { fileURLToPath } from "node:url";
import { requireAdminRole, type GetAuthenticatedUserId } from "../auth/admin-authorization";
import { AdminProfileRepository } from "../repositories/admin-profile-repository";
import { z } from "zod";
import { ReservationRequestError, ReservationService } from "../services/reservation-service";
import { ReservationAdminService } from "../services/reservation-admin-service";
import { ReservationLockConflictError } from "../repositories/reservation-repository";

type ReservationApi = Pick<ReservationService, "getPublicConfiguration" | "getAvailability" | "createReservation">;
type ReservationAdminApi = Pick<ReservationAdminService, "listBlocks" | "createBlock" | "deleteBlock">;

interface CreateAppOptions {
  staticDirectory?: URL;
  clerk?: {
    secretKey: string;
    publishableKey: string;
    authorizedParties?: string[];
  };
  findAdminProfile?: InstanceType<typeof AdminProfileRepository>["findByClerkUserId"];
  getAuthenticatedUserId?: GetAuthenticatedUserId;
  reservationService?: ReservationApi;
  reservationAdminService?: ReservationAdminApi;
}

const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  partySize: z.coerce.number().int(),
});

const reservationBodySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  partySize: z.number().int(),
  locale: z.enum(["de", "en", "it"]).default("de"),
  guest: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254).optional(),
    phone: z.string().trim().min(6).max(30).optional(),
  }).refine(({ email, phone }) => Boolean(email || phone), { message: "Email or phone is required." }),
  privacyAcknowledged: z.literal(true),
});

const reservationBlockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  scope: z.enum(["restaurant", "area", "table"]),
  scopeKey: z.string().trim().min(1).max(80).optional(),
  reason: z.string().trim().min(2).max(240),
}).refine(({ startTime, endTime }) => startTime < endTime, { path: ["endTime"], message: "End time must be later than start time." })
  .refine(({ scope, scopeKey }) => scope === "restaurant" || Boolean(scopeKey), { path: ["scopeKey"], message: "Area and table blocks require a scope key." });

function sendValidationError(response: express.Response, details: unknown): void {
  response.status(400).json({ error: { code: "VALIDATION_ERROR", message: "The request data is invalid.", details, correlationId: response.locals.correlationId } });
}

function sendReservationError(response: express.Response, error: unknown): void {
  if (error instanceof ReservationRequestError) {
    response.status(error.reason === "fully_booked" ? 409 : 422).json({ error: { code: error.reason.toUpperCase(), message: error.message, correlationId: response.locals.correlationId } });
    return;
  }
  throw error;
}

function createReservationRateLimit(maxRequests = 10, windowMs = 60_000): RequestHandler {
  const clients = new Map<string, { count: number; resetAt: number }>();
  return (request, response, next) => {
    const now = Date.now();
    const key = request.ip ?? request.socket.remoteAddress ?? "unknown";
    const current = clients.get(key);
    const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    entry.count += 1;
    clients.set(key, entry);
    response.setHeader("ratelimit-limit", String(maxRequests));
    response.setHeader("ratelimit-remaining", String(Math.max(0, maxRequests - entry.count)));
    if (entry.count > maxRequests) {
      response.setHeader("retry-after", String(Math.ceil((entry.resetAt - now) / 1_000)));
      response.status(429).json({ error: { code: "RATE_LIMITED", message: "Too many reservation attempts. Please try again shortly.", correlationId: response.locals.correlationId } });
      return;
    }
    next();
  };
}

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
  const statusCode = Number.isInteger(error?.statusCode) && error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : 500;

  if (!response.headersSent) {
    response.status(statusCode).json({
      error: {
        code: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
        message: statusCode === 500 ? "An unexpected server error occurred." : error.message,
        correlationId,
      },
    });
  }
};

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  const adminProfiles = new AdminProfileRepository();
  const reservations = options.reservationService ?? new ReservationService();
  const reservationAdmin = options.reservationAdminService ?? new ReservationAdminService();
  const adminGuard: RequestHandler[] = options.clerk || options.getAuthenticatedUserId
    ? [requireAdminRole(options.findAdminProfile ?? adminProfiles.findByClerkUserId.bind(adminProfiles), "owner", options.getAuthenticatedUserId)]
    : [(_request, response) => {
        response.status(503).json({ error: { code: "ADMIN_AUTH_NOT_CONFIGURED", message: "Admin authentication is not configured.", correlationId: response.locals.correlationId } });
      }];

  app.disable("x-powered-by");
  if (options.clerk) {
    app.use(clerkMiddleware({
      secretKey: options.clerk.secretKey,
      publishableKey: options.clerk.publishableKey,
      authorizedParties: options.clerk.authorizedParties,
    }));
  }
  app.use(correlationIdMiddleware);
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({ status: "ok", correlationId: response.locals.correlationId });
  });

  app.get("/api/reservations/config", async (_request, response, next) => {
    try {
      response.status(200).json(await reservations.getPublicConfiguration());
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/reservations/availability", async (request, response, next) => {
    const input = availabilityQuerySchema.safeParse(request.query);
    if (!input.success) {
      sendValidationError(response, input.error.flatten());
      return;
    }
    try {
      response.status(200).json(await reservations.getAvailability(input.data.date, input.data.partySize));
    } catch (error) {
      try {
        sendReservationError(response, error);
      } catch (unexpected) {
        next(unexpected);
      }
    }
  });

  app.post("/api/reservations", createReservationRateLimit(), async (request, response, next) => {
    const body = reservationBodySchema.safeParse(request.body);
    const idempotencyKey = request.header("idempotency-key")?.trim();
    if (!body.success || !idempotencyKey || !/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) {
      sendValidationError(response, body.success ? { idempotencyKey: ["A valid Idempotency-Key header is required."] } : body.error.flatten());
      return;
    }
    try {
      const result = await reservations.createReservation({ ...body.data, idempotencyKey });
      response.status(result.reused ? 200 : 201).json({ reservation: { publicId: result.publicId, status: result.status, reused: result.reused } });
    } catch (error) {
      try {
        sendReservationError(response, error);
      } catch (unexpected) {
        next(unexpected);
      }
    }
  });

  app.get(
    "/api/admin/session",
    ...adminGuard,
    (_request, response) => {
      response.status(200).json({ admin: response.locals.adminProfile });
    },
  );

  app.post("/api/admin/reservations", ...adminGuard, async (request, response, next) => {
    const body = reservationBodySchema.safeParse(request.body);
    const idempotencyKey = request.header("idempotency-key")?.trim();
    if (!body.success || !idempotencyKey || !/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) {
      sendValidationError(response, body.success ? { idempotencyKey: ["A valid Idempotency-Key header is required."] } : body.error.flatten());
      return;
    }
    try {
      const result = await reservations.createReservation({ ...body.data, idempotencyKey });
      response.status(result.reused ? 200 : 201).json({ reservation: result });
    } catch (error) {
      try {
        sendReservationError(response, error);
      } catch (unexpected) {
        next(unexpected);
      }
    }
  });

  app.get("/api/admin/reservation-blocks", ...adminGuard, async (request, response, next) => {
    const date = typeof request.query.date === "string" ? request.query.date : undefined;
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      sendValidationError(response, { date: ["A valid date is required."] });
      return;
    }
    try {
      response.status(200).json({ blocks: await reservationAdmin.listBlocks(date) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/reservation-blocks", ...adminGuard, async (request, response, next) => {
    const body = reservationBlockSchema.safeParse(request.body);
    if (!body.success) {
      sendValidationError(response, body.error.flatten());
      return;
    }
    try {
      const block = await reservationAdmin.createBlock({ ...body.data, createdBy: response.locals.adminProfile.clerkUserId });
      response.status(201).json({ block });
    } catch (error) {
      if (error instanceof ReservationLockConflictError) {
        response.status(409).json({ error: { code: "RESERVATION_CONFLICT", message: error.message, correlationId: response.locals.correlationId } });
        return;
      }
      next(error);
    }
  });

  app.delete("/api/admin/reservation-blocks/:blockId", ...adminGuard, async (request, response, next) => {
    const blockId = Array.isArray(request.params.blockId) ? request.params.blockId[0] : request.params.blockId;
    if (!blockId || !/^BLK-[A-F0-9]{10}$/.test(blockId)) {
      sendValidationError(response, { blockId: ["A valid block ID is required."] });
      return;
    }
    try {
      const deleted = await reservationAdmin.deleteBlock(blockId);
      if (!deleted) {
        response.status(404).json({ error: { code: "BLOCK_NOT_FOUND", message: "The reservation block was not found.", correlationId: response.locals.correlationId } });
        return;
      }
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  if (options.staticDirectory) {
    const staticDirectory = fileURLToPath(options.staticDirectory);
    app.use("/admin", (_request, response, next) => {
      response.setHeader("x-robots-tag", "noindex, nofollow, noarchive");
      next();
    });
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
