"use server";

import { redirect } from "next/navigation";
import * as session from "@/lib/auth/session";
import { bootEnv } from "@/lib/bootConfig";
import type { LoginResponse } from "@/types/auth";
import { apiFetcher } from "../../lib/utils/fetcher";
import { IUserInfo, SystemRole } from "@/types/user.types";
import { IMembership } from "@/types/organization";

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
  // TODO: Remove this when USERs can login to the previous commit
  const userResult = await session.getCurrentUser();

  if (!userResult.ok) {
    return userResult.error;
  }

  const user = userResult.data;

  if (user.systemRole !== SystemRole.SUPERADMIN) {
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
    return "You are not authorized to login yet. We looking forward to seeing you soon!";
  }
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

export const registerInOrganizationAction = async (
  token: string,
  payload: {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
  },
) => {
  return await apiFetcher<IMembership>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/invites/${token}`,
    { method: "POST", body: payload, skipAuth: true },
  );
};
