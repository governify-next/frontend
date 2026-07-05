import { AppSidebar } from "@/components/app-sidebar";
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
import { getUsers, searchUsers } from "@/lib/users/fetch";
import { SystemRole, UserSearchFilters, UserStatus } from "@/types/user.types";
import { UsersTable } from "@/app/users/users-table";
import { ErrorPage } from "@/components/errors";
import { SearchParams } from "nuqs";
import { loadUserSearchParams } from "./users-search-params";

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

  const result = await searchUsers(filters, page, limit);

  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while fetching users."
      />
    );
  }

  const users = result.data;
  const pagination = result.pagination;

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
                <UsersTable users={users} pagination={pagination} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
