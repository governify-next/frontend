import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    <PageShell
      breadcrumb={
        <>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/organizations">Organizations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      }
    >
      <OrganizationTabsNav orgName={name} isAdmin={isAdmin} />
      {children}
    </PageShell>
  );
}
