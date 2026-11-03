import type { Connection } from "mongoose";

export interface Migration {
  id: string;
  description: string;
  up: (connection: Connection) => Promise<void>;
  down?: (connection: Connection) => Promise<void>;
}

export interface AppliedMigration {
  id: string;
  appliedAt: Date;
}

export interface MigrationStore {
  listApplied: () => Promise<AppliedMigration[]>;
  markApplied: (migration: Migration) => Promise<void>;
  unmarkApplied: (migration: Migration) => Promise<void>;
  withLock: <Result>(operation: () => Promise<Result>) => Promise<Result>;
}

export interface MigrationStatus {
  id: string;
  description: string;
  state: "applied" | "pending";
  appliedAt?: Date;
}
