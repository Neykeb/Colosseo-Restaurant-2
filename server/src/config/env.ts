import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.preprocess(
    (value) => value ?? "",
    z
      .string()
      .trim()
      .min(1, "MONGODB_URI is required")
      .refine(
        (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
        "MONGODB_URI must use the mongodb:// or mongodb+srv:// protocol",
      )
      .refine(
        (value) =>
          !value.startsWith("mongodb+srv://") ||
          (/^mongodb\+srv:\/\/[^@/]+@[^/:]+\.mongodb\.net(?:\/|\?|$)/.test(value) &&
            !/^mongodb\+srv:\/\/[^@/]+@[^/]+:\d+/.test(value)),
        "MONGODB_URI is not a complete Atlas driver URI; copy the full mongodb+srv:// string from Atlas without a port",
      ),
  ),
  MONGODB_DB_NAME: z
    .string()
    .trim()
    .min(1, "MONGODB_DB_NAME is required")
    .regex(/^[A-Za-z0-9_-]+$/, "MONGODB_DB_NAME contains unsupported characters")
    .default("colosseo"),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(30_000).default(5_000),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(source: NodeJS.ProcessEnv): ServerEnv {
  const result = serverEnvSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid server environment: ${details}`);
  }

  return result.data;
}

export function getServerEnv(): ServerEnv {
  return parseServerEnv(process.env);
}
