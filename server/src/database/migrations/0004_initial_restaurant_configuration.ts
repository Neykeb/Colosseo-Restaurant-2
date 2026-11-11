import type { Migration } from "./types";

const areaKeyRenames = new Map([
  ["demo-main-dining", "main-dining"],
  ["demo-side-room", "side-room"],
]);

export const initialRestaurantConfigurationMigration: Migration = {
  id: "0004_initial-restaurant-configuration",
  description: "Replace development markers and prepare multiple reservable service periods",
  async up(connection) {
    for (const [previousKey, nextKey] of areaKeyRenames) {
      await connection.collection("areas").updateOne({ key: previousKey }, { $set: { key: nextKey } });
      await connection.collection("tables").updateMany({ areaKey: previousKey }, { $set: { areaKey: nextKey } });
    }

    for (let number = 1; number <= 8; number += 1) {
      const suffix = String(number).padStart(2, "0");
      await connection.collection("tables").updateOne({ key: `demo-table-${suffix}` }, { $set: { key: `table-${suffix}` } });
    }

    await connection.collection("tables").updateMany({ combinationGroupKey: "demo-window-pair" }, { $set: { combinationGroupKey: "window-pair" } });
    await connection.collection("tables").updateMany({ combinationGroupKey: "demo-family-pair" }, { $set: { combinationGroupKey: "family-pair" } });
    await connection.collection("tables").updateMany({ combinationGroupKey: "demo-side-room-pair" }, { $set: { combinationGroupKey: "side-room-pair" } });

    await connection.collection("tables").deleteMany({ key: /^development-/ });
    await connection.collection("areas").deleteMany({ key: /^development-/ });
    await connection.collection("settings").deleteMany({ key: /^development-/ });
    await connection.collection("servicehours").deleteMany({});
    await connection.collection("servicehours").dropIndex("weekday_1").catch((error: unknown) => {
      if ((error as { code?: number }).code !== 27) throw error;
    });
    await connection.collection("servicehours").createIndex({ key: 1 }, { unique: true });
    await connection.collection("servicehours").createIndex({ weekday: 1, startTime: 1, active: 1 });
  },
  async down(connection) {
    await connection.collection("servicehours").deleteMany({});
    await connection.collection("servicehours").dropIndex("key_1").catch((error: unknown) => {
      if ((error as { code?: number }).code !== 27) throw error;
    });
    await connection.collection("servicehours").dropIndex("weekday_1_startTime_1_active_1").catch((error: unknown) => {
      if ((error as { code?: number }).code !== 27) throw error;
    });
    await connection.collection("servicehours").createIndex({ weekday: 1 }, { unique: true });

    for (const [previousKey, nextKey] of areaKeyRenames) {
      await connection.collection("areas").updateOne({ key: nextKey }, { $set: { key: previousKey } });
      await connection.collection("tables").updateMany({ areaKey: nextKey }, { $set: { areaKey: previousKey } });
    }
    for (let number = 1; number <= 8; number += 1) {
      const suffix = String(number).padStart(2, "0");
      await connection.collection("tables").updateOne({ key: `table-${suffix}` }, { $set: { key: `demo-table-${suffix}` } });
    }
    await connection.collection("tables").updateMany({ combinationGroupKey: "window-pair" }, { $set: { combinationGroupKey: "demo-window-pair" } });
    await connection.collection("tables").updateMany({ combinationGroupKey: "family-pair" }, { $set: { combinationGroupKey: "demo-family-pair" } });
    await connection.collection("tables").updateMany({ combinationGroupKey: "side-room-pair" }, { $set: { combinationGroupKey: "demo-side-room-pair" } });
  },
};
