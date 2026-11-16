export const restaurantAreas = [
  { key: "main-dining", name: "Gastraum", active: true },
  { key: "side-room", name: "Nebenraum", active: true },
] as const;

export const restaurantTables = [
  { key: "table-01", name: "Tisch 01", areaKey: "main-dining", minPartySize: 1, maxPartySize: 2, combinationGroupKey: "window-pair", active: true },
  { key: "table-02", name: "Tisch 02", areaKey: "main-dining", minPartySize: 1, maxPartySize: 2, combinationGroupKey: "window-pair", active: true },
  { key: "table-03", name: "Tisch 03", areaKey: "main-dining", minPartySize: 2, maxPartySize: 4, combinationGroupKey: null, active: true },
  { key: "table-04", name: "Tisch 04", areaKey: "main-dining", minPartySize: 2, maxPartySize: 4, combinationGroupKey: null, active: true },
  { key: "table-05", name: "Tisch 05", areaKey: "main-dining", minPartySize: 4, maxPartySize: 6, combinationGroupKey: "family-pair", active: true },
  { key: "table-06", name: "Tisch 06", areaKey: "main-dining", minPartySize: 2, maxPartySize: 4, combinationGroupKey: "family-pair", active: true },
  { key: "table-07", name: "Tisch 07", areaKey: "side-room", minPartySize: 2, maxPartySize: 4, combinationGroupKey: "side-room-pair", active: true },
  { key: "table-08", name: "Tisch 08", areaKey: "side-room", minPartySize: 2, maxPartySize: 4, combinationGroupKey: "side-room-pair", active: true },
] as const;

export const servicePeriods = [
  { key: "tuesday-lunch", weekday: 2, startTime: "12:00", endTime: "14:00", active: true },
  { key: "tuesday-dinner", weekday: 2, startTime: "17:00", endTime: "21:00", active: true },
  { key: "wednesday-lunch", weekday: 3, startTime: "12:00", endTime: "14:00", active: true },
  { key: "wednesday-dinner", weekday: 3, startTime: "17:00", endTime: "21:00", active: true },
  { key: "thursday-lunch", weekday: 4, startTime: "12:00", endTime: "14:00", active: true },
  { key: "thursday-dinner", weekday: 4, startTime: "17:00", endTime: "21:00", active: true },
  { key: "friday-lunch", weekday: 5, startTime: "12:00", endTime: "14:00", active: true },
  { key: "friday-dinner", weekday: 5, startTime: "17:00", endTime: "21:00", active: true },
  { key: "saturday-dinner", weekday: 6, startTime: "17:00", endTime: "21:00", active: true },
  { key: "sunday-lunch", weekday: 0, startTime: "12:00", endTime: "14:00", active: true },
  { key: "sunday-dinner", weekday: 0, startTime: "17:00", endTime: "21:00", active: true },
] as const;

export const reservationRules = {
  timezone: "Europe/Berlin",
  bookingHorizonDays: 60,
  leadTimeMinutes: 120,
  defaultDurationMinutes: 120,
  bufferMinutes: 15,
  slotIntervalMinutes: 30,
  partySizeMin: 1,
  partySizeMax: 10,
} as const;
