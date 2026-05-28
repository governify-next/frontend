"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSessionToken, deleteSessionToken } from "@/lib/auth/session";
import { bootEnv } from "@/lib/config/bootConfig";
import { loginFormSchema } from "@/schemas/auth";
import type { LoginFormState, LoginResponse } from "@/types/auth";

const invalidCredentialsMessage = "Check your credentials and try again.";
const serviceErrorMessage = "Something went wrong. Try again later.";

async function getLoginToken(credentials: { login: string; password: string }) {
  let response: Response;

  try {
    response = await fetch(`${bootEnv.SCOPE_SERVICE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });
  } catch {
    return { ok: false, message: serviceErrorMessage } as const;
  }

  if (response.status === 401) {
    return { ok: false, message: invalidCredentialsMessage } as const;
  }

  if (!response.ok) {
    return { ok: false, message: serviceErrorMessage } as const;
  }

  const body = (await response.json()) as LoginResponse;
  return { ok: true, token: body.data.token } as const;
}

export const loginAction = async (
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> => {
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

  const loginResult = await getLoginToken(result.data);

  if (!loginResult.ok) {
    return {
      message: loginResult.message,
    };
  }

  await createSessionToken(loginResult.token);

  redirect("/");
};

export const logoutAction = async () => {
  await deleteSessionToken();
  redirect("/login");
};
