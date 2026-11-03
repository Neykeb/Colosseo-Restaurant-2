import mongoose from "mongoose";

import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { assertSafeTestDatabaseTarget } from "../config/database-target";
import { getServerEnv } from "../config/env";
import { MongoMigrationStore } from "../database/migrations/mongo-migration-store";
import { migrations } from "../database/migrations/registry";
import { migrateDown, migrateUp, migrationStatus } from "../database/migrations/runner";

type MigrationCommand = "up" | "down" | "status";

function readCommand(value: string | undefined): MigrationCommand {
  if (value === "up" || value === "down" || value === "status") return value;
  throw new Error("Migration command must be one of: up, down, status");
}

async function run(): Promise<void> {
  const command = readCommand(process.argv[2]);
  const env = getServerEnv();
  if (env.NODE_ENV === "test") assertSafeTestDatabaseTarget(env);

  try {
    await connectToDatabase(env);
    const store = new MongoMigrationStore(mongoose.connection);

    if (command === "status") {
      const status = await migrationStatus(store, migrations);
      if (status.length === 0) console.info("No migrations are registered.");
      for (const migration of status) console.info(`${migration.state.padEnd(7)} ${migration.id} ${migration.description}`);
      return;
    }

    if (command === "up") {
      const executed = await migrateUp(mongoose.connection, store, migrations);
      console.info(executed.length ? `Applied migrations: ${executed.join(", ")}` : "Database is already up to date.");
      return;
    }

    const reverted = await migrateDown(mongoose.connection, store, migrations);
    console.info(reverted ? `Reverted migration: ${reverted}` : "No applied migration can be reverted.");
  } finally {
    await disconnectFromDatabase();
  }
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown migration error";
  console.error(`MongoDB migration failed: ${message}`);
  process.exitCode = 1;
});
