import { bootEnv } from "../../lib/bootConfig";
import {
  IAgreementCollectionWithActions,
  IAgreementVersion,
  ICollectionPermissions,
  ISignature,
  ITask,
} from "@/types/agreement";
import { IComplianceData, ISignatureCompliance } from "@/types/compliance";
import { apiFetcher, Result } from "../../lib/utils/fetcher";
import { influxFetcher } from "@/lib/influx";
import { signatureComplianceQuery, signatureStatesQuery } from "./queries";
import { toCompliancePoint, toSignatureCompliance } from "./mappers";

export const getAgreementCollections = async (orgName: string) => {
  return await apiFetcher<
    (IAgreementCollectionWithActions & { autoTracking: boolean })[]
  >(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/agreementCollections`,
    { method: "GET" },
  );
};

export const getAgreementCollection = async (
  orgName: string,
  agColId: string,
) => {
  return await apiFetcher<IAgreementCollectionWithActions>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/agreementCollections/${agColId}`,
    { method: "GET" },
  );
};

export const getStateTasksForAgreementVersion = async (
  orgName: string,
  scopeId: string,
  agColId: string,
  agVersionNumber: number,
) => {
  const tasksUrl = `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${encodeURIComponent(orgName)}/scopes/${encodeURIComponent(scopeId)}/agreementCollections/${encodeURIComponent(agColId)}/agreementVersions/${agVersionNumber}/tasks/states`;
  const [consolidated, evolutive] = await Promise.all([
    apiFetcher<ITask[]>(`${tasksUrl}/consolidated`, { method: "GET" }),
    apiFetcher<ITask[]>(`${tasksUrl}/evolutive`, { method: "GET" }),
  ]);
  if (!consolidated.ok) return consolidated;
  if (!evolutive.ok) return evolutive;
  return { ok: true as const, data: [...consolidated.data, ...evolutive.data] };
};

export const getAgreementVersionByCollection = async (
  orgName: string,
  scopeId: string,
  agColId: string,
  agVersionNumber: number,
) => {
  return await apiFetcher<IAgreementVersion>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${orgName}/scopes/${scopeId}/agreementCollections/${agColId}/agreementVersions/${agVersionNumber}?expand=true`,
    { method: "GET" },
  );
};

const getSignatureStates = async (
  signatureIds: string[],
  from: Date,
  to: Date,
) => {
  return await influxFetcher(
    signatureStatesQuery(signatureIds, from, to),
    toCompliancePoint,
  );
};

const getSignatureCompliance = async (
  signatureIds: string[],
  from: Date,
  to: Date,
) => {
  return await influxFetcher(
    signatureComplianceQuery(signatureIds, from, to),
    toSignatureCompliance,
  );
};

export const getAgreementVersionCompliance = async (
  signatures: ISignature[],
  from: Date,
  to: Date,
): Promise<Result<IComplianceData>> => {
  const signatureIds = signatures.map(({ signatureId }) => signatureId);
  const [points, counts] = await Promise.all([
    getSignatureStates(signatureIds, from, to),
    getSignatureCompliance(signatureIds, from, to),
  ]);
  if (!points.ok) return points;
  if (!counts.ok) return counts;

  const percentage = (compliant: number, total: number) =>
    total === 0 ? null : (100 * compliant) / total;

  const data: IComplianceData = {};
  for (const [guaranteeName, guaranteeSignatures] of Map.groupBy(
    signatures,
    ({ guarantee }) => guarantee.name,
  )) {
    const guaranteeSignatureIds = guaranteeSignatures.map(
      ({ signatureId }) => signatureId,
    );
    const guaranteeCounts = counts.data.filter(({ signatureId }) =>
      guaranteeSignatureIds.includes(signatureId),
    );
    const guaranteePoints = points.data.filter(({ signatureId }) =>
      guaranteeSignatureIds.includes(signatureId),
    );
    const sum = (key: Exclude<keyof ISignatureCompliance, "signatureId">) =>
      guaranteeCounts.reduce((acc, row) => acc + row[key], 0);

    data[guaranteeName] = {
      allTime: percentage(sum("compliant"), sum("total")),
      selectedPeriod: percentage(sum("compliantInRange"), sum("totalInRange")),
      bySignature: guaranteeCounts.map((row) => ({
        signatureId: row.signatureId,
        allTime: percentage(row.compliant, row.total),
        selectedPeriod: percentage(row.compliantInRange, row.totalInRange),
      })),
      points: guaranteePoints,
    };
  }
  return { ok: true, data };
};

export const getAgreementVersionGrafanaDashboard = async (
  orgName: string,
  scopeId: string,
  agColId: string,
  agVersionNumber: number,
) => {
  return await apiFetcher<{ grafanaUrl: string }>(
    `${bootEnv.REPORTER_SERVICE_URL}/api/v1/dashboards/organizations/${encodeURIComponent(orgName)}/scopes/${encodeURIComponent(scopeId)}/agreementCollections/${encodeURIComponent(agColId)}/agreementVersions/${agVersionNumber}`,
    { method: "GET" },
  );
};

export const getCollectionPermissions = async (
  orgName: string,
  agColId: string,
) => {
  return await apiFetcher<ICollectionPermissions>(
    `${bootEnv.REGISTRY_SERVICE_URL}/api/v1/organizations/${encodeURIComponent(orgName)}/agreementCollections/${encodeURIComponent(agColId)}/permissions`,
    { method: "GET" },
  );
};
