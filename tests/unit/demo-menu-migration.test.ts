import type { Connection } from "mongoose";
import { describe, expect, it, vi } from "vitest";

import { legacyMenuIndexCleanupMigration } from "../../server/src/database/migrations/0012_legacy_menu_index_cleanup";
import { demoMenuCategories, demoMenuItems } from "../../server/src/database/migrations/0013_demo_menu_data";

describe("demo menu migration data", () => {
  it("maps the verified source without losing categories or dishes", () => {
    expect(demoMenuCategories).toHaveLength(8);
    expect(demoMenuItems).toHaveLength(129);
    expect(new Set(demoMenuItems.map((item) => item.itemId)).size).toBe(129);
  });

  it("publishes valid prices and normalized allergen codes", () => {
    const caprese = demoMenuItems.find((item) => item.itemId === "regular-11");
    const bruschetta = demoMenuItems.find((item) => item.itemId === "regular-15");

    expect(caprese).toMatchObject({ priceCents: 1050, allergens: ["g", "h"], published: true });
    expect(bruschetta).not.toHaveProperty("description");
    expect(demoMenuItems.every((item) => Number.isInteger(item.priceCents) && item.priceCents >= 0)).toBe(true);
  });

  it("removes only the obsolete unique categoryId index when it exists", async () => {
    const dropIndex = vi.fn();
    const collection = { indexes: vi.fn().mockResolvedValue([{ name: "_id_" }, { name: "slug_1" }, { name: "categoryId_1" }]), dropIndex };
    const connection = { collection: vi.fn().mockReturnValue(collection) } as unknown as Connection;

    await legacyMenuIndexCleanupMigration.up(connection);

    expect(connection.collection).toHaveBeenCalledWith("menucategories");
    expect(dropIndex).toHaveBeenCalledOnce();
    expect(dropIndex).toHaveBeenCalledWith("categoryId_1");
  });
});
