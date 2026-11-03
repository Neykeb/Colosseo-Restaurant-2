import { connectToDatabase, databaseStatus, disconnectFromDatabase } from "../config/database";

async function checkDatabase(): Promise<void> {
  try {
    await connectToDatabase();
    console.info(`MongoDB connection: ${databaseStatus()}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown MongoDB connection error";
    console.error(`MongoDB connection failed: ${message}`);
    process.exitCode = 1;
  } finally {
    await disconnectFromDatabase();
  }
}

await checkDatabase();
