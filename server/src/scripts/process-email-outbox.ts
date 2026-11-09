import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { getServerEnv } from "../config/env";
import { ReservationMailService } from "../services/reservation-mail-service";

const env = getServerEnv();
if (!env.RESEND_API_KEY || !env.RESERVATION_EMAIL_FROM || !env.RESTAURANT_NOTIFICATION_EMAIL) {
  throw new Error("RESEND_API_KEY, RESERVATION_EMAIL_FROM and RESTAURANT_NOTIFICATION_EMAIL are required");
}
await connectToDatabase(env);
try {
  const result = await new ReservationMailService({ apiKey: env.RESEND_API_KEY, from: env.RESERVATION_EMAIL_FROM, restaurantEmail: env.RESTAURANT_NOTIFICATION_EMAIL }).processPending();
  console.log(`Outbox processed: ${result.sent} sent, ${result.failed} failed.`);
} finally {
  await disconnectFromDatabase();
}
