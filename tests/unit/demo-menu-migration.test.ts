import { describe, expect, it } from "vitest";

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
});
