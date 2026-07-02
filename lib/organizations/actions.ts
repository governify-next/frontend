"use server";

import { bootEnv } from "../config/bootConfig";
import {
  IMembership,
  IOrganization,
  IOrganizationPayload,
  IRole,
  IRolePayload,
} from "@/types/organization.types";
import { apiFetcher } from "../utils/fetcher";

export const createOrganization = async (payload: IOrganizationPayload) => {
  return apiFetcher<IOrganization>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations`,
    { method: "POST", body: payload },
  );
};

export const addOrganizationMember = async (
  orgName: string,
  payload: { username: string },
) => {
  return apiFetcher<IMembership>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/members`,
    { method: "POST", body: payload },
  );
};

export const removeOrganizationMember = async (
  orgName: string,
  username: string,
) => {
  return await apiFetcher<void>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/members/${username}`,
    { method: "DELETE" },
  );
};

export const updateOrganization = async (
  orgName: string,
  payload: IOrganizationPayload,
) => {
  return await apiFetcher<IOrganization>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}`,
    { method: "PUT", body: payload },
  );
};

export const deleteOrganization = async (orgName: string) => {
  return await apiFetcher<void>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}`,
    { method: "DELETE" },
  );
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
  return await apiFetcher<void>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/roles/${roleName}`,
    { method: "DELETE" },
  );
};

export const addOrganizationRole = async (
  orgName: string,
  payload: IRolePayload,
) => {
  return await apiFetcher<IRole>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/roles`,
    { method: "POST", body: payload },
  );
};

export const updateOrganizationRole = async (
  orgName: string,
  roleName: string,
  payload: IRolePayload,
) => {
  return await apiFetcher<IRole>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/roles/${roleName}`,
    { method: "PUT", body: payload },
  );
};
