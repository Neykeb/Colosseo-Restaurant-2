import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Server } from "node:http";
import { createApp } from "../../server/src/http/app";
import { isDirectExecution } from "../../server/src/server";
import { ReservationAdminService } from "../../server/src/services/reservation-admin-service";
import { storeMedia } from "../../server/src/services/media-service";

vi.mock("../../server/src/services/media-service", () => ({
  deleteMedia: vi.fn(),
  storeMedia: vi.fn(),
  streamMedia: vi.fn(),
}));

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

  it("validates and exposes the public reservation API without leaking table keys", async () => {
    const reservationService = {
      getPublicConfiguration: async () => ({ timezone: "Europe/Berlin", bookingHorizonDays: 60, leadTimeMinutes: 120, defaultDurationMinutes: 120, slotIntervalMinutes: 30, partySize: { min: 1, max: 10 }, servicePeriods: [] }),
      getAvailability: async (date: string, partySize: number) => ({ date, partySize, slots: [{ startTime: "17:00", available: true }] }),
      createReservation: async () => ({ publicId: "COL-1234567890", status: "confirmed" as const, tableKeys: ["table-01"], reused: false }),
    };
    const baseUrl = await listen(createApp({ reservationService }));
    const availability = await fetch(`${baseUrl}/api/reservations/availability?date=2026-11-10&partySize=2`);
    expect(availability.status).toBe(200);
    await expect(availability.json()).resolves.toEqual({ date: "2026-11-10", partySize: 2, slots: [{ startTime: "17:00", available: true }] });

    const invalid = await fetch(`${baseUrl}/api/reservations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({}) });
    expect(invalid.status).toBe(400);

    const created = await fetch(`${baseUrl}/api/reservations`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": "browser-request-42" },
      body: JSON.stringify({ date: "2026-11-10", startTime: "17:00", partySize: 2, locale: "de", guest: { name: "Giulia Bianchi", email: "giulia@example.com" }, privacyAcknowledged: true }),
    });
    expect(created.status).toBe(201);
    const createdBody = await created.json() as { reservation: { publicId: string; tableKeys?: string[] } };
    expect(createdBody.reservation.publicId).toBe("COL-1234567890");
  });

  it("limits repeated public reservation attempts per client", async () => {
    let createCalls = 0;
    const reservationService = {
      getPublicConfiguration: async () => ({ timezone: "Europe/Berlin", bookingHorizonDays: 60, leadTimeMinutes: 120, defaultDurationMinutes: 120, slotIntervalMinutes: 30, partySize: { min: 1, max: 10 }, servicePeriods: [] }),
      getAvailability: async () => ({ date: "2026-11-10", partySize: 2, slots: [] }),
      createReservation: async () => {
        createCalls += 1;
        return { publicId: `COL-${createCalls.toString().padStart(10, "0")}`, status: "confirmed" as const, tableKeys: ["table-01"], reused: false };
      },
    };
    const baseUrl = await listen(createApp({ reservationService }));
    const requestReservation = (index: number) => fetch(`${baseUrl}/api/reservations`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": `rate-limit-${index}` },
      body: JSON.stringify({ date: "2026-11-10", startTime: "17:00", partySize: 2, locale: "de", guest: { name: "Giulia Bianchi", email: "giulia@example.com" }, privacyAcknowledged: true }),
    });

    for (let index = 0; index < 10; index += 1) {
      const response = await requestReservation(index);
      expect(response.status).toBe(201);
      expect(response.headers.get("ratelimit-remaining")).toBe(String(9 - index));
    }

    const blocked = await requestReservation(10);
    const body = await blocked.json() as { error: { code: string; correlationId: string } };

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("ratelimit-limit")).toBe("10");
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(body.error.code).toBe("RATE_LIMITED");
    expect(body.error.correlationId).toBe(blocked.headers.get("x-correlation-id"));
    expect(createCalls).toBe(10);
  });

  it("returns a safe correlated error when the reservation service is unavailable", async () => {
    const reservationService = {
      getPublicConfiguration: async () => ({ timezone: "Europe/Berlin", bookingHorizonDays: 60, leadTimeMinutes: 120, defaultDurationMinutes: 120, slotIntervalMinutes: 30, partySize: { min: 1, max: 10 }, servicePeriods: [] }),
      getAvailability: async () => {
        throw new Error("mongodb+srv://secret-user:secret-password@example.mongodb.net");
      },
      createReservation: async () => {
        throw new Error("Provider connection failed with a private token");
      },
    };
    const baseUrl = await listen(createApp({ reservationService }));
    const availability = await fetch(`${baseUrl}/api/reservations/availability?date=2026-11-10&partySize=2`, {
      headers: { "x-correlation-id": "availability-outage-42" },
    });
    const availabilityBody = await availability.json() as { error: { code: string; message: string; correlationId: string } };

    expect(availability.status).toBe(500);
    expect(availabilityBody.error).toEqual({ code: "INTERNAL_SERVER_ERROR", message: "An unexpected server error occurred.", correlationId: "availability-outage-42" });
    expect(JSON.stringify(availabilityBody)).not.toContain("secret-password");

    const creation = await fetch(`${baseUrl}/api/reservations`, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": "outage-request-42", "x-correlation-id": "creation-outage-42" },
      body: JSON.stringify({ date: "2026-11-10", startTime: "17:00", partySize: 2, locale: "de", guest: { name: "Giulia Bianchi", email: "giulia@example.com" }, privacyAcknowledged: true }),
    });
    const creationBody = await creation.json() as { error: { code: string; message: string; correlationId: string } };

    expect(creation.status).toBe(500);
    expect(creationBody.error).toEqual({ code: "INTERNAL_SERVER_ERROR", message: "An unexpected server error occurred.", correlationId: "creation-outage-42" });
    expect(JSON.stringify(creationBody)).not.toContain("private token");
  });

  it("reports unavailable admin authentication when Clerk is not configured", async () => {
    const baseUrl = await listen(createApp());
    const response = await fetch(`${baseUrl}/api/admin/session`);
    const body = (await response.json()) as { error: { code: string } };

    expect(response.status).toBe(503);
    expect(body.error.code).toBe("ADMIN_AUTH_NOT_CONFIGURED");
  });

  it("rejects an authenticated Clerk account without an active owner profile", async () => {
    const baseUrl = await listen(createApp({
      getAuthenticatedUserId: () => "user_not_allowed",
      findAdminProfile: async () => null,
    }));
    const response = await fetch(`${baseUrl}/api/admin/session`);
    const body = (await response.json()) as { error: { code: string } };

    expect(response.status).toBe(403);
    expect(body.error.code).toBe("ADMIN_PROFILE_REQUIRED");
  });

  it("returns the internal owner profile only after both authentication checks pass", async () => {
    const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
    const baseUrl = await listen(createApp({
      getAuthenticatedUserId: () => owner.clerkUserId,
      findAdminProfile: async () => owner,
    }));
    const response = await fetch(`${baseUrl}/api/admin/session`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ admin: owner });
  });

  it("protects reservation blocks and allows an owner to manage them", async () => {
    const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
    const reservationAdminService = {
      listBlocks: async () => [],
      createBlock: async (input: { date: string; startTime: string; endTime: string; scope: "restaurant" | "area" | "table" }) => ({ blockId: "BLK-1234567890", date: input.date, startTime: input.startTime, endTime: input.endTime, scope: input.scope, scopeKey: null, tableCount: 8 }),
      deleteBlock: async () => true,
    };
    const baseUrl = await listen(createApp({
      getAuthenticatedUserId: () => owner.clerkUserId,
      findAdminProfile: async () => owner,
      reservationAdminService,
    }));
    const created = await fetch(`${baseUrl}/api/admin/reservation-blocks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date: "2026-11-10", startTime: "17:00", endTime: "19:00", scope: "restaurant", reason: "Private Veranstaltung" }),
    });
    expect(created.status).toBe(201);
    await expect(created.json()).resolves.toEqual({ block: { blockId: "BLK-1234567890", date: "2026-11-10", startTime: "17:00", endTime: "19:00", scope: "restaurant", scopeKey: null, tableCount: 8 } });
    const deleted = await fetch(`${baseUrl}/api/admin/reservation-blocks/BLK-1234567890`, { method: "DELETE" });
    expect(deleted.status).toBe(204);
  });

  it("validates and protects event inquiry administration", async () => {
    const unauthenticated = await listen(createApp());
    const denied = await fetch(`${unauthenticated}/api/admin/event-inquiries`);
    expect(denied.status).toBe(503);

    const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
    const inquiry = { inquiryId: "INQ-DEV-PRIVATES-DINNER", name: "PLATZHALTER Anna", email: "anna@example.com", eventType: "Privates Dinner", requestedDate: "2026-12-12", partySize: 24, message: "PLATZHALTER", status: "new" as const };
    const reservationAdminService = {
      listEventInquiries: async () => [inquiry],
      createEventInquiry: async (input: Parameters<ReservationAdminService["createEventInquiry"]>[0]) => ({ ...input, inquiryId: "INQ-TEST", status: "new" as const }),
      getEventInquiry: async () => inquiry,
      updateEventInquiryStatus: async () => ({ ...inquiry, status: "in_review" }),
      updateEventInquiryNote: async () => ({ ...inquiry, internalNote: "Follow up" }),
    };
    const baseUrl = await listen(createApp({ getAuthenticatedUserId: () => owner.clerkUserId, findAdminProfile: async () => owner, reservationAdminService: reservationAdminService as never }));
    const invalid = await fetch(`${baseUrl}/api/admin/event-inquiries`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ eventType: "Geburtstag" }) });
    expect(invalid.status).toBe(400);
    const created = await fetch(`${baseUrl}/api/admin/event-inquiries`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "PLATZHALTER Lina", email: "lina@example.com", eventType: "Geburtstag", requestedDate: "2027-02-14", partySize: 12, message: "PLATZHALTER" }) });
    expect(created.status).toBe(201);
    const status = await fetch(`${baseUrl}/api/admin/event-inquiries/INQ-DEV-PRIVATES-DINNER/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: "in_review" }) });
    expect(status.status).toBe(200);
  });

  it("supports the media upload to menu save and publication flow", async () => {
    const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
    const savedItems: Array<Record<string, unknown>> = [];
    const reservationAdminService = {
      saveMenuItem: async (input: Record<string, unknown>) => {
        savedItems.push(input);
        return { ...input, published: false };
      },
      publishMenuItem: async (itemId: string, published: boolean) => ({ ...savedItems.find((item) => item.itemId === itemId), published }),
    };
    vi.mocked(storeMedia).mockResolvedValue({ id: "507f1f77bcf86cd799439011", url: "/api/public/media/507f1f77bcf86cd799439011", contentType: "image/png", size: 8, altText: "Pasta" });
    const baseUrl = await listen(createApp({
      getAuthenticatedUserId: () => owner.clerkUserId,
      findAdminProfile: async () => owner,
      reservationAdminService: reservationAdminService as never,
    }));

    const upload = await fetch(`${baseUrl}/api/admin/media`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fileName: "pasta.png", contentType: "image/png", altText: "Pasta", dataBase64: "iVBORw0KGgo=" }) });
    expect(upload.status).toBe(201);
    const media = await upload.json() as { media: { url: string } };
    expect(media.media.url).toBe("/api/public/media/507f1f77bcf86cd799439011");

    const saved = await fetch(`${baseUrl}/api/admin/menu/items/pasta-01`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ categorySlug: "main", name: "Pasta", priceCents: 1490, allergens: [], imageUrl: media.media.url, sortOrder: 1, active: true, published: false }) });
    expect(saved.status).toBe(200);
    expect(savedItems[0]?.imageUrl).toBe(media.media.url);

    const published = await fetch(`${baseUrl}/api/admin/menu/items/pasta-01/publication`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ published: true }) });
    expect(published.status).toBe(200);
    await expect(published.json()).resolves.toMatchObject({ item: { itemId: "pasta-01", published: true } });

    const invalidPath = await fetch(`${baseUrl}/api/admin/menu/items/pasta-02`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ categorySlug: "main", name: "Pasta", priceCents: 1490, allergens: [], imageUrl: "/uploads/pasta.png", sortOrder: 1, active: true, published: false }) });
    expect(invalidPath.status).toBe(400);
  });

  it("rejects malformed media upload payloads at the API boundary", async () => {
    vi.clearAllMocks();
    const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
    const baseUrl = await listen(createApp({ getAuthenticatedUserId: () => owner.clerkUserId, findAdminProfile: async () => owner }));
    const response = await fetch(`${baseUrl}/api/admin/media`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fileName: "image.png", contentType: "image/png", altText: "Bild", dataBase64: "not base64!" }) });
    expect(response.status).toBe(400);
    expect(vi.mocked(storeMedia)).not.toHaveBeenCalled();
  });

  it("protects every FS6 administration endpoint with owner authorization", async () => {
    const unauthenticated = await listen(createApp({ getAuthenticatedUserId: () => null, findAdminProfile: async () => null }));
    for (const route of ["/api/admin/menu/categories", "/api/admin/menu/items", "/api/admin/menu/preview", "/api/admin/opening-hours"]) {
      const response = await fetch(`${unauthenticated}${route}`);
      expect(response.status, route).toBe(401);
    }
    expect((await fetch(`${unauthenticated}/api/admin/media/507f1f77bcf86cd799439011`, { method: "DELETE" })).status).toBe(401);

    const staff = { clerkUserId: "user_staff", role: "staff" as const, active: true, displayName: "Staff" };
    const forbidden = await listen(createApp({ getAuthenticatedUserId: () => staff.clerkUserId, findAdminProfile: async () => staff }));
    for (const route of ["/api/admin/menu/categories", "/api/admin/menu/items", "/api/admin/menu/preview", "/api/admin/opening-hours"]) {
      const response = await fetch(`${forbidden}${route}`);
      expect(response.status, route).toBe(403);
    }
    expect((await fetch(`${forbidden}/api/admin/media/507f1f77bcf86cd799439011`, { method: "DELETE" })).status).toBe(403);
  });

  it("allows an owner to manually anonymize a reservation", async () => {
    const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
    const anonymized = { publicId: "COL-1234567890", guest: { name: "ANONYMIZED" }, status: "completed" };
    const reservationAdminService = { anonymizeReservation: async () => anonymized };
    const baseUrl = await listen(createApp({ getAuthenticatedUserId: () => owner.clerkUserId, findAdminProfile: async () => owner, reservationAdminService: reservationAdminService as never }));
    const response = await fetch(`${baseUrl}/api/admin/reservations/COL-1234567890/anonymize`, { method: "POST" });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ reservation: anonymized });
  });
  it("protects and validates regular opening-hours administration", async () => {
    const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
    const saved = { key: "fri-evening", weekday: 5, startTime: "17:00", endTime: "21:00", active: true };
    const reservationAdminService = {
      listServicePeriods: async () => [saved],
      saveServicePeriod: async () => saved,
      deleteServicePeriod: async (key: string) => key === saved.key ? saved : null,
    };
    const baseUrl = await listen(createApp({ getAuthenticatedUserId: () => owner.clerkUserId, findAdminProfile: async () => owner, reservationAdminService: reservationAdminService as never }));
    const listed = await fetch(`${baseUrl}/api/admin/opening-hours`);
    expect(listed.status).toBe(200);
    await expect(listed.json()).resolves.toEqual({ regular: [saved] });
    const invalid = await fetch(`${baseUrl}/api/admin/opening-hours/fri-evening`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ weekday: 5, startTime: "21:00", endTime: "17:00", active: true }) });
    expect(invalid.status).toBe(400);
    const updated = await fetch(`${baseUrl}/api/admin/opening-hours/fri-evening`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(saved) });
    expect(updated.status).toBe(200);
    const deleted = await fetch(`${baseUrl}/api/admin/opening-hours/fri-evening`, { method: "DELETE" });
    expect(deleted.status).toBe(204);
  });

  it("rejects a request without an authenticated Clerk user", async () => {
    const baseUrl = await listen(createApp({
      getAuthenticatedUserId: () => null,
      findAdminProfile: async () => null,
    }));
    const response = await fetch(`${baseUrl}/api/admin/session`);
    const body = (await response.json()) as { error: { code: string } };

    expect(response.status).toBe(401);
    expect(body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("serves client-only routes and marks unknown HTML routes as not found in production mode", async () => {
    const directory = await mkdtemp(join(tmpdir(), "colosseo-static-"));
    await writeFile(join(directory, "index.html"), "<!doctype html><title>Colosseo test shell</title>");
    const baseUrl = await listen(createApp({ staticDirectory: pathToFileURL(`${directory}/`) }));

    const response = await fetch(`${baseUrl}/de/not-found`, { headers: { accept: "text/html" } });
    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toContain("Colosseo test shell");

    const adminResponse = await fetch(`${baseUrl}/admin`, { headers: { accept: "text/html" } });
    expect(adminResponse.status).toBe(200);
    expect(adminResponse.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");

    const adminSlashResponse = await fetch(`${baseUrl}/admin/`, { headers: { accept: "text/html" } });
    expect(adminSlashResponse.status).toBe(200);
  });
});
