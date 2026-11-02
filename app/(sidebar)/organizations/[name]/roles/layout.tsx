import { PageContent } from "@/components/page/page-content";
import { RolesAdminActions } from "./_components/admin-actions";

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
      description="Create and manage the roles you can assign to organization members."
      actions={<RolesAdminActions orgName={decodeURIComponent(name)} />}
    >
      {children}
    </PageContent>
  );
}
