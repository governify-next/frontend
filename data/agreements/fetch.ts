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

export const getConsolidationStateTasksForAgreementVersion = async (
  orgName: string,
  scopeId: string,
  agColId: string,
  agVersionNumber: number,
) => {
  return await apiFetcher<ITask[]>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${agColId}/agreementVersions/${agVersionNumber}/tasks/states/consolidated`,
    { method: "GET" },
  );
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
