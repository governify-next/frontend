import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { bootEnv } from "../config/bootConfig";
import { LoginResponse, SessionTokens } from "@/types/auth";
import { getLogger } from "../utils/logger";
import { BasicUserInfo } from "@/types/user.types";

const logger = getLogger().setTag("sessions.ts");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export const getAccessToken = async () => {
  return (await cookies()).get(bootEnv.AUTH_ACCESS_COOKIE_NAME)?.value;
};

export const getRefreshToken = async () => {
  return (await cookies()).get(bootEnv.AUTH_REFRESH_COOKIE_NAME)?.value;
};

export const createSessionTokens = async (session: SessionTokens) => {
  const cookieStore = await cookies();

  cookieStore.set(bootEnv.AUTH_ACCESS_COOKIE_NAME, session.token, {
    ...cookieOptions,
    maxAge: bootEnv.ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(bootEnv.AUTH_REFRESH_COOKIE_NAME, session.refreshToken, {
    ...cookieOptions,
    maxAge: bootEnv.REFRESH_TOKEN_MAX_AGE,
  });
};

export const deleteSessionTokens = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(bootEnv.AUTH_ACCESS_COOKIE_NAME);
  cookieStore.delete(bootEnv.AUTH_REFRESH_COOKIE_NAME);
};

export const setSessionResponseCookies = (
  response: NextResponse,
  session: SessionTokens,
) => {
  response.cookies.set(bootEnv.AUTH_ACCESS_COOKIE_NAME, session.token, {
    ...cookieOptions,
    maxAge: bootEnv.ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set(bootEnv.AUTH_REFRESH_COOKIE_NAME, session.refreshToken, {
    ...cookieOptions,
    maxAge: bootEnv.REFRESH_TOKEN_MAX_AGE,
  });
};

export const deleteSessionResponseCookies = (response: NextResponse) => {
  response.cookies.delete(bootEnv.AUTH_ACCESS_COOKIE_NAME);
  response.cookies.delete(bootEnv.AUTH_REFRESH_COOKIE_NAME);
};

export const refreshSession = async (refreshToken: string) => {
  try {
    const response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/refresh`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status >= 500) {
        const body = await response.json().catch(() => null);
        logger.error("Failed to refresh session with authenticator", {
          error: body?.message,
        });
      }
      return null;
    }

    const body = (await response.json()) as LoginResponse;
    return body.data;
  } catch (error) {
    logger.error("Unexpected error while refreshing user session", error);
    return null;
  }
};

export const getCurrentUser = async () => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/me`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );
  } catch (error) {
    logger.error("Unexpected error while getting user info", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to get user info", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as BasicUserInfo;
};
