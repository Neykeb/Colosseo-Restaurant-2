import type { ServerEnv } from "./env";

export function assertSafeTestDatabaseTarget(env: ServerEnv): void {
  if (env.NODE_ENV !== "test") {
    throw new Error("Database test commands require NODE_ENV=test");
  }

  if (!env.MONGODB_URI.startsWith("mongodb+srv://")) {
    throw new Error("Database test commands require the confirmed MongoDB Atlas mongodb+srv:// protocol");
  }

  if (!env.MONGODB_DB_NAME.endsWith("_test")) {
    throw new Error("Database test commands require a database name ending in _test");
  }
}
