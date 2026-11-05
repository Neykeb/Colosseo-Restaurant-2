import mongoose from "mongoose";

import { getServerEnv, type ServerEnv } from "./env";

export type DatabaseStatus = "disconnected" | "connected" | "connecting" | "disconnecting" | "unknown";

const databaseStates: Record<number, DatabaseStatus> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export function databaseStatus(readyState = mongoose.connection.readyState): DatabaseStatus {
  return databaseStates[readyState] ?? "unknown";
}

export async function connectToDatabase(env: ServerEnv = getServerEnv()): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;

  return mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
  });
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
