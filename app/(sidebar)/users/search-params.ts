import { paginationSearchParams } from "@/lib/search/pagination";
import { SystemRole, UserStatus } from "@/types/user.types";
import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const userSearchParams = {
  q: parseAsString.withDefault(""),
  systemRole: parseAsStringLiteral(Object.values(SystemRole)),
  status: parseAsStringLiteral(Object.values(UserStatus)),
  ...paginationSearchParams,
};

export const loadUserSearchParams = createLoader(userSearchParams);
