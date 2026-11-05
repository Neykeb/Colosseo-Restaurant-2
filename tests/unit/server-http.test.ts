import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Server } from "node:http";
import { createApp } from "../../server/src/http/app";
import { isDirectExecution } from "../../server/src/server";

const servers: Server[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolveClose, reject) => {
          server.close((error) => (error ? reject(error) : resolveClose()));
        }),
    ),
  );
});

async function listen(app: ReturnType<typeof createApp>): Promise<string> {
  const server = app.listen(0, "127.0.0.1");
  servers.push(server);
  await new Promise<void>((resolveListen, reject) => {
    server.once("listening", resolveListen);
    server.once("error", reject);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not expose a TCP address.");
  return `http://127.0.0.1:${address.port}`;
}

describe("Express platform foundation", () => {
  it("recognizes direct TypeScript entry execution with an absolute file URL", () => {
    const entryPath = resolve("server/src/server.ts");
    expect(isDirectExecution(pathToFileURL(entryPath).href, entryPath)).toBe(true);
    expect(isDirectExecution(pathToFileURL(entryPath).href, resolve("server/src/http/app.ts"))).toBe(false);
  });

  it("returns a health response and preserves a valid correlation ID", async () => {
    const baseUrl = await listen(createApp());
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { "x-correlation-id": "integration-test-42" },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("x-correlation-id")).toBe("integration-test-42");
    await expect(response.json()).resolves.toEqual({ status: "ok", correlationId: "integration-test-42" });
  });

  it("keeps unknown API routes as structured JSON errors", async () => {
    const baseUrl = await listen(createApp());
    const response = await fetch(`${baseUrl}/api/missing`);
    const body = (await response.json()) as { error: { code: string; correlationId: string } };

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.correlationId).toBe(response.headers.get("x-correlation-id"));
  });

  it("serves generated assets and the SPA fallback in production mode", async () => {
    const directory = await mkdtemp(join(tmpdir(), "colosseo-static-"));
    await writeFile(join(directory, "index.html"), "<!doctype html><title>Colosseo test shell</title>");
    const baseUrl = await listen(createApp({ staticDirectory: pathToFileURL(`${directory}/`) }));

    const response = await fetch(`${baseUrl}/de/not-found`, { headers: { accept: "text/html" } });
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain("Colosseo test shell");
  });
});
