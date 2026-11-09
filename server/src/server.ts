import { createServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createApp } from "./http/app";
import { getServerEnv } from "./config/env";
import { connectToDatabase, disconnectFromDatabase } from "./config/database";
import { EmailOutboxWorker } from "./services/email-outbox-service";

export async function startServer() {
  const env = getServerEnv();
  await connectToDatabase(env);
  const clerk = env.CLERK_SECRET_KEY && env.CLERK_PUBLISHABLE_KEY
    ? { secretKey: env.CLERK_SECRET_KEY, publishableKey: env.CLERK_PUBLISHABLE_KEY, authorizedParties: env.CLERK_AUTHORIZED_PARTIES }
    : undefined;
  const app = createApp({
    staticDirectory: env.NODE_ENV === "production" ? new URL("../../dist", import.meta.url) : undefined,
    clerk,
  });
  const emailWorker = env.RESEND_API_KEY && env.RESEND_FROM_EMAIL && env.RESTAURANT_NOTIFICATION_EMAIL
    ? new EmailOutboxWorker({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM_EMAIL, restaurantRecipient: env.RESTAURANT_NOTIFICATION_EMAIL })
    : undefined;
  emailWorker?.start();
  const server = createServer(app);

  server.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Colosseo API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}; shutting down server.`);
    emailWorker?.stop();
    server.close(async (error) => {
      if (error) {
        console.error("Server shutdown failed.", error);
        process.exitCode = 1;
      }
      await disconnectFromDatabase();
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));

  return server;
}

export function isDirectExecution(moduleUrl: string, entryPath = process.argv[1]): boolean {
  return Boolean(entryPath) && moduleUrl === pathToFileURL(resolve(entryPath)).href;
}

if (isDirectExecution(import.meta.url)) {
  startServer().catch((error: unknown) => {
    console.error("Colosseo API failed to start:", error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  });
}
