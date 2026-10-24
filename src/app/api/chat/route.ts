import { answer } from "@/lib/answer";
import { loadWorkbook } from "@/lib/workbook";

export async function POST(request: Request) {
  const { message } = (await request.json().catch(() => ({}))) as { message?: unknown };
  if (typeof message !== "string") {
    return Response.json({ error: "Expected { message: string }" }, { status: 400 });
  }

  try {
    // Read the workbook on every request so edits show up without a restart.
    const sheets = await loadWorkbook();
    return Response.json({ reply: answer(message, sheets) });
  } catch (err) {
    console.error("Failed to read workbook", err);
    return Response.json(
      { reply: "I couldn't read Kyoto_weekend_workbook.xlsx. Make sure it's in the project folder and saved as .xlsx." },
      { status: 500 },
    );
  }
}
