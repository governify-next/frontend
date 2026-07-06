import { IUserInfo, UserSearchFilters } from "@/types/user.types";
import { bootEnv } from "../../lib/bootConfig";
import { apiFetcher } from "../../lib/utils/fetcher";

export const searchUsers = async (
  filters: UserSearchFilters,
  page = 1,
  limit = 20,
) => {
  return await apiFetcher<IUserInfo[]>(
    `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/search?page=${page}&limit=${limit}`,
    { method: "POST", body: filters },
  );
};
