import { UserInfo } from "@/types/user.types";
import { getAccessToken } from "./auth/session";
import { bootEnv } from "./config/bootConfig";
import { getLogger } from "./utils/logger";
import { mutate } from "swr";

const logger = getLogger().setTag("userService.ts");

export const getUsers = async () => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users`,
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
    logger.error("Unexpected error while getting users", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to get users", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as UserInfo[];
};

export const updateUser = async (
  userId: string,
  status: UserInfo["status"],
) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/${userId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
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

  return body.data as UserInfo[];
};
