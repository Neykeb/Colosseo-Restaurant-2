import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { applyRetention } from "../services/retention-service";

await connectToDatabase();
try {
  const result = await applyRetention();
  console.log(`Retention applied: ${result.anonymizedReservations} reservations anonymized, ${result.deletedOutboxEvents} sent outbox events and ${result.deletedAuditEvents} audit events deleted.`);
} finally {
  await disconnectFromDatabase();
}
