import { paginationSearchParams } from "@/lib/search/pagination";
import { createLoader, parseAsString } from "nuqs/server";

export const organizationSearchParams = {
  q: parseAsString.withDefault(""),
  ...paginationSearchParams,
};

export const loadOrganizationSearchParamas = createLoader(
  organizationSearchParams,
);
