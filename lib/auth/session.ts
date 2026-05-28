import "server-only";

import { cookies } from "next/headers";
import { bootEnv } from "../config/bootConfig";

export const getSessionToken = async () => {
  return (await cookies()).get(bootEnv.AUTH_COOKIE_NAME)?.value;
};

export const createSessionToken = async (token: string) => {
  (await cookies()).set(bootEnv.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: bootEnv.SESSION_MAX_AGE, // same to real expiration for scope token
    path: "/",
  });
};

export const deleteSessionToken = async () => {
  (await cookies()).delete(bootEnv.AUTH_COOKIE_NAME);
};
