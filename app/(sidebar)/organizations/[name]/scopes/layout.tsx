import { PageContent } from "@/components/page/page-content";

export default function OrganizationScopesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContent
      title="Scopes"
      description="Browse and organize the folder structure of the organization."
    >
      {children}
    </PageContent>
  );
}
