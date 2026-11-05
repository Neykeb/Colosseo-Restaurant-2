import { createServer } from "node:http";
import { createApp } from "./http/app";
import { getServerEnv } from "./config/env";

export function startServer() {
  const env = getServerEnv();
  const app = createApp();
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

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
