import { PageContent } from "@/components/page/page-content";

export default function OrganizationAgreementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContent
      title="Agreements"
      description="Browse organization agreements and dive into its versions."
    >
      {children}
    </PageContent>
  );
}
