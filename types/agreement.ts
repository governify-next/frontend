export interface IWindow {
  period: {
    unit: string;
    value: number;
  }[];
  anchorDate: Date;
}

export interface IGuarantee {
  name: string;
  info: {
    title: string;
    description: string;
    example: string;
  };
  numericExpression: string;
  comparator: string;
  threshold: number;
  window: IWindow;
  evolutiveWindow: IWindow | null;
  metrics: IMetric[];
}

export interface IMetric {
  metricName: string;
  metricConfig: {
    event: {
      eventId: string;
      fetcherConfigs: {
        fetcherId: string;
        fetcherConfig: Record<string, unknown>;
      }[];
      processConfig: Record<string, unknown>;
    };
    aggregation: {
      aggregatorType: string;
      aggregatorConfig: Record<string, unknown>;
    };
  };
}

export interface ISignature {
  signatureId: string;
  visualizationConfig: {
    label: string;
  };
  guarantee: IGuarantee;
}

export interface IAgreementVersion {
  versionNumber: number;
  contract: {
    agreementTemplateName: string;
    validity: {
      timezone: string;
      initial: Date;
      end: Date;
      earlyTermination: Date | null;
    };
    signatures: ISignature[];
  };
}

export interface IAgreementCollection {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  scopeId: string;
  auditableVersionNumber: number | null;
  agreementVersions: IAgreementVersion[];
}

export enum CollectionPermission {
  VIEW = "collection:view",
  AUTO_TRACKING = "collection:auto-tracking",
  TRACK_PERIOD = "collection:track-period",
  TERMINATE_VERSION = "version:terminate",
  EDIT = "collection:edit",
  VIEW_EVOLUTIVE = "collection:view-evolutive",
  DELETE = "collection:delete",
}

export type ICollectionPermissions = Record<CollectionPermission, string[]>;

export interface IAgreementCollectionWithActions extends IAgreementCollection {
  allowedActions: Record<CollectionPermission, boolean>;
}

export interface ITask {
  _id: string;
  script: string;
  inputArgs: Record<string, unknown>;
  type: "IMMEDIATE" | "PROGRAMMED" | "RECURRING";
  enabled: boolean;
  startDate: Date;
  endDate: Date;
  anchorDate: Date;
  interval: number;
}

export enum CalculationState {
  NO_TASKS = "NO_TASKS",
  ALL_TASKS_ENABLED = "ALL_TASKS_ENABLED",
  SOME_TASKS_DISABLED = "SOME_TASKS_DISABLED",
}

export type IAgreementCollectionPayload = Pick<
  IAgreementCollection,
  "name" | "displayName" | "description"
>;
