import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { getServerEnv } from "../config/env";
import { reservationRules, restaurantAreas, restaurantTables, servicePeriods } from "../data/restaurant-configuration";
import { AreaModel, EventInquiryModel, ServicePeriodModel, SettingModel, TableModel } from "../models/core";

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
  await EventInquiryModel.bulkWrite([
    { updateOne: { filter: { inquiryId: "INQ-DEV-PRIVATES-DINNER" }, update: { $set: { inquiryId: "INQ-DEV-PRIVATES-DINNER", name: "PLATZHALTER Anna Beispiel", email: "anna.beispiel@example.com", phone: "+49 170 0000001", eventType: "Privates Dinner", requestedDate: "2026-12-12", partySize: 24, message: "PLATZHALTER: Menü und separater Bereich angefragt.", status: "new" } }, upsert: true } },
    { updateOne: { filter: { inquiryId: "INQ-DEV-FIRMENFEIER" }, update: { $set: { inquiryId: "INQ-DEV-FIRMENFEIER", name: "PLATZHALTER Max Beispiel", email: "max.beispiel@example.com", eventType: "Firmenfeier", requestedDate: "2027-01-20", partySize: 35, message: "PLATZHALTER: Menü und Getränkepaket angefragt.", status: "in_review" } }, upsert: true } },
    { updateOne: { filter: { inquiryId: "INQ-DEV-GEBURTSTAG" }, update: { $set: { inquiryId: "INQ-DEV-GEBURTSTAG", name: "PLATZHALTER Lina Beispiel", email: "lina.beispiel@example.com", eventType: "Geburtstag", requestedDate: "2027-02-14", partySize: 12, message: "PLATZHALTER: Geburtstagsessen mit gemeinsamer Tafel angefragt.", status: "new" } }, upsert: true } },
  ]);
} finally {
  await disconnectFromDatabase();
}
console.log(`Restaurant configuration applied: ${restaurantAreas.length} areas, ${restaurantTables.length} tables and ${servicePeriods.length} service periods.`);
