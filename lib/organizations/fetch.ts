import { getAccessToken } from "../auth/session";
import { bootEnv } from "../config/bootConfig";
import { getLogger } from "../utils/logger";
import { IOrganization } from "@/types/organization.types";

const logger = getLogger().setTag("organizations.fetch.ts");

export const getOrganizations = async (username?: string) => {
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
    organizations: body.data as IOrganization[],
  };
};

const getOrganizationsUserBelongs = async (username: string) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/users/${username}/organizations`,
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
    logger.error("Unexpected error while getting orgs for user", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to get orgs for user", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return {
    organizations: body.data as IOrganization[],
  };
};
