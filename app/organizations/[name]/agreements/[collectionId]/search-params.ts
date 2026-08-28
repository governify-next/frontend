import { createLoader, parseAsInteger } from "nuqs/server";

export const agreementVersionSearchParams = { version: parseAsInteger };
export const loadAgreementVersionSearchParams = createLoader(
  agreementVersionSearchParams,
);
