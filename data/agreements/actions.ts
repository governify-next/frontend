"use server";

import { bootEnv } from "@/lib/bootConfig";
import { apiFetcher } from "@/lib/utils/fetcher";
import { ITask } from "@/types/agreement";

export const toggleConsolidationStateTasksForVersion = async (
  enabled: boolean,
  orgName: string,
  scopeId: string,
  collectionId: string,
  versionNumber: number,
) => {
  return apiFetcher<ITask[]>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${collectionId}/agreementVersions/${versionNumber}/tasks/states/consolidated?enabled=${enabled}`,
    { method: "POST" },
  );
};
