import { describe, expect, it } from "vitest";

import { assertSafeTestDatabaseTarget } from "../../server/src/config/database-target";
import { parseServerEnv } from "../../server/src/config/env";

describe("test database target guard", () => {
  it("accepts a dedicated Atlas test database", () => {
    const env = parseServerEnv({
      NODE_ENV: "test",
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      MONGODB_DB_NAME: "colosseo_test",
    });

    expect(() => assertSafeTestDatabaseTarget(env)).not.toThrow();
  });

  it("rejects development mode and non-test database names", () => {
    const development = parseServerEnv({
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      MONGODB_DB_NAME: "colosseo_test",
    });
    const unsafeName = parseServerEnv({
      NODE_ENV: "test",
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      MONGODB_DB_NAME: "colosseo",
    });

    expect(() => assertSafeTestDatabaseTarget(development)).toThrow(/NODE_ENV=test/);
    expect(() => assertSafeTestDatabaseTarget(unsafeName)).toThrow(/ending in _test/);
  });

  it("rejects non-Atlas test connections", () => {
    const env = parseServerEnv({
      NODE_ENV: "test",
      MONGODB_URI: "mongodb://localhost:27017",
      MONGODB_DB_NAME: "colosseo_test",
    });

    expect(() => assertSafeTestDatabaseTarget(env)).toThrow(/MongoDB Atlas/);
  });
});
