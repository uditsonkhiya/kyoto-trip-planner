import Chat from "./chat";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col font-sans">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="mx-auto w-full max-w-3xl px-4 py-4 text-lg font-semibold tracking-tight">
          Kyoto Trip Planner
        </h1>
      </header>
      <Chat />
    </div>
  );
}
