import { parseAsInteger } from "nuqs/server";

export const paginationSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
};
