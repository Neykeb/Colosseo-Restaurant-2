import type { Migration } from "./types";
import { coreIndexesMigration } from "./0001_core_indexes";
import { tableAllocationVersionMigration } from "./0002_table_allocation_version";

// Add every new migration here in ascending ID order. Migration files are immutable once applied.
export const migrations: readonly Migration[] = [coreIndexesMigration, tableAllocationVersionMigration];
