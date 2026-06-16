import { Pagination, IUserInfo } from "@/types/user.types";
import { getAccessToken } from "../auth/session";
import { bootEnv } from "../config/bootConfig";
import { getLogger } from "../utils/logger";

const logger = getLogger().setTag("organizations.fetch.ts");

export const getOrganizations = async (username: string) => {
  const token = await getAccessToken();
  let response;

  if (username) {
    return await getOrganizationsUserBelongs(username);
  }

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations`,
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
    logger.error("Unexpected error while getting orgs", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to get orgs", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return {
    users: body.data as IUserInfo[],
    pagination: body.pagination as Pagination,
  };
};
