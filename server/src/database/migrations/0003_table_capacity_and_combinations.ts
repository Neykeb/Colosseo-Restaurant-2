import type { Migration } from "./types";

export const tableCapacityAndCombinationsMigration: Migration = {
  id: "0003_table-capacity-and-combinations",
  description: "Add explicit table names, party-size boundaries and combination groups",
  async up(connection) {
    await connection.collection("tables").updateMany({ name: { $exists: false } }, [{ $set: { name: "$key", minPartySize: 1, maxPartySize: { $ifNull: ["$seats", 1] }, combinationGroupKey: null } }, { $unset: ["seats", "combinable"] }]);
    await connection.collection("tables").createIndex({ combinationGroupKey: 1, active: 1 });
  },
};
