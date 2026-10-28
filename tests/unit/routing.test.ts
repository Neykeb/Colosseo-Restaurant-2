import { describe, expect, it } from "vitest";

import { getPageKey, pathFor } from "../../app/content/site-content";

describe("localized routing", () => {
  it("builds the expected localized paths", () => {
    expect(pathFor("de", "menu")).toBe("/de/speisekarte");
    expect(pathFor("en", "events")).toBe("/en/events");
    expect(pathFor("it", "restaurant")).toBe("/it/ristorante");
  });

  it("maps localized slugs back to page keys", () => {
    expect(getPageKey("de", "feiern")).toBe("events");
    expect(getPageKey("it", "contatti")).toBe("contact");
    expect(getPageKey("en", undefined)).toBe("home");
  });

  it("rejects unknown slugs", () => {
    expect(getPageKey("de", "bestellen")).toBeNull();
  });
});
