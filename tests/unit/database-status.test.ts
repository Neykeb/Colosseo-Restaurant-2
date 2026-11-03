import { describe, expect, it } from "vitest";

import { databaseStatus } from "../../server/src/config/database";

describe("database status", () => {
  it.each([
    [0, "disconnected"],
    [1, "connected"],
    [2, "connecting"],
    [3, "disconnecting"],
    [99, "unknown"],
  ] as const)("maps Mongoose readyState %s to %s", (readyState, expected) => {
    expect(databaseStatus(readyState)).toBe(expected);
  });
});
