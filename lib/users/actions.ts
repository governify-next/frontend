"use server";

import { UserInfo, UserPayload } from "@/types/user.types";
import { getAccessToken } from "../auth/session";
import { bootEnv } from "../config/bootConfig";
import { getLogger } from "../utils/logger";
import { revalidatePath } from "next/cache";

const logger = getLogger().setTag("users.actions.ts");

export const updateUser = async (
  userId: string,
  payload: UserPayload,
): Promise<UserInfo | null> => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/${userId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    logger.error("Unexpected error while updating user", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to update user", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as UserInfo;
};
