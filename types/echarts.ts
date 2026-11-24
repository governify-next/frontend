import type { ICompliancePoint } from "./compliance";

export type IComplianceChartPoint = Pick<
  ICompliancePoint,
  "time" | "value" | "consolidated" | "stateId" | "complianceStatus"
>;

export type IComplianceChartFocusedPoint = Omit<
  IComplianceChartPoint,
  "stateId"
> & {
  x: number;
  y: number;
  members: IComplianceChartMember[];
  pinned: boolean;
};

export type IComplianceChartMember = {
  label: string;
  color: string;
  stateId: string;
};
