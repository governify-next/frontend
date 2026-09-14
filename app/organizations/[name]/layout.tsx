import { AppSidebar } from "@/components/sidebar/sidebar";
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
import { getOrganization } from "@/data/organizations/fetch";
import { OrganizationTabsNav } from "./tabs-nav";
import { ErrorPage } from "@/components/errors";
import { isUserAdminOfOrganization } from "@/data/organizations/actions";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const [organizationResult, adminResult] = await Promise.all([
    getOrganization(decodeURIComponent(name)),
    isUserAdminOfOrganization(decodeURIComponent(name)),
  ]);

  if (!organizationResult.ok) {
    return (
      <ErrorPage
        result={organizationResult}
        message="Something went wrong while fetching organization."
      />
    );
  }

  if (!adminResult.ok) {
    return (
      <ErrorPage
        result={adminResult}
        message="Something went wrong while checking if user is admin of organization."
      />
    );
  }

  const organization = organizationResult.data;
  const title = organization.displayName || organization.name;
  const isAdmin = adminResult.data.isAdmin;

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
                  <BreadcrumbLink href="/organizations">
                    Organizations
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 pb-4 md:gap-6 md:pb-6">
              <div className="px-4 lg:px-6">
                <OrganizationTabsNav orgName={name} isAdmin={isAdmin} />
                {children}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
