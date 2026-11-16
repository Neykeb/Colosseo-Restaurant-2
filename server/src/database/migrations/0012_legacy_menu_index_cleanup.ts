import type { Migration } from "./types";

const legacyCategoryIndex = "categoryId_1";

export const legacyMenuIndexCleanupMigration: Migration = {
  id: "0012_legacy-menu-index-cleanup",
  description: "Remove the obsolete categoryId menu index before slug-based demo data",
  async up(connection) {
    const categories = connection.collection("menucategories");
    const indexNames = (await categories.indexes()).map(({ name }) => name);
    if (indexNames.includes(legacyCategoryIndex)) await categories.dropIndex(legacyCategoryIndex);
  },
};
