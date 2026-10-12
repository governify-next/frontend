import { IAgreementVersion } from "@/types/agreement";

export const getValidityEnd = (
  validity: IAgreementVersion["contract"]["validity"],
) => {
  const contractEnd = new Date(validity.end);
  const earlyTermination = validity.earlyTermination
    ? new Date(validity.earlyTermination)
    : null;
  return earlyTermination && earlyTermination < contractEnd
    ? earlyTermination
    : contractEnd;
};

export const getDefaultComplianceRange = () => {
  const to = new Date();
  return { from: new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000), to };
};
