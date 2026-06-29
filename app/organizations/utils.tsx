import { getOrganization } from "@/lib/organizations/fetch";

export const getRoles = async (orgName: string) => {
  const result = await getOrganization(orgName);
  return result?.organization?.roles ?? [];
};
