import type { Migration } from "./types";

export const tableAllocationVersionMigration: Migration = {
  id: "0002_table-allocation-version",
  description: "Add the atomic allocation version field to restaurant tables",
  async up(connection) {
    await connection.collection("tables").updateMany({ allocationVersion: { $exists: false } }, { $set: { allocationVersion: 0 } });
  },
  async down(connection) {
    await connection.collection("tables").updateMany({}, { $unset: { allocationVersion: "" } });
  },
};
