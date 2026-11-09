import type { Migration } from "./types";

export const reservationApiAlignmentMigration: Migration = {
  id: "0008_reservation-api-alignment",
  description: "Align reservation statuses and mark provisional booking rules",
  async up(connection) {
    await connection.collection("reservations").updateMany({ status: "requested" }, { $set: { status: "pending" } });
    await connection.collection("settings").updateOne({ key: "reservation.rules" }, { $set: { "value.marker": "PLATZHALTER", "value.confirmationMode": "pending" } });
  },
};
