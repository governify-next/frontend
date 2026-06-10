import { Pagination, UserInfo } from "@/types/user.types";
import { getAccessToken } from "../auth/session";
import { bootEnv } from "../config/bootConfig";
import { getLogger } from "../utils/logger";

const logger = getLogger().setTag("users.fetch.ts");

export const getUsers = async (page = 1, limit = 20) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users?page=${page}&limit=${limit}`,
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

  return { users: body.data as UserInfo[], pagination: body.pagination as Pagination };
};
