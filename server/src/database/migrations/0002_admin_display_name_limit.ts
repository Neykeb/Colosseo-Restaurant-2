import { ADMIN_DISPLAY_NAME_MAX_LENGTH } from "../../models/core";
import type { Migration } from "./types";

export const adminDisplayNameLimitMigration: Migration = {
  id: "0002_admin-display-name-limit",
  description: "Verify that every admin display name fits the 120-character application boundary",
  async up(connection) {
    const profiles = await connection
      .collection("adminprofiles")
      .find({}, { projection: { _id: 0, displayName: 1 } })
      .toArray();

    const invalidCount = profiles.filter(({ displayName }) =>
      typeof displayName !== "string" || displayName.trim().length === 0 || displayName.trim().length > ADMIN_DISPLAY_NAME_MAX_LENGTH
    ).length;

    if (invalidCount > 0) {
      throw new Error(`${invalidCount} admin profile(s) violate the ${ADMIN_DISPLAY_NAME_MAX_LENGTH}-character display-name boundary`);
    }
  },
  async down() {
    // This migration only verifies existing data. Application validation is reverted in source code, not by mutating records.
  },
};
