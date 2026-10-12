export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

export const avatarFallback = (text: string) => {
  return text.trim().charAt(0).toUpperCase() || "U";
};

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
