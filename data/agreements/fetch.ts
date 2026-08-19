import { bootEnv } from "../../lib/bootConfig";
import { IAgreementCollection, ITask } from "@/types/agreement";
import { apiFetcher } from "../../lib/utils/fetcher";

export const getAgreementCollections = async (orgName: string) => {
  return await apiFetcher<IAgreementCollection[]>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/agreementCollections`,
    { method: "GET" },
  );
};

export const getAgreementCollection = async (
  orgName: string,
  collectionId: string,
) => {
  return await apiFetcher<IAgreementCollection>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/agreementCollections/${collectionId}`,
    { method: "GET" },
  );
};

export const getConsolidationStateTasksForAgreementVersion = async (
  orgName: string,
  scopeId: string,
  collectionId: string,
  versionNumber: number,
) => {
  return await apiFetcher<ITask[]>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${collectionId}/agreementVersions/${versionNumber}/tasks/states/consolidated`,
    { method: "GET" },
  );
};
