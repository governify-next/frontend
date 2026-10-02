import { PageShell } from "@/components/page-shell";
import {
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { searchUsers } from "@/data/users/fetch";
import { SystemRole, UserSearchFilters, UserStatus } from "@/types/user.types";
import { UsersTable } from "./table";
import { ErrorPage } from "@/components/errors";
import { SearchParams } from "nuqs";
import { loadUserSearchParams } from "./search-params";
import { getCurrentUser } from "@/lib/auth/session";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, field, status, systemRole, page, limit } =
    await loadUserSearchParams(searchParams);

  const filters: UserSearchFilters = {};
  if (q) {
    if (field === "username") filters.username = q;
    else if (field === "email") filters.email = q;
    else filters.usernameOrEmail = q;
  }
  if (status) filters.status = status as UserStatus;
  if (systemRole) filters.systemRole = systemRole as SystemRole;

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

  const currentUser = currentUserResult.data;
  const users = usersResult.data;
  const pagination = usersResult.pagination;

  return (
    <PageShell
      breadcrumb={
        <BreadcrumbItem>
          <BreadcrumbPage>Users</BreadcrumbPage>
        </BreadcrumbItem>
      }
    >
      <UsersTable
        users={users}
        pagination={pagination}
        currentUser={currentUser}
        appliedFilters={{ q, field, status, systemRole }}
      />
    </PageShell>
  );
}
