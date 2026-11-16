import { describe, expect, it } from "vitest";

import { parseServerEnv } from "../../server/src/config/env";

describe("server environment", () => {
  it("parses a valid Atlas configuration and applies safe defaults", () => {
    const env = parseServerEnv({
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
    });

    expect(env).toEqual({
      NODE_ENV: "development",
      PORT: 3_000,
      CLERK_AUTHORIZED_PARTIES: [],
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      MONGODB_DB_NAME: "colosseo",
      MONGODB_SERVER_SELECTION_TIMEOUT_MS: 5_000,
    });
  });

  it("normalizes Clerk authorized parties and accepts a valid owner ID", () => {
    const env = parseServerEnv({
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      CLERK_OWNER_USER_ID: "user_2abc123",
      CLERK_AUTHORIZED_PARTIES: "http://localhost:5173, https://example.com",
    });

    expect(env.CLERK_OWNER_USER_ID).toBe("user_2abc123");
    expect(env.CLERK_AUTHORIZED_PARTIES).toEqual(["http://localhost:5173", "https://example.com"]);
  });

  it("accepts JSON-array authorized parties from dotenv configuration", () => {
    const env = parseServerEnv({
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      CLERK_AUTHORIZED_PARTIES: '["http://localhost:5173", "http://127.0.0.1:5173"]',
    });

    expect(env.CLERK_AUTHORIZED_PARTIES).toEqual(["http://localhost:5173", "http://127.0.0.1:5173"]);
  });

  it("rejects a non-Clerk owner identifier", () => {
    expect(() => parseServerEnv({
      MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
      CLERK_OWNER_USER_ID: "owner@example.com",
    })).toThrow(/must be a Clerk user ID/);
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

  it("accepts only a complete Resend configuration", () => {
    const base = { MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/" };
    expect(() => parseServerEnv({ ...base, RESEND_API_KEY: "re_test_key" })).toThrow(/requires API key, from address and restaurant recipient together/);

    const env = parseServerEnv({
      ...base,
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL: "Ristorante Colosseo <reservierung@example.com>",
      RESTAURANT_NOTIFICATION_EMAIL: "mohammad.amiri@dci-student.org",
    });
    expect(env.RESTAURANT_NOTIFICATION_EMAIL).toBe("mohammad.amiri@dci-student.org");
  });
});
