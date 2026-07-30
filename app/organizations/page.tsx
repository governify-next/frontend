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
import { SystemRole } from "@/types/user.types";
import { getCurrentUser } from "@/lib/auth/session";
import { searchOrganizations } from "@/data/organizations/fetch";
import { OrganizationsList } from "./list";
import { OrganizationsAdminActions } from "./admin-actions";
import { ErrorPage } from "@/components/errors";
import { OrganizationFilters } from "./filters";
import { IOrganizationSearchFilters } from "@/types/organization";
import { SearchParams } from "nuqs/server";
import { loadOrganizationSearchParamas } from "./search-params";

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userResult = await getCurrentUser();
  if (!userResult.ok) {
    return (
      <ErrorPage
        result={userResult}
        message="Something went wrong while fetching current user."
      />
    );
  }
  const { page, limit, q, field } =
    await loadOrganizationSearchParamas(searchParams);
  const filters: IOrganizationSearchFilters = {};

  if (q) {
    if (field === "name") filters.name = q;
    else if (field === "displayName") filters.displayName = q;
    else if (field === "and") {
      filters.name = q;
      filters.displayName = q;
    } else {
      filters.nameOrDisplayName = q;
    }
  }

  const user = userResult.data;
  const isAdmin =
    user!.systemRole === SystemRole.ADMIN ||
    user!.systemRole === SystemRole.SUPERADMIN;
  const result = await searchOrganizations(page, limit, filters);
  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while fetching organizations."
      />
    );
  }
  const organizations = result.data;
  const pagination = result.pagination!;

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
                  <BreadcrumbPage>Organizations</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 pb-4 md:gap-6 md:pb-6">
              <div className="px-4 lg:px-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <OrganizationFilters
                      totalItems={pagination.totalItems}
                      applied={{ q, field }}
                    />
                    {isAdmin && <OrganizationsAdminActions />}
                  </div>
                  <OrganizationsList
                    organizations={organizations}
                    pagination={pagination}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
