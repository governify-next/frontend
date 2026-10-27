import { getAgreementCollections } from "@/data/agreements/fetch";
import { ErrorPage } from "@/components/errors";
import { AgreementsList } from "./list";
import { PageContent } from "@/components/page/page-content";

export default async function OrganizationAgreementsPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const result = await getAgreementCollections(orgName);
  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while loading the organization agreements."
      />
    );
  }

  return (
    <PageContent
      title="Agreements"
      description="Review the organization agreements and their versions."
    >
      <AgreementsList orgName={orgName} collections={result.data} />
    </PageContent>
  );
}
