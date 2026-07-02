"use server";

import {
  ICreateIUserPayload,
  IUserInfo,
  IUserPayload,
} from "@/types/user.types";
import { bootEnv } from "../config/bootConfig";
import { apiFetcher } from "../utils/fetcher";

export const updateUser = async (userId: string, payload: IUserPayload) => {
  return apiFetcher<IUserInfo>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/${userId}`,
    { method: "PUT", body: payload },
  );
};

export const deleteUserSessions = async (userId: string) => {
  return apiFetcher<{ deletedSessions: number }>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/${userId}/sessions`,
    { method: "DELETE" },
  );
};

export const deleteUser = async (userId: string) => {
  return apiFetcher<void>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/${userId}`,
    {
      method: "DELETE",
    },
  );
};

export const createUser = async (payload: ICreateIUserPayload) => {
  return apiFetcher<IUserInfo>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users`,
    { method: "POST", body: payload },
  );
};
