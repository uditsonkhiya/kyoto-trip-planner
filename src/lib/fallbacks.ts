// Card fields come straight from workbook cells, and a blank cell arrives as
// "" (or not at all). These helpers turn a missing or malformed value into
// undefined so each card can show its filler text instead of "Invalid Date",
// "NaN min" or a lone "$".

export const FILLER = {
  name: "Name coming soon",
  neighbourhood: "Kyoto",
  date: "Date TBC",
  duration: "Duration TBC",
  price: "Price on request",
  priceRange: "Price range TBC",
  mealType: "Any meal",
  highlight: "Details coming soon",
} as const;

export function text(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return undefined;
  return value.trim() || undefined;
}

export function amount(value: unknown): number | undefined {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** A valid "YYYY-MM-DD" string as a UTC Date, else undefined. */
export function isoDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return undefined;
  const date = new Date(value.trim() + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value: unknown): string {
  return (
    isoDate(value)?.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }) ?? FILLER.date
  );
}

export function formatDuration(value: unknown): string {
  const hours = amount(value);
  if (!hours) return FILLER.duration;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** "$", "$$", "$$$" or "$$$$", else undefined. */
export function priceRange(value: unknown): string | undefined {
  const range = text(value);
  return range && /^\${1,4}$/.test(range) ? range : undefined;
}
