"use server";

import { bootEnv } from "@/lib/bootConfig";
import { apiFetcher } from "@/lib/utils/fetcher";
import {
  IAgreementCollection,
  IAgreementCollectionPayload,
  ITask,
} from "@/types/agreement";

export const toggleConsolidationStateTasksForVersion = async (
  enabled: boolean,
  orgName: string,
  scopeId: string,
  collectionId: string,
  versionNumber: number,
) => {
  return await apiFetcher<ITask[]>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${collectionId}/agreementVersions/${versionNumber}/tasks/states/consolidated?enabled=${enabled}`,
    { method: "POST" },
  );
};

export const updateAgreementCollection = async (
  orgName: string,
  collectionId: string,
  auditableVersion: number | null,
  payload: IAgreementCollectionPayload,
) => {
  return await apiFetcher<IAgreementCollection>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/agreementCollections/${collectionId}`,
    {
      method: "PUT",
      body: {
        ...payload,
        fields: [],
        permissions: [],
        auditableVersionNumber: auditableVersion,
      },
    },
  );
};

export const terminateAgreementVersion = async (
  orgName: string,
  scopeId: string,
  collectionId: string,
) => {
  return await apiFetcher<IAgreementCollection>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${collectionId}/agreementVersions/activeVersion/terminate`,
    { method: "POST", body: { earlyTermination: new Date().toISOString() } },
  );
};

export const generateStatesForVersion = async (
  orgName: string,
  scopeId: string,
  collectionId: string,
  versionNumber: number,
  data: { startDate: Date; endDate: Date; replaceExisting: boolean },
) => {
  const { replaceExisting, ...dates } = data;
  return await apiFetcher<void>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${collectionId}/agreementVersions/${versionNumber}/states/consolidated/generate`,
    {
      method: "POST",
      body: {
        ...dates,
        temporalMode: "REPLAY",
        ifExists: replaceExisting ? "REPLACE" : "KEEP",
      },
    },
  );
};
