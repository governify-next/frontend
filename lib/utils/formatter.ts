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
