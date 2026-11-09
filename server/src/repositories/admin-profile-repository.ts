import { AdminProfileModel } from "../models/core";
import type { AdminProfileRecord } from "../auth/admin-authorization";

export class AdminProfileRepository {
  async findByClerkUserId(clerkUserId: string): Promise<AdminProfileRecord | null> {
    return AdminProfileModel.findOne({ clerkUserId }).select({ _id: 0, clerkUserId: 1, role: 1, active: 1, displayName: 1 }).lean().exec() as Promise<AdminProfileRecord | null>;
  }

  async createOwner(clerkUserId: string, displayName: string): Promise<AdminProfileRecord> {
    const profile = await AdminProfileModel.findOneAndUpdate(
      { clerkUserId },
      { $set: { role: "owner", active: true, displayName } },
      { returnDocument: "after", upsert: true, runValidators: true },
    ).select({ _id: 0, clerkUserId: 1, role: 1, active: 1, displayName: 1 }).lean().exec();

    if (!profile) throw new Error("Owner profile could not be created.");
    return profile as AdminProfileRecord;
  }
}
