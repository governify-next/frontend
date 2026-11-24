import {
  ComplianceStatus,
  ICompliancePoint,
  ISignatureCompliance,
} from "@/types/compliance";

export const toCompliancePoint = (row: {
  time: number;
  signatureId: string;
  stateId: string;
  numericExpressionValue: number;
  complianceStatus: ComplianceStatus;
  consolidated: boolean;
}): ICompliancePoint => ({
  time: new Date(row.time).toISOString(),
  signatureId: row.signatureId,
  stateId: row.stateId,
  value: row.numericExpressionValue,
  complianceStatus: row.complianceStatus,
  consolidated: row.consolidated,
});

export const toSignatureCompliance = (row: {
  signatureId: string;
  total: bigint;
  compliant: bigint;
  totalInRange: bigint;
  compliantInRange: bigint;
}): ISignatureCompliance => ({
  signatureId: row.signatureId,
  total: Number(row.total),
  compliant: Number(row.compliant),
  totalInRange: Number(row.totalInRange),
  compliantInRange: Number(row.compliantInRange),
});
