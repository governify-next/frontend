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

export type IComplianceData = Record<string, IGuaranteeCompliance>;

export type IComplianceTimelinePoint = Pick<
  ICompliancePoint,
  "time" | "value" | "consolidated"
> & {
  x: number;
  y: number;
  label: string;
  color: string;
  pinned: boolean;
};
