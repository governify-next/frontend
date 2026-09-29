import { bootEnv } from "../../lib/bootConfig";
import {
  IAgreementCollection,
  IAgreementVersion,
  ITask,
} from "@/types/agreement";
import { apiFetcher } from "../../lib/utils/fetcher";

export const getAgreementCollections = async (orgName: string) => {
  return await apiFetcher<IAgreementCollection[]>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/agreementCollections`,
    { method: "GET" },
  );
};

export const getAgreementCollection = async (
  orgName: string,
  agColId: string,
) => {
  return await apiFetcher<IAgreementCollection>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/agreementCollections/${agColId}`,
    { method: "GET" },
  );
};

export const getStateTasksForAgreementVersion = async (
  orgName: string,
  scopeId: string,
  agColId: string,
  agVersionNumber: number,
) => {
  const tasksUrl = `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${encodeURIComponent(orgName)}/scopes/${encodeURIComponent(scopeId)}/agreementCollections/${encodeURIComponent(agColId)}/agreementVersions/${agVersionNumber}/tasks/states`;
  const [consolidated, evolutive] = await Promise.all([
    apiFetcher<ITask[]>(`${tasksUrl}/consolidated`, { method: "GET" }),
    apiFetcher<ITask[]>(`${tasksUrl}/evolutive`, { method: "GET" }),
  ]);
  if (!consolidated.ok) return consolidated;
  if (!evolutive.ok) return evolutive;
  return { ok: true as const, data: [...consolidated.data, ...evolutive.data] };
};

export const getAgreementVersionByCollection = async (
  orgName: string,
  scopeId: string,
  agColId: string,
  agVersionNumber: number,
) => {
  return await apiFetcher<IAgreementVersion>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${agColId}/agreementVersions/${agVersionNumber}?expand=true`,
    { method: "GET" },
  );
};
