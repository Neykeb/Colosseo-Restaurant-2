import type { Migration } from "./types";

export const eventInquiriesMigration: Migration = {
  id: "0010-event-inquiries",
  description: "Create event inquiry collection and administrative indexes",
  async up(connection) {
    await connection.createCollection("eventinquiries").catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    await connection.collection("eventinquiries").createIndex({ status: 1, requestedDate: 1 }, { name: "event_inquiry_status_date" });
    await connection.collection("eventinquiries").createIndex({ email: 1 }, { name: "event_inquiry_email" });
  },
};
