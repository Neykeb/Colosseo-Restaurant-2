import type { Migration } from "./types";

async function ensureIndex(
  collection: ReturnType<Parameters<Migration["up"]>[0]["collection"]>,
  key: Record<string, 1 | -1>,
  name: string,
): Promise<void> {
  const indexes = await collection.listIndexes().toArray();
  const expected = JSON.stringify(key);
  if (indexes.some((index) => JSON.stringify(index.key) === expected)) return;
  await collection.createIndex(key, { name });
}

export const eventInquiriesMigration: Migration = {
  id: "0010_event-inquiries",
  description: "Create event inquiry collection and administrative indexes",
  async up(connection) {
    await connection.createCollection("eventinquiries").catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    const collection = connection.collection("eventinquiries");
    await ensureIndex(collection, { status: 1, requestedDate: 1 }, "event_inquiry_status_date");
    await ensureIndex(collection, { email: 1 }, "event_inquiry_email");
  },
};
