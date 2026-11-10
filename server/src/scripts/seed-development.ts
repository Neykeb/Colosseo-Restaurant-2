import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { AreaModel, EventInquiryModel, ServiceHoursModel, SettingModel, TableModel } from "../models/core";

await connectToDatabase();
await AreaModel.updateOne({ key: "development-area" }, { $set: { key: "development-area", name: "Development only", active: true } }, { upsert: true });
await TableModel.updateOne({ key: "development-table-1" }, { $set: { key: "development-table-1", name: "PLATZHALTER Tisch 1", areaKey: "development-area", minPartySize: 1, maxPartySize: 2, combinationGroupKey: null, active: true } }, { upsert: true });
await TableModel.updateOne({ key: "development-table-2" }, { $set: { key: "development-table-2", name: "PLATZHALTER Tisch 2", areaKey: "development-area", minPartySize: 1, maxPartySize: 4, combinationGroupKey: null, active: true } }, { upsert: true });
await ServiceHoursModel.bulkWrite(
  [2, 3, 4, 5, 6].map((weekday) => ({ updateOne: { filter: { key: `development-${weekday}-dinner` }, update: { $set: { key: `development-${weekday}-dinner`, weekday, startTime: "17:00", endTime: "21:00", active: true } }, upsert: true } })),
);
await SettingModel.bulkWrite([
  { updateOne: { filter: { key: "reservation.rules" }, update: { $set: { key: "reservation.rules", value: { marker: "PLATZHALTER", timezone: "Europe/Berlin", bookingHorizonDays: 30, leadTimeMinutes: 120, defaultDurationMinutes: 120, bufferMinutes: 15, slotIntervalMinutes: 30, partySizeMin: 1, partySizeMax: 8, confirmationMode: "pending" } } }, upsert: true } },
]);
await EventInquiryModel.bulkWrite([
  { updateOne: { filter: { inquiryId: "inq_development_birthday" }, update: { $set: { inquiryId: "inq_development_birthday", name: "PLATZHALTER Anna Müller", email: "anna.mueller@example.com", phone: "+49 170 1234567", eventType: "Privates Dinner", requestedDate: "2026-12-12", partySize: 24, message: "PLATZHALTER: Abendessen mit Menü; separater Bereich angefragt.", status: "new" } }, upsert: true } },
  { updateOne: { filter: { inquiryId: "inq_development_company" }, update: { $set: { inquiryId: "inq_development_company", name: "PLATZHALTER Max Beispiel", email: "max.beispiel@example.com", eventType: "Firmenfeier", requestedDate: "2027-01-20", partySize: 35, message: "PLATZHALTER: Firmenfeier mit gesetztem Menü und Getränkepaket angefragt.", status: "in_review" } }, upsert: true } },
  { updateOne: { filter: { inquiryId: "inq_development_birthday" }, update: { $set: { inquiryId: "inq_development_birthday", name: "PLATZHALTER Lina Beispiel", email: "lina.beispiel@example.com", eventType: "Geburtstag", requestedDate: "2027-02-14", partySize: 12, message: "PLATZHALTER: Geburtstagsessen mit gemeinsamer Tafel angefragt.", status: "new" } }, upsert: true } },
]);
await disconnectFromDatabase();
console.log("Artificial development seed applied, including two event inquiry examples (PLATZHALTER only; not production data).");
