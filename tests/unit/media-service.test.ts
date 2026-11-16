import { describe, expect, it } from "vitest";
import { storeMedia } from "../../server/src/services/media-service";

const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).toString("base64");

describe("GridFS media validation", () => {
  it("rejects unsupported media types before database access", async () => {
    await expect(storeMedia({ fileName: "file.gif", contentType: "image/gif", altText: "Example", dataBase64: validPng })).rejects.toThrow("MEDIA_TYPE_NOT_ALLOWED");
  });

  it("requires a non-empty alternative text", async () => {
    await expect(storeMedia({ fileName: "file.png", contentType: "image/png", altText: " ", dataBase64: validPng })).rejects.toThrow("MEDIA_ALT_TEXT_INVALID");
  });

  it("rejects a mismatched binary signature", async () => {
    await expect(storeMedia({ fileName: "file.png", contentType: "image/png", altText: "Example", dataBase64: Buffer.from("not-a-png").toString("base64") })).rejects.toThrow("MEDIA_SIGNATURE_INVALID");
  });

  it("rejects files larger than five megabytes", async () => {
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1).toString("base64");
    await expect(storeMedia({ fileName: "file.png", contentType: "image/png", altText: "Example", dataBase64: oversized })).rejects.toThrow("MEDIA_SIZE_INVALID");
  });
});
