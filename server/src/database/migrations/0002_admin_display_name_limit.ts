import type { Migration } from "./types";

export const adminDisplayNameLimitMigration: Migration = {
  id: "0002_admin-display-name-limit",
  description: "Verify that every admin display name fits the 120-character application boundary",
  async up(connection) {
    const invalid = await connection.collection("adminprofiles").findOne({ $expr: { $gt: [{ $strLenCP: "$displayName" }, 120] } });
    if (invalid) throw new Error("An admin profile display name exceeds 120 characters");
  },
};
