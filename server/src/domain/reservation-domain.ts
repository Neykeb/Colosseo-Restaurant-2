export type ReservationStatus = "pending" | "confirmed" | "declined" | "cancelled" | "seated" | "completed" | "no_show";

export type ServiceWindow = { opens: string; closes: string; enabled?: boolean };
export type CapacityTable = { seats: number; active: boolean };

export function minutesSinceMidnight(value: string): number {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error("Time must use HH:mm format.");
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function windowsOverlap(firstStart: string, firstEnd: string, secondStart: string, secondEnd: string): boolean {
  const startA = minutesSinceMidnight(firstStart);
  const endA = minutesSinceMidnight(firstEnd);
  const startB = minutesSinceMidnight(secondStart);
  const endB = minutesSinceMidnight(secondEnd);
  if (endA <= startA || endB <= startB) throw new Error("Time window must end after it starts.");
  return startA < endB && startB < endA;
}

export function isWithinServiceWindow(startTime: string, endTime: string, window: ServiceWindow): boolean {
  if (window.enabled === false) return false;
  const start = minutesSinceMidnight(startTime);
  const end = minutesSinceMidnight(endTime);
  const opens = minutesSinceMidnight(window.opens);
  const closes = minutesSinceMidnight(window.closes);
  if (end <= start || closes <= opens) return false;
  return start >= opens && end <= closes;
}

export function availableTableCapacity(tables: readonly CapacityTable[], occupiedSeats: number): number {
  if (!Number.isInteger(occupiedSeats) || occupiedSeats < 0) throw new Error("Occupied seats must be a non-negative integer.");
  return tables.filter((table) => table.active && Number.isInteger(table.seats) && table.seats > 0).reduce((total, table) => total + table.seats, 0) - occupiedSeats;
}

export function canAccommodateParty(tables: readonly CapacityTable[], occupiedSeats: number, partySize: number): boolean {
  if (!Number.isInteger(partySize) || partySize < 1) throw new Error("Party size must be a positive integer.");
  return availableTableCapacity(tables, occupiedSeats) >= partySize;
}

const allowedTransitions: Record<ReservationStatus, readonly ReservationStatus[]> = {
  pending: ["confirmed", "declined", "cancelled"],
  confirmed: ["cancelled", "seated", "no_show"],
  declined: [],
  cancelled: [],
  seated: ["completed", "no_show"],
  completed: [],
  no_show: [],
};

export function canTransitionReservation(from: ReservationStatus, to: ReservationStatus): boolean {
  return allowedTransitions[from].includes(to);
}

export function assertReservationTransition(from: ReservationStatus, to: ReservationStatus): void {
  if (!canTransitionReservation(from, to)) throw new Error(`Invalid reservation transition: ${from} -> ${to}.`);
}
