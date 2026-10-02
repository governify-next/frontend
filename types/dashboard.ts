export interface IDashboardPoint {
  time: string;
  signatureId: string;
  stateId: string;
  value: number;
  complianceStatus: string;
  consolidated: boolean;
}

export interface IGuaranteeDashboardData {
  allTime: number | null;
  selectedPeriod: number | null;
  bySignature: {
    signatureId: string;
    allTime: number | null;
    selectedPeriod: number | null;
  }[];
  points: IDashboardPoint[];
}

export type IDashboardData = Record<string, IGuaranteeDashboardData>;
