export type ComplianceStatus =
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "INDETERMINATE"
  | "PENDING";

export interface ICompliancePoint {
  time: string;
  signatureId: string;
  stateId: string;
  value: number;
  complianceStatus: ComplianceStatus;
  consolidated: boolean;
}

export interface ISignatureCompliance {
  signatureId: string;
  total: number;
  compliant: number;
  totalInRange: number;
  compliantInRange: number;
}

export interface IGuaranteeCompliance {
  // compliance-gauge
  allTime: number | null;
  selectedPeriod: number | null;
  // signature-compliance
  bySignature: {
    signatureId: string;
    allTime: number | null;
    selectedPeriod: number | null;
  }[];
  // timeline-chart
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
