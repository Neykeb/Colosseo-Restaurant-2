import type { MenuCategory, MenuItem, PreviewCategory } from "./menu-management";

const imageUrl = "/images/colosseo/pasta-verdure.webp";

export const worstCaseCategories: MenuCategory[] = [
  {
    slug: "besondere-empfehlungen-fuer-gemeinsame-abende",
    name: "Besondere Empfehlungen für gemeinsame Abende, Familienfeiern und sehr lange italienische Genussmomente",
    sortOrder: 0,
    active: true,
  },
  ...Array.from({ length: 11 }, (_, index) => ({
    slug: `kategorie-${index + 2}`,
    name: `Kategorie ${index + 2} mit einem glaubwürdig langen Anzeigenamen`,
    sortOrder: index + 1,
    active: index !== 10,
  })),
];

export const worstCaseItems: MenuItem[] = Array.from({ length: 42 }, (_, index) => ({
  itemId: `dish_worst_${String(index + 1).padStart(2, "0")}`,
  categorySlug: worstCaseCategories[index % worstCaseCategories.length].slug,
  name: index === 0
    ? "Tagliatelle mit langsam geschmortem Gemüse, gerösteten Kräutern und hausgemachter Zitronencreme"
    : `Gericht ${index + 1} mit ausführlichem italienischem Namen`,
  description: index === 0
    ? "Hausgemachte Pasta mit saisonalem Gemüse, gerösteten Kräutern, einer milden Zitronencreme und einer ausführlichen Beschreibung für Gäste, die vor der Bestellung möglichst viele Einzelheiten erfahren möchten."
    : index % 3 === 0
      ? "Eine ausführliche, aber realistische Beschreibung mit mehreren Zutaten, Zubereitungshinweisen und einer zusätzlichen Empfehlung des Hauses."
      : undefined,
  priceCents: index === 0 ? 100_000 : 1_250 + index * 75,
  allergens: index === 0
    ? Array.from({ length: 12 }, (_, allergenIndex) => `Allergen ${allergenIndex + 1} mit langem Namen`)
    : index % 4 === 0 ? ["Gluten", "Milch", "Schalenfrüchte"] : [],
  imageUrl: index % 2 === 0 ? imageUrl : undefined,
  sortOrder: index,
  active: index % 9 !== 0,
  published: index % 3 === 0,
}));

export const oneCaseCategories: MenuCategory[] = [{ slug: "antipasti", name: "Antipasti", sortOrder: 0, active: true }];
export const oneCaseItems: MenuItem[] = [{
  itemId: "dish_one",
  categorySlug: "antipasti",
  name: "Mozzarella Caprese",
  description: "Tomaten, Mozzarella und Basilikum",
  priceCents: 1_050,
  allergens: ["Milch"],
  imageUrl: "/images/colosseo/caprese.webp",
  sortOrder: 0,
  active: true,
  published: true,
}];

export function previewFrom(categories: MenuCategory[], items: MenuItem[]): PreviewCategory[] {
  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.categorySlug === category.slug && item.active),
  }));
}
