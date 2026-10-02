import { getAgreementCollections } from "@/data/agreements/fetch";
import { ErrorPage } from "@/components/errors";
import { AgreementsList } from "./list";

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-4">
      <AgreementsList orgName={orgName} collections={result.data} />
    </div>
  );
}
