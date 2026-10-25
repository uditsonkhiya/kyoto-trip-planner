import Chat from "./chat";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col font-sans">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
          <h1 className="text-lg font-semibold tracking-tight">Kyoto Trip Planner</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            This is a prototype with sample data. Nothing here is a real listing or booking.
          </p>
        </div>
      </header>
      <Chat />
    </div>
  );
}
