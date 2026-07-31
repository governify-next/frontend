export interface IAgreementVersion {
  versionNumber: number;
  contract: {
    agreementTemplateId: string;
    validity: {
      timezone: string;
      initial: Date;
      end: Date;
      earlyTermination: Date | null;
    };
    signaturesId: string[];
  };
}

export interface IAgreementCollection {
  _id: string;
  name: string;
  displayName: string;
  scopeId: string;
  auditableVersionNumber: number | null;
  agreementVersions: IAgreementVersion[];
}
