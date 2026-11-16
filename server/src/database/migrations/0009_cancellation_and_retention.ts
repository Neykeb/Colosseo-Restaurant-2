import type { Migration } from "./types";

export const cancellationAndRetentionMigration: Migration = {
  id: "0009_cancellation-and-retention",
  description: "Add secure guest cancellation token lookup and retention support",
  async up(connection) {
    await connection.collection("reservations").createIndex({ publicId: 1, cancellationTokenHash: 1 }, { sparse: true, name: "guest_cancellation_token" });
  },
};
