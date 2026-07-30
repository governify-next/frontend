import { bootEnv } from "../../lib/bootConfig";
import { IScopeNode } from "@/types/scope";
import { apiFetcher } from "../../lib/utils/fetcher";

export const getScopes = async (orgName: string) => {
  return await apiFetcher<IScopeNode[]>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${orgName}/scopes`,
    { method: "GET" },
  );
};
