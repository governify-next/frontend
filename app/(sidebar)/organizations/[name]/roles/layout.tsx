import { PageContent } from "@/components/page/page-content";
import { AddRole } from "./header-nav";

export default async function OrganizationRolesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <PageContent
      title="Roles"
      description="Define the roles that can be assigned to the organization members."
      actions={<AddRole orgName={decodeURIComponent(name)} />}
    >
      {children}
    </PageContent>
  );
}
