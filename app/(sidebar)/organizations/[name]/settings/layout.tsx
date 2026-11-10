import { PageContent } from "@/components/page/page-content";

export default function OrganizationSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContent
      title="Settings"
      description="Update the organization details, manage invitations or delete it."
    >
      {children}
    </PageContent>
  );
}
