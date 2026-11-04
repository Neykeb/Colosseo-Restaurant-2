import type { Migration } from "./types";
import { coreIndexesMigration } from "./0001_core_indexes";

// Add every new migration here in ascending ID order. Migration files are immutable once applied.
export const migrations: readonly Migration[] = [coreIndexesMigration];
