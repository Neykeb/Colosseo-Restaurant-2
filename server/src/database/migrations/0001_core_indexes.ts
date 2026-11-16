import type { Migration } from "./types";

const collections = ["settings", "servicehours", "specialdays", "areas", "tables", "reservations", "tableassignments", "auditevents", "outboxevents", "adminprofiles"] as const;

export const coreIndexesMigration: Migration = {
  id: "0001_core-indexes",
  description: "Create the FS1 core collections and indexes",
  async up(connection) {
    for (const name of collections) await connection.createCollection(name).catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    await connection.collection("settings").createIndex({ key: 1 }, { unique: true });
    await connection.collection("servicehours").createIndex({ weekday: 1 }, { unique: true });
    await connection.collection("specialdays").createIndex({ date: 1 }, { unique: true });
    await connection.collection("areas").createIndex({ key: 1 }, { unique: true });
    await connection.collection("tables").createIndex({ key: 1 }, { unique: true });
    await connection.collection("tables").createIndex({ areaKey: 1, active: 1 });
    await connection.collection("reservations").createIndex({ publicId: 1 }, { unique: true });
    await connection.collection("reservations").createIndex({ idempotencyKey: 1 }, { unique: true });
    await connection.collection("reservations").createIndex({ date: 1, startTime: 1, status: 1 });
    await connection.collection("tableassignments").createIndex({ reservationPublicId: 1, tableKey: 1 }, { unique: true });
    await connection.collection("tableassignments").createIndex({ tableKey: 1, date: 1, startTime: 1, endTime: 1 });
    await connection.collection("auditevents").createIndex({ eventId: 1 }, { unique: true });
    await connection.collection("outboxevents").createIndex({ eventId: 1 }, { unique: true });
    await connection.collection("outboxevents").createIndex({ status: 1, nextAttemptAt: 1 });
    await connection.collection("adminprofiles").createIndex({ clerkUserId: 1 }, { unique: true });
  },
  async down(connection) {
    for (const name of [...collections].reverse()) await connection.dropCollection(name).catch((error: unknown) => { if ((error as { code?: number }).code !== 26) throw error; });
  },
};
