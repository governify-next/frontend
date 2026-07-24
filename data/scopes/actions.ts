"use server";

import { bootEnv } from "../../lib/bootConfig";
import { IScope, IScopePayload } from "@/types/scope";
import { apiFetcher } from "../../lib/utils/fetcher";

export const createScope = async (orgName: string, payload: IScopePayload) => {
  return await apiFetcher<IScope>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/scopes`,
    { method: "POST", body: payload },
  );
};

export const updateScope = async (
  orgName: string,
  scopeId: string,
  payload: IScopePayload,
) => {
  return await apiFetcher<IScope>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}`,
    { method: "PUT", body: payload },
  );
};

export const deleteScope = async (orgName: string, scopeId: string) => {
  return await apiFetcher<void>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}`,
    { method: "DELETE" },
  );
};
