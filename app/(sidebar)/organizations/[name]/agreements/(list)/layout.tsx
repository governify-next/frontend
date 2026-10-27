import { PageContent } from "@/components/page/page-content";

export default function OrganizationAgreementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContent
      title="Agreements"
      description="Review the organization agreements and their versions."
    >
      {children}
    </PageContent>
  );
}
