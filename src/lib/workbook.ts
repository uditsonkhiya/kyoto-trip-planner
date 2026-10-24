import { readFile } from "node:fs/promises";
import path from "node:path";
import { strFromU8, unzipSync } from "fflate";

export const WORKBOOK_PATH = path.join(
  process.cwd(),
  "Kyoto_weekend_workbook.xlsx",
);

export type Row = Record<string, string | number>;
export type Sheet = { name: string; headers: string[]; rows: Row[] };

// Minimal .xlsx reader: an .xlsx file is a zip of XML parts. We only need
// cell values, so we read the sheet XML directly instead of pulling in a
// full spreadsheet library.
export async function loadWorkbook(file = WORKBOOK_PATH): Promise<Sheet[]> {
  const files = unzipSync(new Uint8Array(await readFile(file)));
  const read = (p: string) => (files[p] ? strFromU8(files[p]) : "");

  const sharedStrings = [...read("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map(
    (m) => textOf(m[1]),
  );

  const rels = new Map<string, string>();
  for (const m of read("xl/_rels/workbook.xml.rels").matchAll(/<Relationship\b[^>]*>/g)) {
    const id = attr(m[0], "Id");
    const target = attr(m[0], "Target");
    if (id && target) {
      rels.set(id, target.startsWith("/") ? target.slice(1) : `xl/${target}`);
    }
  }

  const sheets: Sheet[] = [];
  for (const m of read("xl/workbook.xml").matchAll(/<sheet\b[^>]*>/g)) {
    const name = decode(attr(m[0], "name") ?? "");
    const target = rels.get(attr(m[0], "r:id") ?? "");
    if (!target) continue;
    sheets.push(parseSheet(name, read(target), sharedStrings));
  }
  return sheets;
}

function parseSheet(name: string, xml: string, sharedStrings: string[]): Sheet {
  const grid: (string | number)[][] = [];
  for (const rowMatch of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells: (string | number)[] = [];
    for (const c of rowMatch[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = attr(c[1], "r") ?? "";
      const type = attr(c[1], "t");
      const body = c[2] ?? "";
      const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];
      let value: string | number = "";
      if (type === "s") value = sharedStrings[Number(v)] ?? "";
      else if (type === "inlineStr") value = textOf(body);
      else if (type === "str" || type === "e") value = decode(v ?? "");
      else if (type === "b") value = v === "1" ? "TRUE" : "FALSE";
      else if (v !== undefined) value = Number(v);
      cells[columnIndex(ref, cells.length)] = value;
    }
    grid.push(Array.from(cells, (x) => x ?? ""));
  }

  const [headerRow = [], ...body] = grid;
  const headers = headerRow.map((h) => String(h).trim());
  const rows = body
    .filter((r) => r.some((x) => x !== ""))
    .map((r) => {
      const row: Row = {};
      headers.forEach((h, i) => {
        if (!h) return;
        const value = r[i] ?? "";
        // Excel stores dates as day counts since 1899-12-30.
        row[h] = /date/i.test(h) && typeof value === "number" ? serialToISO(value) : value;
      });
      return row;
    });
  return { name, headers, rows };
}

function serialToISO(serial: number): string {
  return new Date(Date.UTC(1899, 11, 30) + serial * 86_400_000).toISOString().slice(0, 10);
}

function columnIndex(ref: string, fallback: number): number {
  const letters = /^[A-Z]+/.exec(ref)?.[0];
  if (!letters) return fallback;
  return [...letters].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
}

function attr(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
}

function textOf(xml: string): string {
  return [...xml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decode(m[1])).join("");
}

function decode(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}
