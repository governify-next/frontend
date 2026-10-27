import { PageContent } from "@/components/page/page-content";
import { MembersAdminActions } from "./admin-actions";

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
      description="Manage who belongs to the organization and the role each member has."
      actions={<MembersAdminActions orgName={decodeURIComponent(name)} />}
    >
      {children}
    </PageContent>
  );
}
