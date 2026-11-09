import type { Migration } from "./types";

const periods = [
  [2, "tuesday"], [3, "wednesday"], [4, "thursday"], [5, "friday"],
] as const;

export const initialRestaurantConfigurationMigration: Migration = {
  id: "0004_initial-restaurant-configuration",
  description: "Replace development markers and prepare multiple reservable service periods",
  async up(connection) {
    const servicePeriods: Array<{ key: string; weekday: number; startTime: string; endTime: string; active: boolean }> = [...periods.flatMap(([weekday, day]) => [
      { key: `${day}-lunch`, weekday, startTime: "12:00", endTime: "14:00", active: true },
      { key: `${day}-dinner`, weekday, startTime: "17:00", endTime: "21:00", active: true },
    ]),
      { key: "saturday-dinner", weekday: 6, startTime: "17:00", endTime: "21:00", active: true },
      { key: "sunday-lunch", weekday: 0, startTime: "12:00", endTime: "14:00", active: true },
    ];
    for (const period of servicePeriods) await connection.collection("servicehours").updateOne({ key: period.key }, { $set: period }, { upsert: true });
    await connection.collection("servicehours").createIndex({ key: 1 }, { unique: true });
    await connection.collection("servicehours").createIndex({ weekday: 1, startTime: 1, active: 1 });
    await connection.collection("settings").updateOne({ key: "reservation.rules" }, { $set: { key: "reservation.rules", value: { marker: "PLATZHALTER", timezone: "Europe/Berlin", bookingHorizonDays: 60, leadTimeMinutes: 120, defaultDurationMinutes: 120, bufferMinutes: 15, slotIntervalMinutes: 30, partySizeMin: 1, partySizeMax: 10, confirmationMode: "pending" } } }, { upsert: true });
  },
};
