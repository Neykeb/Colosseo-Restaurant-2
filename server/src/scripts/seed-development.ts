import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { AreaModel, TableModel } from "../models/core";

await connectToDatabase();
await AreaModel.updateOne({ key: "development-area" }, { $set: { key: "development-area", name: "Development only", active: true } }, { upsert: true });
await TableModel.updateOne({ key: "development-table-1" }, { $set: { key: "development-table-1", areaKey: "development-area", seats: 2, combinable: false, active: true } }, { upsert: true });
await disconnectFromDatabase();
console.log("Artificial development seed applied.");
