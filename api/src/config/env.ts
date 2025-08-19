import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.string().min(1, "PORT is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  //   JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", z.treeifyError(env.error).properties);
  process.exit(1);
}

export const ENV = env.data;
