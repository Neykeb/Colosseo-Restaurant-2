import { describe, expect, it } from "vitest";

import { parseServerEnv } from "../../server/src/config/env";

describe("server environment", () => {
  it("parses a valid Atlas configuration and applies safe defaults", () => {
    const env = parseServerEnv({
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
    });

    expect(env).toEqual({
      NODE_ENV: "development",
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      MONGODB_DB_NAME: "colosseo",
      MONGODB_SERVER_SELECTION_TIMEOUT_MS: 5_000,
    });
  });

  it("rejects a missing connection string", () => {
    expect(() => parseServerEnv({})).toThrow(/MONGODB_URI is required/);
  });

  it("rejects unsupported protocols and unsafe database names", () => {
    expect(() =>
      parseServerEnv({
        MONGODB_URI: "https://example.com",
        MONGODB_DB_NAME: "colosseo production",
      }),
    ).toThrow(/MONGODB_URI must use/);
  });

  it("rejects an incomplete Atlas URI before Mongoose tries to connect", () => {
    expect(() =>
      parseServerEnv({
        MONGODB_URI: "mongodb+srv://username:1",
      }),
    ).toThrow(/not a complete Atlas driver URI/);
  });
});
