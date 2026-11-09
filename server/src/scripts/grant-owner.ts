import { createClerkClient } from "@clerk/backend";
import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { getServerEnv } from "../config/env";
import { AdminProfileRepository } from "../repositories/admin-profile-repository";

const clerkUserId = process.argv[2]?.trim();

async function grantOwner() {
  if (!clerkUserId || !/^user_[A-Za-z0-9]+$/.test(clerkUserId)) {
    throw new Error("Pass exactly one valid Clerk user ID: npm run admin:grant-owner -- user_...");
  }

  const env = getServerEnv();
  if (!env.CLERK_SECRET_KEY) throw new Error("CLERK_SECRET_KEY is required.");

  const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  const clerkUser = await clerk.users.getUser(clerkUserId);
  const displayName = clerkUser.fullName?.trim();
  if (!displayName) throw new Error("The Clerk user needs a first and last name before owner access can be granted.");

  await connectToDatabase(env);
  try {
    const owner = await new AdminProfileRepository().createOwner(clerkUser.id, displayName);
    console.log(`Owner access granted to verified Clerk user ${owner.clerkUserId}.`);
  } finally {
    await disconnectFromDatabase();
  }
}

grantOwner().catch((error: unknown) => {
  console.error("Owner grant failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
