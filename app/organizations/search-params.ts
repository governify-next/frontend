import { paginationSearchParams } from "@/lib/search/pagination";
import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const ORGANIZATION_FIELDS = [
  "name",
  "displayName",
  "both",
  "and",
] as const;
export type OrganizationField = (typeof ORGANIZATION_FIELDS)[number];

export const organizationSearchParams = {
  q: parseAsString.withDefault(""),
  field: parseAsStringLiteral(ORGANIZATION_FIELDS).withDefault("both"),
  ...paginationSearchParams,
};

export const loadOrganizationSearchParamas = createLoader(
  organizationSearchParams,
);
