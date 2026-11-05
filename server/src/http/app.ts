import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

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
  app.use(correlationIdMiddleware);
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({ status: "ok", correlationId: response.locals.correlationId });
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
