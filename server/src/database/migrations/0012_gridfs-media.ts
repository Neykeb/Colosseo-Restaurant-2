import type { Migration } from "./types";

export const gridFsMediaMigration: Migration = {
  id: "0012_gridfs-media",
  description: "Prepare GridFS media metadata indexes",
  async up(connection) {
    await connection.createCollection("media.files").catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    await connection.createCollection("media.chunks").catch((error: unknown) => { if ((error as { code?: number }).code !== 48) throw error; });
    await connection.collection("media.files").createIndex({ "metadata.altText": 1 }, { name: "media_alt_text" }).catch((error: unknown) => { if ((error as { code?: number }).code !== 85) throw error; });
    await connection.collection("media.chunks").createIndex({ files_id: 1, n: 1 }, { unique: true, name: "media_chunks_unique" }).catch((error: unknown) => { if ((error as { code?: number }).code !== 85) throw error; });
  },
};
