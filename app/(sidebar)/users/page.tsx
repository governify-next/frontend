import { searchUsers } from "@/data/users/fetch";
import { UserSearchFilters } from "@/types/user.types";
import { UsersTable } from "./_components/table";
import { UsersFilters } from "./_components/filters";
import { ErrorPage } from "@/components/errors";
import { SearchParams } from "nuqs";
import { loadUserSearchParams } from "./search-params";
import { getCurrentUser } from "@/lib/auth/session";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, status, systemRole, page, limit } =
    await loadUserSearchParams(searchParams);

  const filters: UserSearchFilters = {};
  if (q) filters.usernameOrEmail = q;
  if (status) filters.status = status;
  if (systemRole) filters.systemRole = systemRole;

  const [currentUserResult, usersResult] = await Promise.all([
    getCurrentUser(),
    searchUsers(filters, page, limit),
  ]);

  if (!currentUserResult.ok) {
    return (
      <ErrorPage
        result={currentUserResult}
        message="Something went wrong while fetching current user."
      />
    );
  }

  if (!usersResult.ok) {
    return (
      <ErrorPage
        result={usersResult}
        message="Something went wrong while fetching users."
      />
    );
  }

  return (
    <>
      <UsersFilters />
      <UsersTable
        users={usersResult.data}
        pagination={usersResult.pagination}
        currentUser={currentUserResult.data}
        query={q}
        filtered={Boolean(q || status || systemRole)}
      />
    </>
  );
}
