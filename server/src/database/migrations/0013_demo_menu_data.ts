import { menuCategories } from "../../../../app/content/menu-data";
import type { Migration } from "./types";

const migrationId = "0013_demo-menu-data";

function priceToCents(price: string): number {
  const normalized = price.replace("€", "").trim().replace(".", "").replace(",", ".");
  const cents = Math.round(Number.parseFloat(normalized) * 100);
  if (!Number.isInteger(cents)) throw new Error(`Invalid menu price: ${price}`);
  return cents;
}

function allergenCodes(allergens?: string): string[] {
  if (!allergens) return [];
  return allergens
    .replace(/[()]/g, "")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export const demoMenuCategories = menuCategories.map((category, sortOrder) => ({
  slug: category.id,
  name: category.filterLabel,
  sortOrder,
  active: true,
}));

export const demoMenuItems = menuCategories.flatMap((category) =>
  category.sections.flatMap((section) =>
    section.dishes.map((item, sortOrder) => ({
      itemId: item.key,
      categorySlug: category.id,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      priceCents: priceToCents(item.price),
      allergens: allergenCodes(item.allergens),
      sortOrder,
      active: true,
      published: true,
    })),
  ),
);

export const demoMenuDataMigration: Migration = {
  id: migrationId,
  description: "Seed the verified Colosseo menu for the final-project demo",
  async up(connection) {
    const now = new Date();
    if (demoMenuCategories.length > 0) {
      await connection.collection("menucategories").bulkWrite(
        demoMenuCategories.map((category) => ({
          updateOne: {
            filter: { slug: category.slug },
            update: { $setOnInsert: { ...category, seedSource: migrationId, createdAt: now, updatedAt: now } },
            upsert: true,
          },
        })),
      );
    }
    if (demoMenuItems.length > 0) {
      await connection.collection("menuitems").bulkWrite(
        demoMenuItems.map((item) => ({
          updateOne: {
            filter: { itemId: item.itemId },
            update: { $setOnInsert: { ...item, seedSource: migrationId, createdAt: now, updatedAt: now } },
            upsert: true,
          },
        })),
      );
    }
  },
  async down(connection) {
    await connection.collection("menuitems").deleteMany({ seedSource: migrationId });
    await connection.collection("menucategories").deleteMany({ seedSource: migrationId });
  },
};
