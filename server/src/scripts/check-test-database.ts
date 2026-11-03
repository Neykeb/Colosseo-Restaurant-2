import mongoose from "mongoose";

import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { assertSafeTestDatabaseTarget } from "../config/database-target";
import { getServerEnv } from "../config/env";

async function checkTestDatabase(): Promise<void> {
  const env = getServerEnv();
  assertSafeTestDatabaseTarget(env);

  try {
    await connectToDatabase(env);
    if (!mongoose.connection.db) throw new Error("MongoDB test connection is not ready");
    await mongoose.connection.db.admin().ping();
    console.info(`MongoDB test database connected: ${env.MONGODB_DB_NAME}`);
  } finally {
    await disconnectFromDatabase();
  }
}

checkTestDatabase().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown MongoDB test connection error";
  console.error(`MongoDB test connection failed: ${message}`);
  process.exitCode = 1;
});
