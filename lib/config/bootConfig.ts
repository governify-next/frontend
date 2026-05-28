import "server-only";
import dotenv from "dotenv";
import path from "path";

// Load .env file
const envPath =
  process.env.GOV_BOOT_ENV_PATH || path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath, quiet: true });

export const bootEnv = {
  // Service configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  GOV_SERVICE_NAME: process.env.GOV_SERVICE_NAME || "frontend",
  PORT: process.env.PORT || "3000",

  // Internal service URLs
  SCOPE_SERVICE_URL: process.env.SCOPE_SERVICE_URL || "http://localhost:5901",

  // Cookie settings
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME ?? "governify_next_session",
  SESSION_MAX_AGE: Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24),
};
