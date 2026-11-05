import { describe, expect, it } from "vitest";

import { authorizeAdmin } from "../../server/src/auth/admin-authorization";

const owner = { clerkUserId: "user_owner", role: "owner" as const, active: true, displayName: "Owner" };
const staff = { clerkUserId: "user_staff", role: "staff" as const, active: true, displayName: "Staff" };

describe("admin authorization", () => {
  it("allows an active owner for owner routes", () => expect(authorizeAdmin(owner, "owner")).toEqual({ ok: true }));
  it("denies staff access to owner routes", () => expect(authorizeAdmin(staff, "owner")).toMatchObject({ ok: false, status: 403, code: "OWNER_ROLE_REQUIRED" }));
  it("denies inactive profiles", () => expect(authorizeAdmin({ ...owner, active: false })).toMatchObject({ ok: false, status: 403, code: "ADMIN_PROFILE_INACTIVE" }));
  it("denies missing profiles", () => expect(authorizeAdmin(null)).toMatchObject({ ok: false, status: 403, code: "ADMIN_PROFILE_REQUIRED" }));
});
