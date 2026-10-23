import type { ComplianceStatus } from "@/types/compliance";

export const EXPAND_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const COMPACT_DATE_TIME_FORMAT = "MMM d HH:mm";

export const avatarFallback = (text: string) => {
  return text.trim().charAt(0).toUpperCase() || "U";
};

export const pluralize = (count: number, word: string) =>
  `${count} ${count === 1 ? word : `${word}s`}`;

export const formatReadableDate = (
  date?: Date | null,
  timeZone?: string,
  fallback = "Never",
) => {
  if (!date) return fallback;

  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: timeZone ? "short" : undefined,
  }).format(new Date(date));
};

export const formatComplianceStatus = (status: ComplianceStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ");

export const breakOnUnderscore = (text: string) =>
  text.replaceAll("_", "_\u200B");

// Parser synced with guaranteeTemplate.validator in registry
const TOKEN_REGEX = /[A-Za-z_][A-Za-z0-9_-]*|\d+(?:\.\d+)?|[+\-*/()]/g;
const REPLACEMENTS: Record<string, string> = { "*": "×", "-": "−" };

export const tokenizeExpression = (expression: string) => {
  const tokens = expression.match(TOKEN_REGEX);

  // If something missing, return null
  if (!tokens || tokens.join("") !== expression) return null;

  return tokens.map((token) => REPLACEMENTS[token] ?? token);
};
