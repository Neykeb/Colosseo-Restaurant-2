import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { getServerEnv } from "../config/env";
import { reservationRules, restaurantAreas, restaurantTables, servicePeriods } from "../data/restaurant-configuration";
import { AreaModel, ServicePeriodModel, SettingModel, TableModel } from "../models/core";

const env = getServerEnv();
if (env.NODE_ENV === "production") throw new Error("Development fixtures must never be written to a production environment.");

await connectToDatabase(env);
try {
  for (const area of restaurantAreas) {
    await AreaModel.updateOne({ key: area.key }, { $set: area }, { upsert: true, runValidators: true });
  }
  for (const table of restaurantTables) {
    await TableModel.updateOne({ key: table.key }, { $set: table }, { upsert: true, runValidators: true });
  }
  for (const period of servicePeriods) {
    await ServicePeriodModel.updateOne({ key: period.key }, { $set: period }, { upsert: true, runValidators: true });
  }
  await SettingModel.updateOne(
    { key: "reservation.rules" },
    { $set: { key: "reservation.rules", value: reservationRules } },
    { upsert: true, runValidators: true },
  );
} finally {
  await disconnectFromDatabase();
}
console.log(`Restaurant configuration applied: ${restaurantAreas.length} areas, ${restaurantTables.length} tables and ${servicePeriods.length} service periods.`);
