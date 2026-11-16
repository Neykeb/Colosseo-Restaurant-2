import { describe, expect, it } from "vitest";

import { ADMIN_DISPLAY_NAME_MAX_LENGTH, AdminProfileModel } from "../../server/src/models/core";

const baseProfile = {
  clerkUserId: "user_owner",
  role: "owner",
  active: true,
} as const;

describe("admin profile model", () => {
  it("accepts a display name at the documented boundary", async () => {
    const profile = new AdminProfileModel({
      ...baseProfile,
      displayName: "A".repeat(ADMIN_DISPLAY_NAME_MAX_LENGTH),
    });

    await expect(profile.validate()).resolves.toBeUndefined();
  });

  it("rejects a display name beyond the documented boundary", async () => {
    const profile = new AdminProfileModel({
      ...baseProfile,
      displayName: "A".repeat(ADMIN_DISPLAY_NAME_MAX_LENGTH + 1),
    });

    await expect(profile.validate()).rejects.toMatchObject({
      errors: { displayName: expect.anything() },
    });
  });
});
