import { bootEnv } from "../config/bootConfig";
import { cache } from "react";
import { IMembership, IOrganization } from "@/types/organization.types";
import { apiFetcher } from "../utils/fetcher";

export const getOrganizations = async () => {
  return await apiFetcher<IOrganization[]>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations`,
    {
      method: "GET",
    },
  );
};

export const getOrganizationsUserBelongs = async (username: string) => {
  return await apiFetcher<IOrganization[]>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/users/${username}/organizations`,
    {
      method: "GET",
    },
  );
};

export const getOrganization = cache(async (name: string) => {
  return await apiFetcher<IOrganization>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${name}`,
    {
      method: "GET",
    },
  );
});

export const getOrganizationMembers = async (name: string) => {
  return await apiFetcher<IMembership[]>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/${name}/members?expand=full`,
    {
      method: "GET",
    },
  );
};
