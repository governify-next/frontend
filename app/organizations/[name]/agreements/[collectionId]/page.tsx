import {
  getAgreementCollection,
  getConsolidationStateTasksForAgreementVersion,
} from "@/data/agreements/fetch";
import { ErrorPage } from "@/components/errors";
import { AgreementDetail } from "./detail";
import { loadAgreementVersionSearchParams } from "./search-params";
import { SearchParams } from "nuqs/server";
import { toast } from "sonner";

export default async function AgreementDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string; collectionId: string }>;
  searchParams: Promise<SearchParams>;
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
        result={{ ok: false, status: 404, error: "No versions yet." }}
        message="Something went wrong while loading the agreement."
      />
    );
  }

  const { version: selectedVersion } =
    await loadAgreementVersionSearchParams(searchParams);
  const collection = result.data;
  const versions = collection.agreementVersions;
  // The one in the URL, the active one, or the highest as a last resort.
  const version =
    versions.find((candidate) => candidate.versionNumber === selectedVersion) ??
    versions.find(
      (candidate) =>
        candidate.versionNumber === collection.auditableVersionNumber,
    ) ??
    versions.reduce((max, candidate) =>
      candidate.versionNumber > max.versionNumber ? candidate : max,
    );

  const hasConsolidationStateTasksForVersion =
    await getConsolidationStateTasksForAgreementVersion(
      orgName,
      collection.scopeId,
      collection._id,
      version.versionNumber,
    ).then((result) => {
      if (!result.ok) {
        toast.error("There was an error while loading the calculations state.");
        return false;
      }
      return result.data.length > 0;
    });

  return (
    <AgreementDetail
      orgName={orgName}
      collection={result.data}
      hasTasks={hasConsolidationStateTasksForVersion}
      version={version}
    />
  );
}
