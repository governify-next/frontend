export type ComplianceStatus =
  "COMPLIANT" | "NON_COMPLIANT" | "INDETERMINATE" | "PENDING";

export interface ICompliancePoint {
  time: string;
  signatureId: string;
  stateId: string;
  value: number;
  complianceStatus: ComplianceStatus;
  consolidated: boolean;
}

export interface IGuaranteeCompliance {
  allTime: number | null;
  selectedPeriod: number | null;
  bySignature: {
    signatureId: string;
    allTime: number | null;
    selectedPeriod: number | null;
  }[];
  points: ICompliancePoint[];
}

export interface IComplianceState {
  metrics: {
    metricName: string;
    status: "PENDING" | "COMPUTED" | "UNAVAILABLE" | "FAILED";
    value: number | null;
    errorMessage: string | null;
    evidences: Record<string, unknown>[];
  }[];
  numericExpression: string;
  numericExpressionValue: number | null;
  complianceStatus: ComplianceStatus;
}

export type IComplianceData = Record<string, IGuaranteeCompliance>;

export type IComplianceTimelinePoint = Pick<
  ICompliancePoint,
  "time" | "value" | "consolidated" | "stateId"
> & {
  x: number;
  y: number;
  label: string;
  color: string;
  pinned: boolean;
};
