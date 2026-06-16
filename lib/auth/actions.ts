"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import * as session from "@/lib/auth/session";
import { bootEnv } from "@/lib/config/bootConfig";
import { loginFormSchema } from "@/schemas/auth";
import type { LoginFormState, LoginResponse } from "@/types/auth";
import { getLogger } from "../utils/logger";

const logger = getLogger().setTag("actions.ts");

const invalidCredentialsMessage = "Check your credentials and try again.";
const serviceErrorMessage = "Something went wrong. Try again later.";

async function getLoginSession(credentials: {
  login: string;
  password: string;
}) {
  let response: Response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        cache: "no-store",
      },
    );
  } catch (error) {
    logger.error("Unexpected error while logging in", error);
    return { ok: false, message: serviceErrorMessage } as const;
  }

  if (response.status === 401) {
    return { ok: false, message: invalidCredentialsMessage } as const;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to login user in authenticator", {
        error: body?.message,
      });
    }
    return { ok: false, message: serviceErrorMessage } as const;
  }

  const body = (await response.json()) as LoginResponse;
  return { ok: true, session: body.data } as const;
}

export const loginAction = async (
  _state: LoginFormState,
  formData: FormData,
) => {
  const result = loginFormSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errors = z.treeifyError(result.error);

    return {
      errors: {
        login: errors.properties?.login?.errors,
        password: errors.properties?.password?.errors,
      },
    };
  }

  const loginResult = await getLoginSession(result.data);

  if (!loginResult.ok) {
    return {
      message: loginResult.message,
    };
  }

  await session.createSessionTokens(loginResult.session);

  redirect("/");
};

export const logoutAction = async () => {
  const refreshToken = await session.getRefreshToken();

  if (refreshToken) {
    try {
      await fetch(`${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
    } catch (error) {
      logger.error("Failed to revoke authenticator session", error);
    }
  }

  await session.deleteSessionTokens();
  redirect("/login");
};
