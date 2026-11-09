import type { Migration } from "./types";

export const reservationLocksMigration: Migration = {
  id: "0005_reservation-locks",
  description: "Create unique table-slot locks for atomic reservation decisions",
  async up(connection) {
    await connection.createCollection("reservationlocks").catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    await connection.collection("reservationlocks").createIndex({ date: 1, tableKey: 1, slotStart: 1 }, { unique: true, name: "unique_table_slot" });
    await connection.collection("reservationlocks").createIndex({ reservationPublicId: 1 });
  },
};
