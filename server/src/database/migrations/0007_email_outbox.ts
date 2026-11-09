import type { Migration } from "./types";

export const emailOutboxMigration: Migration = {
  id: "0007_email-outbox",
  description: "Prepare reservation locale and retryable transactional email outbox",
  async up(connection) {
    await connection.collection("reservations").updateMany({ locale: { $exists: false } }, { $set: { locale: "de" } });
    await connection.collection("outboxevents").createIndex({ status: 1, nextAttemptAt: 1, createdAt: 1 }, { name: "outbox_delivery_queue" });
  },
};
