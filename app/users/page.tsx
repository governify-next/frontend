import { AppSidebar } from "@/components/sidebar/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { searchUsers } from "@/data/users/fetch";
import { SystemRole, UserSearchFilters, UserStatus } from "@/types/user.types";
import { UsersTable } from "@/app/users/table";
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:self-center data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 pb-4 md:gap-6 md:pb-6">
              <div className="px-4 lg:px-6">
                <UsersTable
                  users={users}
                  pagination={pagination}
                  currentUser={currentUser}
                  appliedFilters={{ q, field, status, systemRole }}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
