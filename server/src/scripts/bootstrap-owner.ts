import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { getServerEnv } from "../config/env";
import { AdminProfileRepository } from "../repositories/admin-profile-repository";

async function bootstrapOwner() {
  const env = getServerEnv();
  if (!env.CLERK_OWNER_USER_ID) throw new Error("CLERK_OWNER_USER_ID is required.");
  if (!env.CLERK_OWNER_DISPLAY_NAME) throw new Error("CLERK_OWNER_DISPLAY_NAME is required.");

  await connectToDatabase(env);
  try {
    const owner = await new AdminProfileRepository().createOwner(env.CLERK_OWNER_USER_ID, env.CLERK_OWNER_DISPLAY_NAME);
    console.log(`Owner profile ready for Clerk user ${owner.clerkUserId}.`);
  } finally {
    await disconnectFromDatabase();
  }
}

bootstrapOwner().catch((error: unknown) => {
  console.error("Owner bootstrap failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
