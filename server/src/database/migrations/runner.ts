import type { Connection } from "mongoose";

import type { Migration, MigrationStatus, MigrationStore } from "./types";

const migrationIdPattern = /^\d{4}_[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateMigrations(migrations: readonly Migration[]): void {
  const ids = new Set<string>();
  let previousId = "";

  for (const migration of migrations) {
    if (!migrationIdPattern.test(migration.id)) {
      throw new Error(`Invalid migration ID "${migration.id}"; expected 0001_short-description`);
    }
    if (ids.has(migration.id)) {
      throw new Error(`Duplicate migration ID "${migration.id}"`);
    }
    if (previousId && migration.id.localeCompare(previousId) <= 0) {
      throw new Error(`Migration "${migration.id}" is not registered in ascending order`);
    }
    ids.add(migration.id);
    previousId = migration.id;
  }
}

function assertAppliedMigrationsKnown(applied: readonly { id: string }[], migrations: readonly Migration[]): void {
  const registeredIds = new Set(migrations.map((migration) => migration.id));
  const missing = applied.find((migration) => !registeredIds.has(migration.id));
  if (missing) throw new Error(`Applied migration "${missing.id}" is missing from the registry`);
}

export async function migrationStatus(store: MigrationStore, migrations: readonly Migration[]): Promise<MigrationStatus[]> {
  validateMigrations(migrations);
  const appliedMigrations = await store.listApplied();
  assertAppliedMigrationsKnown(appliedMigrations, migrations);
  const applied = new Map(appliedMigrations.map((migration) => [migration.id, migration.appliedAt]));

  return migrations.map((migration) => ({
    id: migration.id,
    description: migration.description,
    state: applied.has(migration.id) ? "applied" : "pending",
    ...(applied.get(migration.id) ? { appliedAt: applied.get(migration.id) } : {}),
  }));
}

export async function migrateUp(
  connection: Connection,
  store: MigrationStore,
  migrations: readonly Migration[],
): Promise<string[]> {
  validateMigrations(migrations);

  return store.withLock(async () => {
    const appliedMigrations = await store.listApplied();
    assertAppliedMigrationsKnown(appliedMigrations, migrations);
    const appliedIds = new Set(appliedMigrations.map((migration) => migration.id));
    const executed: string[] = [];

    for (const migration of migrations) {
      if (appliedIds.has(migration.id)) continue;
      await migration.up(connection);
      await store.markApplied(migration);
      executed.push(migration.id);
    }

    return executed;
  });
}

export async function migrateDown(
  connection: Connection,
  store: MigrationStore,
  migrations: readonly Migration[],
): Promise<string | null> {
  validateMigrations(migrations);

  return store.withLock(async () => {
    const applied = await store.listApplied();
    assertAppliedMigrationsKnown(applied, migrations);
    const latest = [...applied].sort((left, right) => right.id.localeCompare(left.id))[0];
    if (!latest) return null;

    const migration = migrations.find((candidate) => candidate.id === latest.id);
    if (!migration) throw new Error(`Applied migration "${latest.id}" is missing from the registry`);
    if (!migration.down) throw new Error(`Migration "${latest.id}" does not provide a down operation`);

    await migration.down(connection);
    await store.unmarkApplied(migration);
    return migration.id;
  });
}
