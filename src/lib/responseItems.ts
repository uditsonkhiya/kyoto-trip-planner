import type { ResponseItem } from "@/data/mockResponse";

const CARD_TYPES = new Set(["stay", "experience", "food"]);

// Blank or malformed fields are fine (each card shows filler for those), but an
// item needs a known type and a data object before any card can be built.
function isCardItem(value: unknown): value is ResponseItem {
  if (typeof value !== "object" || value === null) return false;
  const { type, data } = value as { type?: unknown; data?: unknown };
  return (
    typeof type === "string" &&
    CARD_TYPES.has(type) &&
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data)
  );
}

/** The reply as card items, or undefined if any part of it can't become a card. */
export function toResponseItems(value: unknown): ResponseItem[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  return value.every(isCardItem) ? value : undefined;
}
