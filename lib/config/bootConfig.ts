import "server-only";

export const bootEnv = {
  // Service configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  GOV_SERVICE_NAME: process.env.GOV_SERVICE_NAME || "frontend",
  PORT: process.env.PORT || "3000",

  // Internal service URLs
  AUTHENTICATOR_SERVICE_URL:
    process.env.AUTHENTICATOR_SERVICE_URL || "http://localhost:5900",

  // Cookie settings
  AUTH_ACCESS_COOKIE_NAME:
    process.env.AUTH_ACCESS_COOKIE_NAME ?? "governify_next_access_token",

  AUTH_REFRESH_COOKIE_NAME:
    process.env.AUTH_REFRESH_COOKIE_NAME ?? "governify_next_refresh_token",

  ACCESS_TOKEN_MAX_AGE: Number(process.env.ACCESS_TOKEN_MAX_AGE ?? 15 * 60),
  REFRESH_TOKEN_MAX_AGE: Number(
    process.env.REFRESH_TOKEN_MAX_AGE ?? 7 * 24 * 60 * 60,
  ),
};
