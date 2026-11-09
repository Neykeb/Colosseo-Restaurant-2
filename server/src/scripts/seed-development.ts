import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { AreaModel, ServiceHoursModel, SettingModel, TableModel } from "../models/core";

await connectToDatabase();
await AreaModel.updateOne({ key: "development-area" }, { $set: { key: "development-area", name: "Development only", active: true } }, { upsert: true });
await TableModel.updateOne({ key: "development-table-1" }, { $set: { key: "development-table-1", areaKey: "development-area", seats: 2, combinable: false, active: true } }, { upsert: true });
await TableModel.updateOne({ key: "development-table-2" }, { $set: { key: "development-table-2", areaKey: "development-area", seats: 4, combinable: false, active: true } }, { upsert: true });
await ServiceHoursModel.bulkWrite(
  [2, 3, 4, 5, 6].map((weekday) => ({ updateOne: { filter: { weekday }, update: { $set: { weekday, opens: "17:00", closes: "21:00", enabled: true } }, upsert: true } })),
);
await SettingModel.bulkWrite([
  { updateOne: { filter: { key: "development-only.rules" }, update: { $set: { key: "development-only.rules", value: { marker: "PLATZHALTER", timezone: "Europe/Berlin", bookingHorizonDays: 30, leadTimeMinutes: 120, defaultDurationMinutes: 120, partySizeMin: 1, partySizeMax: 8, confirmationMode: "pending" } } }, upsert: true } },
]);
await disconnectFromDatabase();
console.log("Artificial development seed applied (PLATZHALTER only; not production data).");
