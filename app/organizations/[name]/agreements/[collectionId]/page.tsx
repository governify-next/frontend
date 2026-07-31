import { getAgreementCollection } from "@/data/agreements/fetch";
import { ErrorPage } from "@/components/errors";
import { AgreementDetail } from "./detail";

export default async function AgreementDetailPage({
  params,
}: {
  params: Promise<{ name: string; collectionId: string }>;
}) {
  const { name, collectionId } = await params;
  const orgName = decodeURIComponent(name);

  const result = await getAgreementCollection(orgName, collectionId);

  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while loading the agreement."
      />
    );
  }

  // if url typed by hand
  if (result.data.agreementVersions.length === 0) {
    return (
      <ErrorPage
        result={{
          ok: false,
          status: 404,
          error: "This agreement has no versions yet.",
        }}
        message="Something went wrong while loading the agreement."
      />
    );
  }

  return <AgreementDetail orgName={orgName} collection={result.data} />;
}
