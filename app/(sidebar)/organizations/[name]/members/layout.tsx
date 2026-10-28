import { PageContent } from "@/components/page/page-content";
import { MembersAdminActions } from "./_components/admin-actions";

export default async function OrganizationMembersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <PageContent
      title="Members"
      description="Browse the members of the organization and the roles they have."
      actions={<MembersAdminActions orgName={decodeURIComponent(name)} />}
    >
      {children}
    </PageContent>
  );
}
