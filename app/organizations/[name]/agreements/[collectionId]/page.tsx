import {
  getAgreementCollection,
  getAgreementVersionByCollection,
  getConsolidationStateTasksForAgreementVersion,
} from "@/data/agreements/fetch";
import { ErrorPage } from "@/components/errors";
import { AgreementDetail } from "./detail";
import { loadAgreementVersionSearchParams } from "./search-params";
import { SearchParams } from "nuqs/server";
import { CalculationState, ITask } from "@/types/agreement";

export default async function AgreementDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string; collectionId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { name, collectionId } = await params;
  const orgName = decodeURIComponent(name);

  const collectionResult = await getAgreementCollection(orgName, collectionId);

  if (!collectionResult.ok) {
    return (
      <ErrorPage
        result={collectionResult}
        message="Something went wrong while loading the agreement."
      />
    );
  }

  // if url typed by hand
  if (collectionResult.data.agreementVersions.length === 0) {
    return (
      <ErrorPage
        result={{ ok: false, status: 404, error: "No versions yet." }}
        message="Something went wrong while loading the agreement."
      />
    );
  }

  const { version: selectedVersion } =
    await loadAgreementVersionSearchParams(searchParams);
  const collection = collectionResult.data;
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

  const stateTasksResult = await getConsolidationStateTasksForAgreementVersion(
    orgName,
    collection.scopeId,
    collection._id,
    version.versionNumber,
  );

  if (!stateTasksResult.ok) {
    return (
      <ErrorPage
        result={stateTasksResult}
        message="There was an error while loading the state tasks."
      />
    );
  }

  const getCalculationState = (stateTasks: ITask[]) => {
    // 1. No hay tareas (data.length === 0) -> start verde
    // 2. Hay tareas, todas con enabled a false -> start verde
    if (stateTasks.length === 0 || stateTasks.every((task) => !task.enabled)) {
      return CalculationState.NO_TASKS;
    }
    // 3. Hay tareas, todas con enabled a true -> stop rojo
    if (stateTasks.every((task) => task.enabled)) {
      return CalculationState.ALL_TASKS_ENABLED;
    }
    // 4. Hay tareas, alguna con enabled a false -> stop anaranjado
    return CalculationState.SOME_TASKS_DISABLED;
  };

  const calculationState = getCalculationState(stateTasksResult.data);

  const agreementFullVersionResult = await getAgreementVersionByCollection(
    orgName,
    collection.scopeId,
    collection._id,
    version.versionNumber,
  );

  if (!agreementFullVersionResult.ok) {
    return (
      <ErrorPage
        result={agreementFullVersionResult}
        message="Something went wrong while loading the agreement version."
      />
    );
  }

  return (
    <AgreementDetail
      orgName={orgName}
      collection={collectionResult.data}
      calculationState={calculationState}
      version={agreementFullVersionResult.data}
    />
  );
}
