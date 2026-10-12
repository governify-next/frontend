import { redirect } from "next/navigation";
import {
  createLoader,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsStringLiteral,
  SearchParams,
} from "nuqs/server";

export const REFRESH_INTERVALS = {
  Off: 0,
  "10s": 10_000,
  "30s": 30_000,
  "1m": 60_000,
  "5m": 300_000,
  "15m": 900_000,
  "30m": 1_800_000,
  "1h": 3_600_000,
  "2h": 7_200_000,
  "1d": 86_400_000,
};
export const REFRESH_OPTIONS = Object.keys(
  REFRESH_INTERVALS,
) as (keyof typeof REFRESH_INTERVALS)[];

export const agreementVersionSearchParams = {
  version: parseAsInteger,
  from: parseAsIsoDateTime,
  to: parseAsIsoDateTime,
  showEvolutivePoints: parseAsBoolean.withDefault(true),
  refresh: parseAsStringLiteral(REFRESH_OPTIONS).withDefault("15m"),
};
const loadSearchParams = createLoader(agreementVersionSearchParams);
const serialize = createSerializer(agreementVersionSearchParams);

export const loadAgreementVersionSearchParams = async (
  searchParams: Promise<SearchParams>,
  pathname: string,
) => {
  const params = loadSearchParams(await searchParams);
  if (params.from && params.to && params.from >= params.to) {
    redirect(serialize(pathname, { ...params, from: null, to: null }));
  }
  return params;
};
