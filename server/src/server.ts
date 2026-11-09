import { createServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createApp } from "./http/app";
import { getServerEnv } from "./config/env";

export function startServer() {
  const env = getServerEnv();
  const app = createApp({
    staticDirectory: env.NODE_ENV === "production" ? new URL("../../dist", import.meta.url) : undefined,
  });
  const server = createServer(app);

  server.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Colosseo API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}; shutting down server.`);
    server.close((error) => {
      if (error) {
        console.error("Server shutdown failed.", error);
        process.exitCode = 1;
      }
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
  startServer();
}
