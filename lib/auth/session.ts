import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { bootEnv } from "../bootConfig";
import { LoginResponse, SessionTokens } from "@/types/auth";
import { IBasicUserInfo } from "@/types/user.types";
import { apiFetcher } from "../utils/fetcher";

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
  const result = await apiFetcher<LoginResponse["data"]>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/refresh`,
    {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
    },
  );

  return result.ok ? result.data : null;
};

export const getCurrentUser = cache(async () => {
  return await apiFetcher<IBasicUserInfo>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/me`,
    {
      method: "GET",
    },
  );
});
