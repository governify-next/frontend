"use server";

import { redirect } from "next/navigation";
import * as session from "@/lib/auth/session";
import { bootEnv } from "@/lib/bootConfig";
import type { LoginResponse } from "@/types/auth";
import { getLogger } from "../../lib/utils/logger";
import { apiFetcher } from "../../lib/utils/fetcher";
const logger = getLogger().setTag("actions.ts");

async function getLoginSession(credentials: {
  login: string;
  password: string;
}) {
  return await apiFetcher<LoginResponse["data"]>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/login`,
    { method: "POST", body: credentials, skipAuth: true },
  );
}

export const loginAction = async (payload: {
  login: string;
  password: string;
}) => {
  const loginResult = await getLoginSession(payload);

  if (!loginResult.ok) {
    return loginResult.error;
  }

  await session.createSessionTokens(loginResult.data);
};

export const logoutAction = async () => {
  const refreshToken = await session.getRefreshToken();

  if (refreshToken) {
    await apiFetcher<void>(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/logout`,
      {
        method: "POST",
        body: { refreshToken },
        skipAuth: true,
      },
    );
  }

  await session.deleteSessionTokens();
  redirect("/login");
};
