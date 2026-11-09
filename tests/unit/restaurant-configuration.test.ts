import { describe, expect, it } from "vitest";

import { reservationRules, restaurantAreas, restaurantTables, servicePeriods } from "../../server/src/data/restaurant-configuration";
import { ServicePeriodModel, TableModel } from "../../server/src/models/core";

describe("restaurant configuration", () => {
  it("keeps every table inside a declared area", () => {
    const areaKeys = new Set(restaurantAreas.map(({ key }) => key));
    expect(restaurantTables.every(({ areaKey }) => areaKeys.has(areaKey))).toBe(true);
  });

  it("uses combination groups only for complete pairs", () => {
    const counts = new Map<string, number>();
    for (const table of restaurantTables) {
      if (table.combinationGroupKey) counts.set(table.combinationGroupKey, (counts.get(table.combinationGroupKey) ?? 0) + 1);
    }
    expect([...counts.values()]).toEqual([2, 2, 2]);
  });

  it("rejects an inverted party-size boundary", async () => {
    const table = new TableModel({
      key: "invalid-table",
      name: "Invalid table",
      areaKey: "main-dining",
      minPartySize: 5,
      maxPartySize: 4,
      active: true,
    });
    await expect(table.validate()).rejects.toMatchObject({ errors: { maxPartySize: expect.anything() } });
  });

  it("defines non-overlapping service periods with valid time ranges", async () => {
    for (const period of servicePeriods) {
      await expect(new ServicePeriodModel(period).validate()).resolves.toBeUndefined();
    }

    const byWeekday = new Map<number, Array<(typeof servicePeriods)[number]>>();
    for (const period of servicePeriods) {
      const periods = byWeekday.get(period.weekday) ?? [];
      periods.push(period);
      byWeekday.set(period.weekday, periods);
    }
    for (const periods of byWeekday.values()) {
      const sorted = [...periods].sort((left, right) => left.startTime.localeCompare(right.startTime));
      for (let index = 1; index < sorted.length; index += 1) {
        expect(sorted[index - 1].endTime <= sorted[index].startTime).toBe(true);
      }
    }
  });

  it("keeps reservation rules aligned with available table capacity", () => {
    const combinationCapacity = restaurantTables
      .filter(({ combinationGroupKey }) => combinationGroupKey === "family-pair")
      .reduce((sum, { maxPartySize }) => sum + maxPartySize, 0);
    expect(reservationRules.partySizeMax).toBe(combinationCapacity);
    expect(reservationRules.defaultDurationMinutes + reservationRules.bufferMinutes).toBeLessThanOrEqual(180);
  });
});
