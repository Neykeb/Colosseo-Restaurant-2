import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { getServerEnv } from "../config/env";
import { AdminProfileModel } from "../models/core";

const env = getServerEnv();
if (!env.CLERK_OWNER_USER_ID || !env.CLERK_OWNER_DISPLAY_NAME) {
  throw new Error("CLERK_OWNER_USER_ID and CLERK_OWNER_DISPLAY_NAME are required for owner bootstrap");
}

await connectToDatabase(env);
await AdminProfileModel.updateOne(
  { clerkUserId: env.CLERK_OWNER_USER_ID },
  { $set: { clerkUserId: env.CLERK_OWNER_USER_ID, displayName: env.CLERK_OWNER_DISPLAY_NAME, role: "owner", active: true } },
  { upsert: true },
);
await disconnectFromDatabase();
console.log("Owner admin profile bootstrapped.");
