import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { clerkMiddleware } from "@clerk/express";
import { getAuth } from "@clerk/express";
import { fileURLToPath } from "node:url";
import { AdminProfileRepository } from "../repositories/admin-profile-repository";

interface CreateAppOptions {
  staticDirectory?: URL;
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

  app.disable("x-powered-by");
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
        response.status(403).json({ error: { code: "ADMIN_PROFILE_REQUIRED", message: "An active admin profile is required." } });
        return;
      }
      response.json({ userId, role: profile.role, displayName: profile.displayName });
    } catch (error) {
      next(error);
    }
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
