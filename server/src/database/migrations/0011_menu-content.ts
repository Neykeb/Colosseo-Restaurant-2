import type { Migration } from "./types";

export const menuContentMigration: Migration = {
  id: "0011_menu-content",
  description: "Create menu category and item collections with publishing indexes",
  async up(connection) {
    await connection.createCollection("menucategories").catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    await connection.createCollection("menuitems").catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    await connection.collection("menucategories").createIndex({ slug: 1 }, { unique: true, name: "menu_category_slug" }).catch((error: unknown) => { if ((error as { code?: number }).code !== 85) throw error; });
    await connection.collection("menucategories").createIndex({ active: 1, sortOrder: 1 }, { name: "menu_category_published_order" }).catch((error: unknown) => { if ((error as { code?: number }).code !== 85) throw error; });
    await connection.collection("menuitems").createIndex({ categorySlug: 1, active: 1, sortOrder: 1 }, { name: "menu_item_published_order" }).catch((error: unknown) => { if ((error as { code?: number }).code !== 85) throw error; });
  },
};
