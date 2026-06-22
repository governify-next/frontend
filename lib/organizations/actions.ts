"use server";

import { getAccessToken } from "../auth/session";
import { bootEnv } from "../config/bootConfig";
import { getLogger } from "../utils/logger";
import { IMembership, IOrganization } from "@/types/organization.types";

const logger = getLogger().setTag("organizations.actions.ts");

export const createOrganization = async (payload: IOrganization) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    logger.error("Unexpected error while creating organization", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to create organization", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as IOrganization;
};

export const addOrganizationMember = async (
  orgName: string,
  payload: { username: string },
) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/members`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    logger.error("Unexpected error while adding organization member", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to add organization member", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as IMembership;
};
