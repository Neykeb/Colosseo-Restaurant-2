import type { Migration } from "./types";

export const reservationBlocksMigration: Migration = {
  id: "0006_reservation-blocks",
  description: "Create administratively managed reservation blocks",
  async up(connection) {
    await connection.createCollection("reservationblocks").catch((error: unknown) => {
      if ((error as { code?: number }).code !== 48) throw error;
    });
    await connection.collection("reservationblocks").createIndex({ blockId: 1 }, { unique: true });
    await connection.collection("reservationblocks").createIndex({ date: 1, startTime: 1, endTime: 1 });
  },
  async down(connection) {
    await connection.dropCollection("reservationblocks").catch((error: unknown) => {
      if ((error as { code?: number }).code !== 26) throw error;
    });
  },
};
