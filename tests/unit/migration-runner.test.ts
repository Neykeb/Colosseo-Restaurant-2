import type { Connection } from "mongoose";
import { describe, expect, it, vi } from "vitest";

import { migrateDown, migrateUp, migrationStatus, validateMigrations } from "../../server/src/database/migrations/runner";
import type { AppliedMigration, Migration, MigrationStore } from "../../server/src/database/migrations/types";

function createStore(initial: AppliedMigration[] = []): MigrationStore & { applied: AppliedMigration[] } {
  const store = {
    applied: [...initial],
    async listApplied() {
      return [...store.applied];
    },
    async markApplied(migration: Migration) {
      store.applied.push({ id: migration.id, appliedAt: new Date("2026-11-03T12:00:00Z") });
    },
    async unmarkApplied(migration: Migration) {
      store.applied = store.applied.filter((entry) => entry.id !== migration.id);
    },
    async withLock<Result>(operation: () => Promise<Result>) {
      return operation();
    },
  };
  return store;
}

const connection = {} as Connection;

describe("migration runner", () => {
  it("executes pending migrations once and in registry order", async () => {
    const calls: string[] = [];
    const migrations: Migration[] = [
      { id: "0001_first", description: "first", up: async () => { calls.push("first"); } },
      { id: "0002_second", description: "second", up: async () => { calls.push("second"); } },
    ];
    const store = createStore();

    await expect(migrateUp(connection, store, migrations)).resolves.toEqual(["0001_first", "0002_second"]);
    await expect(migrateUp(connection, store, migrations)).resolves.toEqual([]);
    expect(calls).toEqual(["first", "second"]);
  });

  it("stops after a failed migration without marking it as applied", async () => {
    const failure = new Error("migration failed");
    const migrations: Migration[] = [
      { id: "0001_first", description: "first", up: vi.fn().mockRejectedValue(failure) },
      { id: "0002_second", description: "second", up: vi.fn() },
    ];
    const store = createStore();

    await expect(migrateUp(connection, store, migrations)).rejects.toThrow("migration failed");
    expect(store.applied).toEqual([]);
    expect(migrations[1].up).not.toHaveBeenCalled();
  });

  it("reports status and reverts only the latest applied migration", async () => {
    const down = vi.fn();
    const migrations: Migration[] = [
      { id: "0001_first", description: "first", up: vi.fn(), down: vi.fn() },
      { id: "0002_second", description: "second", up: vi.fn(), down },
    ];
    const store = createStore([
      { id: "0001_first", appliedAt: new Date("2026-11-03T10:00:00Z") },
      { id: "0002_second", appliedAt: new Date("2026-11-03T11:00:00Z") },
    ]);

    await expect(migrationStatus(store, migrations)).resolves.toMatchObject([
      { id: "0001_first", state: "applied" },
      { id: "0002_second", state: "applied" },
    ]);
    await expect(migrateDown(connection, store, migrations)).resolves.toBe("0002_second");
    expect(down).toHaveBeenCalledOnce();
    expect(store.applied.map((entry) => entry.id)).toEqual(["0001_first"]);
  });

  it("rejects duplicate, malformed and unsorted migration IDs", () => {
    const migration = (id: string): Migration => ({ id, description: id, up: vi.fn() });

    expect(() => validateMigrations([migration("0001_valid"), migration("0001_valid")])).toThrow(/Duplicate/);
    expect(() => validateMigrations([migration("first")])).toThrow(/Invalid migration ID/);
    expect(() => validateMigrations([migration("0002_second"), migration("0001_first")])).toThrow(/ascending order/);
  });

  it("rejects migration history that is missing from the source registry", async () => {
    const store = createStore([{ id: "0001_removed", appliedAt: new Date("2026-11-03T10:00:00Z") }]);

    await expect(migrationStatus(store, [])).rejects.toThrow(/missing from the registry/);
    await expect(migrateUp(connection, store, [])).rejects.toThrow(/missing from the registry/);
  });
});
