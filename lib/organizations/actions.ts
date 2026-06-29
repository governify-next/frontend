"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/session";
import { bootEnv } from "../config/bootConfig";
import { getLogger } from "../utils/logger";
import {
  IMembership,
  IOrganization,
  IOrganizationPayload,
  IRole,
  IRolePayload,
} from "@/types/organization.types";

const logger = getLogger().setTag("organizations.actions.ts");

export const createOrganization = async (payload: IOrganizationPayload) => {
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

export const removeOrganizationMember = async (
  orgName: string,
  username: string,
) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/members/${username}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      },
    );
  } catch (error) {
    logger.error("Unexpected error while removing organization member", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to remove organization member", {
        error: body?.message,
      });
    }
    return null;
  }

  revalidatePath("/organizations");
  return true;
};

export const updateOrganization = async (
  orgName: string,
  payload: IOrganizationPayload,
) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}`,
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
    logger.error("Unexpected error while updating organization", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to update organization", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as IOrganization;
};

export const deleteOrganization = async (orgName: string) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    logger.error("Unexpected error while deleting organization", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to delete organization", {
        error: body?.message,
      });
    }
    return null;
  }

  return true;
};

export const updateOrganizationMemberRoles = async (
  orgName: string,
  username: string,
  rolesIds: string[],
) => {
  // TODO: Connect to upsert endpoint when ready
  return true;
};

export const deleteOrganizationRole = async (
  orgName: string,
  roleName: string,
) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/roles/${roleName}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    logger.error("Unexpected error while deleting organization role", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to delete organization role", {
        error: body?.message,
      });
    }
    return null;
  }

  return true;
};

export const addOrganizationRole = async (
  orgName: string,
  payload: IRolePayload,
) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/roles`,
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
    logger.error("Unexpected error while adding organization role", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to add organization role", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();
  return body.data as IRole;
};

export const updateOrganizationRole = async (
  orgName: string,
  roleName: string,
  payload: IRolePayload,
) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/roles/${roleName}`,
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
    logger.error("Unexpected error while updating organization role", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to update organization role", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as IRole;
};
