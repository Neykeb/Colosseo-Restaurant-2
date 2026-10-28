import { describe, expect, it } from "vitest";

import { allergenLegend, menuCategories } from "../../app/content/menu-data";

const allDishes = menuCategories.flatMap((category) => category.sections.flatMap((section) => section.dishes));

describe("full menu data", () => {
  it("contains the verified complete category and entry counts", () => {
    expect(menuCategories).toHaveLength(8);
    expect(allDishes).toHaveLength(129);
  });

  it("keeps identifiers unique and every published price populated", () => {
    const categoryIds = menuCategories.map((category) => category.id);
    const dishIds = allDishes.map((item) => item.key);

    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    expect(new Set(dishIds).size).toBe(dishIds.length);
    expect(allDishes.every((item) => item.price.endsWith("€"))).toBe(true);
    expect(allergenLegend).toHaveLength(27);
  });

  it("does not invent the missing Bruschetta description", () => {
    const bruschetta = allDishes.find((item) => item.name === "BRUSCHETTA");

    expect(bruschetta?.description).toBeUndefined();
  });

  it("keeps source-specific lunch and original-card wording separate", () => {
    const byKey = new Map(allDishes.map((item) => [item.key, item]));

    expect(byKey.get("lunch-47")?.description).toBe("nach Art des Chefs");
    expect(byKey.get("lunch-81")?.description).toBe("mit Tomatensauce, Käse, Champignons, Ei und Paprika");
    expect(byKey.get("lunch-88")?.description).toBe("mit Tomatensauce, Käse und Krabben");
    expect(byKey.get("regular-51")?.name).toBe("PENNE ALL´ARRABIATA");
    expect(byKey.get("regular-64")?.name).toBe("CANNELONI AL FORNO");
    expect(byKey.get("regular-114")?.description).toBe("Scampi mit Knoblauch, Basilikum, Oliven, pikant, Paprika");
  });
});
