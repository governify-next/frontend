import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SystemRole } from "@/types/user.types";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrganizations } from "@/lib/organizations/fetch";
import { OrganizationsList } from "./organizations-list";
import { OrganizationsSearch } from "./organizations-search";
import { OrganizationsAdminActions } from "./organizations-admin-actions";

export default async function UsersPage() {
  const user = await getCurrentUser();
  const isAdmin = user!.systemRole === SystemRole.ADMIN;
  const result = isAdmin
    ? await getOrganizations()
    : await getOrganizations(user!.username);
  const organizations = result?.organizations ?? [];

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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
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
                  <div className="flex items-center gap-2">
                    <OrganizationsSearch />
                    {isAdmin && <OrganizationsAdminActions />}
                  </div>
                  <OrganizationsList organizations={organizations} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
