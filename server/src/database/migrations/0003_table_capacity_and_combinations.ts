import type { Migration } from "./types";

export const tableCapacityAndCombinationsMigration: Migration = {
  id: "0003_table-capacity-and-combinations",
  description: "Add explicit table names, party-size boundaries and combination groups",
  async up(connection) {
    await connection.collection("tables").updateMany(
      {},
      [
        {
          $set: {
            name: { $ifNull: ["$name", "$key"] },
            minPartySize: { $ifNull: ["$minPartySize", 1] },
            maxPartySize: { $ifNull: ["$maxPartySize", "$seats"] },
            combinationGroupKey: { $ifNull: ["$combinationGroupKey", null] },
          },
        },
        { $unset: ["seats", "combinable"] },
      ],
    );
    await connection.collection("tables").createIndex({ combinationGroupKey: 1, active: 1 });
  },
  async down(connection) {
    await connection.collection("tables").dropIndex("combinationGroupKey_1_active_1").catch((error: unknown) => {
      if ((error as { code?: number }).code !== 27) throw error;
    });
    await connection.collection("tables").updateMany(
      {},
      [
        {
          $set: {
            seats: "$maxPartySize",
            combinable: { $ne: ["$combinationGroupKey", null] },
          },
        },
        { $unset: ["name", "minPartySize", "maxPartySize", "combinationGroupKey"] },
      ],
    );
  },
};
