import type { NextFunction, Request, RequestHandler, Response } from "express";
import { getAuth } from "@clerk/express";

export type AdminRole = "owner" | "staff";
export type AdminProfileRecord = { clerkUserId: string; role: AdminRole; active: boolean; displayName: string };
export type GetAuthenticatedUserId = (request: Request) => string | null;

const getClerkUserId: GetAuthenticatedUserId = (request) => getAuth(request).userId;

export function authorizeAdmin(profile: AdminProfileRecord | null, requiredRole?: AdminRole): { ok: true } | { ok: false; status: 401 | 403; code: string } {
  if (!profile) return { ok: false, status: 403, code: "ADMIN_PROFILE_REQUIRED" };
  if (!profile.active) return { ok: false, status: 403, code: "ADMIN_PROFILE_INACTIVE" };
  if (requiredRole === "owner" && profile.role !== "owner") return { ok: false, status: 403, code: "OWNER_ROLE_REQUIRED" };
  return { ok: true };
}

export function requireAdminRole(
  findProfile: (clerkUserId: string) => Promise<AdminProfileRecord | null>,
  requiredRole: AdminRole = "owner",
  getAuthenticatedUserId: GetAuthenticatedUserId = getClerkUserId,
): RequestHandler {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      response.status(401).json({ error: { code: "AUTHENTICATION_REQUIRED", message: "Authentication is required." } });
      return;
    }

    const profile = await findProfile(userId);
    const result = authorizeAdmin(profile, requiredRole);
    if (!result.ok) {
      response.status(result.status).json({ error: { code: result.code, message: "You are not authorized for this resource." } });
      return;
    }
    response.locals.adminProfile = profile;
    next();
  };
}
