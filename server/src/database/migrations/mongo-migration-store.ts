import { randomUUID } from "node:crypto";

import { mongo, type Connection } from "mongoose";

import type { AppliedMigration, Migration, MigrationStore } from "./types";

interface MigrationRecord {
  _id: string;
  description: string;
  appliedAt: Date;
}

interface MigrationLock {
  _id: "global";
  owner: string;
  expiresAt: Date;
}

const historyCollectionName = "_colosseo_migrations";
const lockCollectionName = "_colosseo_migration_locks";
const lockDurationMs = 10 * 60 * 1_000;

export class MongoMigrationStore implements MigrationStore {
  constructor(private readonly connection: Connection) {}

  private database() {
    if (!this.connection.db) throw new Error("MongoDB connection is not ready");
    return this.connection.db;
  }

  async listApplied(): Promise<AppliedMigration[]> {
    const records = await this.database()
      .collection<MigrationRecord>(historyCollectionName)
      .find({})
      .sort({ _id: 1 })
      .toArray();

    return records.map((record) => ({ id: record._id, appliedAt: record.appliedAt }));
  }

  async markApplied(migration: Migration): Promise<void> {
    await this.database().collection<MigrationRecord>(historyCollectionName).insertOne({
      _id: migration.id,
      description: migration.description,
      appliedAt: new Date(),
    });
  }

  async unmarkApplied(migration: Migration): Promise<void> {
    await this.database().collection<MigrationRecord>(historyCollectionName).deleteOne({ _id: migration.id });
  }

  async withLock<Result>(operation: () => Promise<Result>): Promise<Result> {
    const collection = this.database().collection<MigrationLock>(lockCollectionName);
    const owner = randomUUID();
    const now = new Date();
    await collection.deleteOne({ _id: "global", expiresAt: { $lte: now } });

    try {
      await collection.insertOne({
        _id: "global",
        owner,
        expiresAt: new Date(now.getTime() + lockDurationMs),
      });
    } catch (error) {
      if (error instanceof mongo.MongoServerError && error.code === 11_000) {
        throw new Error("Another migration process currently holds the database lock");
      }
      throw error;
    }

    try {
      return await operation();
    } finally {
      await collection.deleteOne({ _id: "global", owner });
    }
  }
}
