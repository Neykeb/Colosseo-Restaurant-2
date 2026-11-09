import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3_000),
  CLERK_SECRET_KEY: z.string().trim().min(1).optional(),
  CLERK_PUBLISHABLE_KEY: z.string().trim().min(1).optional(),
  CLERK_OWNER_USER_ID: z.string().trim().regex(/^user_[A-Za-z0-9]+$/, "CLERK_OWNER_USER_ID must be a Clerk user ID").optional(),
  CLERK_OWNER_DISPLAY_NAME: z.string().trim().min(1).max(120).optional(),
  CLERK_AUTHORIZED_PARTIES: z
    .string()
    .trim()
    .optional()
    .transform((value) => value?.split(",").map((party) => party.trim()).filter(Boolean) ?? []),
  RESEND_API_KEY: z.string().trim().regex(/^re_[A-Za-z0-9_]+$/, "RESEND_API_KEY must be a Resend API key").optional(),
  RESEND_FROM_EMAIL: z.string().trim().min(3).max(320).optional(),
  RESTAURANT_NOTIFICATION_EMAIL: z.string().trim().email().optional(),
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
}).superRefine((value, context) => {
  const mailValues = [value.RESEND_API_KEY, value.RESEND_FROM_EMAIL, value.RESTAURANT_NOTIFICATION_EMAIL];
  if (mailValues.some(Boolean) && !mailValues.every(Boolean)) {
    context.addIssue({ code: "custom", path: ["RESEND_API_KEY"], message: "Resend configuration requires API key, from address and restaurant recipient together" });
  }
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
