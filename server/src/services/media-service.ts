import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { AuditEventModel } from "../models/core";

const MAX_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function matchesSignature(data: Buffer, contentType: string): boolean {
  if (contentType === "image/jpeg") return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  if (contentType === "image/png") return data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contentType === "image/webp") return data.length >= 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP";
  return false;
}

function bucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("DATABASE_NOT_CONNECTED");
  return new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
}

export async function storeMedia(input: { fileName: string; contentType: string; altText: string; dataBase64: string }) {
  if (!allowedTypes.has(input.contentType)) throw new Error("MEDIA_TYPE_NOT_ALLOWED");
  if (input.altText.trim().length < 1 || input.altText.length > 300) throw new Error("MEDIA_ALT_TEXT_INVALID");
  const data = Buffer.from(input.dataBase64, "base64");
  if (data.length < 1 || data.length > MAX_BYTES) throw new Error("MEDIA_SIZE_INVALID");
  if (!matchesSignature(data, input.contentType)) throw new Error("MEDIA_SIGNATURE_INVALID");
  const safeName = input.fileName.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120) || "upload";
  const id = new ObjectId();
  await new Promise<void>((resolve, reject) => {
    const upload = bucket().openUploadStreamWithId(id, safeName, { metadata: { altText: input.altText.trim(), originalName: safeName, contentType: input.contentType } });
    upload.once("error", reject);
    upload.once("finish", resolve);
    upload.end(data);
  });
  return { id: id.toHexString(), url: `/api/public/media/${id.toHexString()}`, contentType: input.contentType, size: data.length, altText: input.altText.trim() };
}

export async function streamMedia(id: string, response: { status: (code: number) => { end: () => void }; setHeader: (name: string, value: string) => void; end: (data?: unknown) => void }) {
  if (!ObjectId.isValid(id)) { response.status(404).end(); return; }
  const file = await bucket().find({ _id: new ObjectId(id) }).next();
  if (!file) { response.status(404).end(); return; }
  response.setHeader("content-type", String(file.metadata?.contentType ?? "application/octet-stream"));
  response.setHeader("cache-control", "public, max-age=31536000, immutable");
  await new Promise<void>((resolve, reject) => { const download = bucket().openDownloadStream(new ObjectId(id)); download.once("error", reject); download.once("end", resolve); download.pipe(response as never); });
}

export async function deleteMedia(id: string, actorId: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const objectId = new ObjectId(id);
  const file = await bucket().find({ _id: objectId }).next();
  if (!file) return false;
  await bucket().delete(objectId);
  await AuditEventModel.create({ eventId: `evt_${new ObjectId().toHexString()}`, actorId, action: "media.deleted", target: id, metadata: { originalName: file.metadata?.originalName ?? null } });
  return true;
}
