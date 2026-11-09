import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { getServerEnv } from "../config/env";
import { ReservationMailService } from "../services/reservation-mail-service";

const env = getServerEnv();
const from = env.RESEND_FROM_EMAIL ?? env.RESERVATION_EMAIL_FROM;
if (!env.RESEND_API_KEY || !from || !env.RESTAURANT_NOTIFICATION_EMAIL) {
  throw new Error("RESEND_API_KEY, RESEND_FROM_EMAIL (or RESERVATION_EMAIL_FROM) and RESTAURANT_NOTIFICATION_EMAIL are required");
}
await connectToDatabase(env);
try {
  const result = await new ReservationMailService({ apiKey: env.RESEND_API_KEY, from, restaurantEmail: env.RESTAURANT_NOTIFICATION_EMAIL }).processPending();
  console.log(`Outbox processed: ${result.sent} sent, ${result.failed} failed.`);
} finally {
  await disconnectFromDatabase();
}
