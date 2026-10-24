import type { Row, Sheet } from "./workbook";

// Keyword-based answers over the workbook rows. No AI: the question is
// scanned for categories, neighbourhoods, meal types, days, price and
// duration limits, plus any words that appear in a row's name or highlight.

type Kind = "stays" | "experiences" | "food" | "other";

const KIND_WORDS: Record<Exclude<Kind, "other">, RegExp> = {
  stays:
    /\b(stay|stays|staying|hotel|hotels|sleep|accommodation|lodging|room|rooms|inn|ryokan|airbnb|listing|listings|night|nights|nightly|bed)\b/,
  experiences:
    /\b(do|doing|activity|activities|experience|experiences|tour|tours|walk|walks|class|classes|hike|hikes|workshop|workshops|things|sightseeing|see|visit)\b/,
  food:
    /\b(eat|eating|food|foods|restaurant|restaurants|dinner|lunch|breakfast|dessert|desserts|meal|meals|cafe|cafes|snack|snacks|drink|dine|dining)\b/,
};

const MEALS = ["breakfast", "lunch", "dinner", "dessert"];
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const CHEAP = /\b(cheap|cheaper|cheapest|budget|affordable|inexpensive|low[- ]cost|economical)\b/;
const PRICEY = /\b(expensive|priciest|pricey|luxury|luxurious|splurge|fancy|upscale|premium|high[- ]end)\b/;
const SUPERLATIVE = /\b(cheapest|priciest|most expensive|least expensive|longest|shortest)\b/;

const STOPWORDS = new Set(
  "a an the and or of in on anything something everything stuff at to for with near by from is are was be me my i we our us you your it its this that these those what which who where when how any some all show list give tell find get want need like would could should can please recommend suggest suggestion suggestions option options place places spot spots good great nice best top kyoto trip weekend there here around about under below above over less more than per person price prices cost costs usd dollars hours hour hrs day days time much many also just only".split(
    " ",
  ),
);

type Filters = {
  kinds: Set<Kind>;
  neighbourhoods: string[];
  meals: string[];
  dates: string[];
  maxPrice?: number;
  minPrice?: number;
  maxHours?: number;
  sort?: "asc" | "desc";
  sortBy: "price" | "duration";
  onlyTop: boolean;
  terms: string[];
};

export function answer(question: string, sheets: Sheet[]): string {
  const q = question.toLowerCase().replace(/[’']/g, "'").trim();
  if (!q) return helpText(sheets);

  const filters = parse(q, sheets);
  const recognised =
    filters.kinds.size > 0 ||
    filters.neighbourhoods.length > 0 ||
    filters.meals.length > 0 ||
    filters.dates.length > 0 ||
    filters.maxPrice !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxHours !== undefined ||
    filters.sort !== undefined;

  // Only treat leftover words as a filter if they actually match something.
  const termMatches = (row: Row) => filters.terms.some((t) => rowText(row).includes(t));
  const anyTermMatch = sheets.some((s) => s.rows.some(termMatches));

  if (!recognised && !anyTermMatch) {
    if (/^(hi|hello|hey|help|konnichiwa|yo)\b/.test(q) || filters.terms.length === 0) {
      return helpText(sheets);
    }
    return `I couldn't find "${question.trim()}" in your workbook.\n\n${helpText(sheets)}`;
  }

  const sections: string[] = [];
  for (const sheet of sheets) {
    const kind = kindOf(sheet);
    if (filters.kinds.size > 0 && !filters.kinds.has(kind)) continue;

    let rows = sheet.rows.filter((row) => matches(row, sheet, filters));
    if (anyTermMatch) rows = rows.filter(termMatches);
    if (rows.length === 0) continue;

    if (filters.sort) {
      const col = filters.sortBy === "duration" ? col_(sheet, /duration|hours/) : priceCol(sheet);
      if (col) {
        const dir = filters.sort === "asc" ? 1 : -1;
        rows = [...rows].sort((a, b) => (num(a[col]) - num(b[col])) * dir);
        if (filters.onlyTop) rows = rows.slice(0, 1);
      }
    }

    sections.push(`${sheet.name} (${rows.length}):\n${rows.map((r) => "• " + formatRow(r, sheet)).join("\n")}`);
  }

  if (sections.length === 0) {
    return `Nothing in your workbook matches${describe(filters)}. Try loosening a filter — for example drop the price limit or the neighbourhood.`;
  }
  return `Here's what I found${describe(filters)}:\n\n${sections.join("\n\n")}`;
}

function parse(q: string, sheets: Sheet[]): Filters {
  let rest = q;
  const take = (re: RegExp) => {
    const m = re.exec(rest);
    if (m) rest = rest.replace(m[0], " ");
    return m;
  };

  const kinds = new Set<Kind>();
  for (const [kind, re] of Object.entries(KIND_WORDS) as [Kind, RegExp][]) {
    if (re.test(q)) kinds.add(kind);
  }

  const meals = MEALS.filter((m) => q.includes(m));

  const allNeighbourhoods = new Set<string>();
  for (const s of sheets) {
    const c = col_(s, /neighbo/);
    if (c) s.rows.forEach((r) => r[c] && allNeighbourhoods.add(String(r[c])));
  }
  const neighbourhoods = [...allNeighbourhoods].filter((n) => q.includes(n.toLowerCase()));
  neighbourhoods.forEach((n) => (rest = rest.replaceAll(n.toLowerCase(), " ")));

  // Durations first so "under 2 hours" isn't read as a price.
  const hours = take(/\b(?:under|below|less than|up to|max(?:imum)?|within|at most)\s*(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hours?)\b/);
  const maxHours = hours ? Number(hours[1]) : undefined;

  const max = take(/(?:under|below|less than|cheaper than|up to|max(?:imum)?|at most|within|<)\s*\$?\s*(\d+)/);
  const min = take(/(?:over|above|more than|at least|min(?:imum)?|>)\s*\$?\s*(\d+)/);

  const dates = parseDates(q, sheets);

  let sort: Filters["sort"];
  let sortBy: Filters["sortBy"] = "price";
  if (/\b(longest)\b/.test(q)) [sort, sortBy] = ["desc", "duration"];
  else if (/\b(shortest|quick|quickest|short)\b/.test(q)) [sort, sortBy] = ["asc", "duration"];
  else if (/\b(most expensive)\b/.test(q) || PRICEY.test(q)) sort = "desc";
  else if (/\b(least expensive)\b/.test(q) || CHEAP.test(q)) sort = "asc";

  const recognisedWords = new Set([
    ...MEALS,
    ...WEEKDAYS,
    ...MONTHS,
    ...WEEKDAYS.map((d) => d.slice(0, 3)),
    "today", "tomorrow", "weekend", "saturday", "sunday", "april", "first", "second", "last",
  ]);
  const terms = rest
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !recognisedWords.has(w) && !/^\d/.test(w))
    .filter((w) => !Object.values(KIND_WORDS).some((re) => re.test(w)))
    .filter((w) => !CHEAP.test(w) && !PRICEY.test(w) && !SUPERLATIVE.test(w))
    .filter((w) => !/^(quick|quickest|short|shortest|longest|long)$/.test(w))
    .map((w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w));

  return {
    kinds,
    neighbourhoods,
    meals,
    dates,
    maxPrice: max ? Number(max[1]) : undefined,
    minPrice: min ? Number(min[1]) : undefined,
    maxHours,
    sort,
    sortBy,
    onlyTop: SUPERLATIVE.test(q),
    terms,
  };
}

// Resolve weekday names ("saturday") and calendar days ("apr 12", "12th")
// against the dates that actually appear in the workbook.
function parseDates(q: string, sheets: Sheet[]): string[] {
  const known = new Set<string>();
  for (const s of sheets) {
    for (const h of s.headers.filter((h) => /date/i.test(h))) {
      s.rows.forEach((r) => typeof r[h] === "string" && /^\d{4}-\d\d-\d\d$/.test(r[h]) && known.add(r[h]));
    }
  }

  const out = new Set<string>();
  for (const iso of known) {
    const d = new Date(iso + "T00:00:00Z");
    const weekday = WEEKDAYS[d.getUTCDay()];
    const day = d.getUTCDate();
    const month = MONTHS[d.getUTCMonth()];
    const dayRe = `${day}(?:st|nd|rd|th)?`;
    if (
      new RegExp(`\\b(${weekday}|${weekday.slice(0, 3)})\\b`).test(q) ||
      new RegExp(`\\b${month}[a-z]*\\.?\\s+${dayRe}\\b`).test(q) ||
      new RegExp(`\\b${dayRe}\\s+(?:of\\s+)?${month}`).test(q) ||
      new RegExp(`\\b${day}(?:st|nd|rd|th)\\b`).test(q) ||
      q.includes(iso)
    ) {
      out.add(iso);
    }
  }
  return [...out];
}

function matches(row: Row, sheet: Sheet, f: Filters): boolean {
  const n = col_(sheet, /neighbo/);
  if (f.neighbourhoods.length && n && !f.neighbourhoods.includes(String(row[n]))) return false;

  const meal = col_(sheet, /meal/);
  if (f.meals.length && meal && !f.meals.some((m) => String(row[meal]).toLowerCase().includes(m))) return false;

  if (f.dates.length) {
    const checkIn = col_(sheet, /check-?in/);
    const checkOut = col_(sheet, /check-?out/);
    const date = col_(sheet, /date/);
    if (checkIn && checkOut) {
      // A stay covers a night if check-in <= day < check-out.
      if (!f.dates.some((d) => String(row[checkIn]) <= d && d < String(row[checkOut]))) return false;
    } else if (date && !f.dates.includes(String(row[date]))) {
      return false;
    }
  }

  const price = priceCol(sheet);
  if (price) {
    if (f.maxPrice !== undefined && num(row[price]) > f.maxPrice) return false;
    if (f.minPrice !== undefined && num(row[price]) < f.minPrice) return false;
  }

  const hours = col_(sheet, /duration|hours/);
  if (f.maxHours !== undefined && hours && num(row[hours]) > f.maxHours) return false;

  return true;
}

export function formatRow(row: Row, sheet: Sheet): string {
  const [nameCol, ...others] = sheet.headers.filter(Boolean);
  const n = col_(sheet, /neighbo/);
  const price = priceCol(sheet);
  const checkIn = col_(sheet, /check-?in/);
  const checkOut = col_(sheet, /check-?out/);
  const date = col_(sheet, /date/);
  const hours = col_(sheet, /duration|hours/);
  const meal = col_(sheet, /meal/);
  const range = col_(sheet, /range/);
  const highlight = col_(sheet, /highlight|note/);

  const parts: string[] = [];
  if (checkIn && checkOut) {
    const nights = Math.round((Date.parse(String(row[checkOut])) - Date.parse(String(row[checkIn]))) / 86_400_000);
    parts.push(`${fmtDate(row[checkIn])} – ${fmtDate(row[checkOut])}`);
    if (price) {
      const p = num(row[price]);
      parts.push(nights > 0 ? `$${p}/night × ${nights} = $${p * nights}` : `$${p}/night`);
    }
  } else {
    if (meal) parts.push(String(row[meal]));
    if (date) parts.push(fmtDate(row[date]));
    if (hours) parts.push(`${row[hours]} h`);
    if (range) parts.push(String(row[range]));
    if (price) parts.push(`$${row[price]}/person`);
  }
  if (highlight) parts.push(String(row[highlight]));

  // Any columns we don't know about still get shown.
  const handled = new Set([nameCol, n, price, checkIn, checkOut, date, hours, meal, range, highlight]);
  for (const h of others) if (!handled.has(h) && row[h] !== "") parts.push(`${h}: ${row[h]}`);

  const where = n && row[n] ? ` (${row[n]})` : "";
  return `${row[nameCol]}${where} — ${parts.filter(Boolean).join(" · ")}`;
}

function describe(f: Filters): string {
  const bits: string[] = [];
  if (f.meals.length) bits.push(f.meals.join("/"));
  if (f.neighbourhoods.length) bits.push(`in ${f.neighbourhoods.join(" or ")}`);
  if (f.dates.length) bits.push(`on ${f.dates.map(fmtDate).join(" or ")}`);
  if (f.maxPrice !== undefined) bits.push(`under $${f.maxPrice}`);
  if (f.minPrice !== undefined) bits.push(`over $${f.minPrice}`);
  if (f.maxHours !== undefined) bits.push(`up to ${f.maxHours} h`);
  if (f.sort) {
    const by = f.sortBy === "duration" ? (f.sort === "asc" ? "shortest" : "longest") : f.sort === "asc" ? "cheapest" : "priciest";
    bits.push(`${by} first`);
  }
  if (f.terms.length && !bits.length) bits.push(`for "${f.terms.join(" ")}"`);
  return bits.length ? ` ${bits.join(", ")}` : "";
}

function helpText(sheets: Sheet[]): string {
  const counts = sheets.map((s) => `${s.rows.length} ${s.name.toLowerCase()}`).join(", ");
  return [
    `I answer from your Kyoto workbook (${counts}). Try asking:`,
    "• Where can I stay in Gion?",
    "• Cheapest stay under $150",
    "• What can I do on Sunday?",
    "• Dinner in Pontocho",
    "• Activities under 2 hours",
    "• Anything with matcha",
  ].join("\n");
}

function kindOf(sheet: Sheet): Kind {
  if (/stay|hotel|accommodation|lodging/i.test(sheet.name)) return "stays";
  if (/experience|activit|thing/i.test(sheet.name)) return "experiences";
  if (/food|eat|restaurant|dining/i.test(sheet.name)) return "food";
  return "other";
}

function col_(sheet: Sheet, re: RegExp): string | undefined {
  return sheet.headers.find((h) => re.test(h.toLowerCase()));
}

function priceCol(sheet: Sheet): string | undefined {
  return col_(sheet, /price per|price \(|cost/i) ?? sheet.headers.find((h) => /price/i.test(h) && !/range/i.test(h));
}

function rowText(row: Row): string {
  return Object.values(row).join(" ").toLowerCase();
}

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function fmtDate(v: unknown): string {
  const s = String(v);
  if (!/^\d{4}-\d\d-\d\d$/.test(s)) return s;
  return new Date(s + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
