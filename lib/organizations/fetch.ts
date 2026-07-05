import { bootEnv } from "../config/bootConfig";
import { cache } from "react";
import {
  IMembership,
  IOrganization,
  IOrganizationSearchFilters,
} from "@/types/organization.types";
import { apiFetcher } from "../utils/fetcher";

export const searchOrganizations = async (
  page: number,
  limit: number,
  filters: IOrganizationSearchFilters,
) => {
  return await apiFetcher<IOrganization[]>(
    `${bootEnv.SCOPE_SERVICE_URL}/api/v1/organizations/search?page=${page}&limit=${limit}`,
    {
      method: "POST",
      body: filters,
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
