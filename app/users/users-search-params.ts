import { paginationSearchParams } from "@/lib/search-params/pagination";
import { SystemRole, UserStatus } from "@/types/user.types";
import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const USER_FIELDS = ["both", "username", "email"] as const;
export type UserField = (typeof USER_FIELDS)[number];

export const userSearchParams = {
  q: parseAsString.withDefault(""),
  field: parseAsStringLiteral(USER_FIELDS).withDefault("both"),
  systemRole: parseAsStringLiteral(Object.values(SystemRole)),
  status: parseAsStringLiteral(Object.values(UserStatus)),
  ...paginationSearchParams,
};

export const loadUserSearchParams = createLoader(userSearchParams);
