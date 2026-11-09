import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Server } from "node:http";
import { createApp } from "../../server/src/http/app";
import { isDirectExecution } from "../../server/src/server";
import { BookingService } from "../../server/src/services/booking-service";
import type { RequestHandler } from "express";

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

class FakeBookingService extends BookingService {
  override async publicConfig() {
    return { timezone: "Europe/Berlin", bookingHorizonDays: 30, leadTimeMinutes: 120, defaultDurationMinutes: 120, partySize: { min: 1, max: 8 }, locales: ["de", "en", "it"], provisional: true };
  }
  override async availability() { return ["17:00", "17:30"]; }
  override async create(input: Parameters<BookingService["create"]>[0]) {
    return { publicId: "res_test", date: input.date, startTime: input.startTime, endTime: "19:00", partySize: input.partySize, status: "pending" } as never;
  }
  override async listReservations() { return []; }
  override async updateStatus() { return {} as never; }
  override async listBlocks() { return []; }
  override async createBlock() { return {} as never; }
  override async deactivateBlock() { return {} as never; }
}

const allowAdmin: RequestHandler = (_request, _response, next) => next();

describe("reservation API", () => {
  it("exposes public config and availability without internal table details", async () => {
    const baseUrl = await listen(createApp({ bookingService: new FakeBookingService() }));
    const config = await fetch(`${baseUrl}/api/public/config`);
    expect(config.status).toBe(200);
    await expect(config.json()).resolves.toMatchObject({ timezone: "Europe/Berlin", provisional: true });

    const availability = await fetch(`${baseUrl}/api/public/availability?date=2026-11-10&partySize=2`);
    expect(availability.status).toBe(200);
    await expect(availability.json()).resolves.toEqual({ date: "2026-11-10", partySize: 2, slots: ["17:00", "17:30"], snapshot: true });
  });

  it("requires an idempotency key and validates public reservation data", async () => {
    const baseUrl = await listen(createApp({ bookingService: new FakeBookingService() }));
    const response = await fetch(`${baseUrl}/api/public/reservations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({}) });
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "VALIDATION_FAILED" } });
  });

  it("rate-limits repeated public reservation submissions", async () => {
    const baseUrl = await listen(createApp({ bookingService: new FakeBookingService() }));
    let response: Response | undefined;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      response = await fetch(`${baseUrl}/api/public/reservations`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    }
    expect(response?.status).toBe(429);
    await expect(response?.json()).resolves.toMatchObject({ error: { code: "RATE_LIMIT_EXCEEDED" } });
  });

  it("keeps reservation administration behind the admin guard", async () => {
    const baseUrl = await listen(createApp({ bookingService: new FakeBookingService(), adminGuard: allowAdmin }));
    const reservations = await fetch(`${baseUrl}/api/admin/reservations`);
    expect(reservations.status).toBe(200);
    await expect(reservations.json()).resolves.toEqual({ reservations: [] });
  });
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
