"use server";

import {
  ICreateIUserPayload,
  IUserInfo,
  IUserPayload,
} from "@/types/user.types";
import { getAccessToken } from "../auth/session";
import { bootEnv } from "../config/bootConfig";
import { getLogger } from "../utils/logger";

const logger = getLogger().setTag("users.actions.ts");

export const updateUser = async (userId: string, payload: IUserPayload) => {
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

  return body.data as IUserInfo;
};

export const deleteUserSessions = async (userId: string) => {
  const token = await getAccessToken();
  let response;
  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/${userId}/sessions`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    logger.error("Unexpected error while deleting user sessions", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to delete user sessions", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data.deletedSessions as number;
};

export const deleteUser = async (userId: string) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    logger.error("Unexpected error while deleting user", error);
    return false;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to delete user", {
        error: body?.message,
      });
    }
    return false;
  }

  return true;
};

export const createUser = async (payload: ICreateIUserPayload) => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users`,
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
    logger.error("Unexpected error while creating user", error);
    return null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      const body = await response.json().catch(() => null);
      logger.error("Failed to create user", {
        error: body?.message,
      });
    }
    return null;
  }

  const body = await response.json();

  return body.data as IUserInfo;
};
