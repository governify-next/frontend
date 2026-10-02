import { createLoader, parseAsInteger, parseAsIsoDateTime } from "nuqs/server";

export const agreementVersionSearchParams = {
  version: parseAsInteger,
  // PoC: dashboard range
  from: parseAsIsoDateTime,
  to: parseAsIsoDateTime,
};
export const loadAgreementVersionSearchParams = createLoader(
  agreementVersionSearchParams,
);
