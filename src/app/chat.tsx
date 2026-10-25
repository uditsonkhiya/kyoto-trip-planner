"use client";

import { useEffect, useRef, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { brokenMockResponse, mockResponse, type ResponseItem } from "@/data/mockResponse";
import { toResponseItems } from "@/lib/responseItems";

const TYPING_DELAY_MS = 1500;

// Typing exactly this (any case) sends the broken mock to show the error state.
const FORCE_FAIL_PHRASE = "best places in usa";

type Message =
  | { id: number; role: "user" | "assistant"; text: string }
  | { id: number; role: "assistant"; items: ResponseItem[] }
  | { id: number; role: "assistant"; failed: true };

const initialMessages: Message[] = [
  {
    id: 0,
    role: "assistant",
    text: "Konnichiwa! Ask me anything about your Kyoto weekend — stays, experiences or food.",
  },
];

// Same shape as the assistant bubble, in neutral colours.
function FailedReply({ onRetry }: { onRetry?: () => void }) {
  // Mount the live region empty and add the text a frame later, so screen
  // readers see the region before its content and announce the change.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <li
      aria-live="polite"
      className="max-w-[80%] self-start whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm leading-6 text-gray-800"
    >
      {shown && (
        <>
          <p className="font-medium">{"We couldn't put your plan together just now."}</p>
          <p>Your request is saved, and you can try again.</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 min-h-[44px] rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try again
            </button>
          )}
        </>
      )}
    </li>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  // A disabled input loses focus, so hand it back once the reply lands.
  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setMessages((prev) => [...prev, { id: prev.length, role: "user", text }]);
    setInput("");
    reply(text.toLowerCase() === FORCE_FAIL_PHRASE ? brokenMockResponse : mockResponse);
  }

  function reply(response: unknown) {
    setPending(true);
    timerRef.current = setTimeout(() => {
      const items = toResponseItems(response);
      setMessages((prev) => [
        ...prev,
        items
          ? { id: prev.length, role: "assistant", items }
          : { id: prev.length, role: "assistant", failed: true },
      ]);
      setPending(false);
    }, TYPING_DELAY_MS);
  }

  // Retrying isn't typing the phrase again, so it gets the happy-path reply.
  function retry() {
    setMessages((prev) => prev.slice(0, -1));
    reply(mockResponse);
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <ul className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-6">
          {messages.map((m, i) =>
            "failed" in m ? (
              <FailedReply
                key={m.id}
                // Only the latest failure can be retried; older ones stay as history.
                onRetry={i === messages.length - 1 && !pending ? retry : undefined}
              />
            ) : "items" in m ? (
              <li key={m.id} className="w-full max-w-xl self-start">
                <ul className="flex flex-col gap-3">
                  {m.items.map((item, i) => (
                    <li key={i}>
                      <ItemCard item={item} />
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li
                key={m.id}
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm leading-6 ${
                  m.role === "user"
                    ? "self-end bg-red-700 text-white"
                    : "self-start bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {m.text}
              </li>
            ),
          )}
          {pending && (
            <li
              role="status"
              aria-label="Assistant is typing"
              className="flex gap-1.5 self-start rounded-2xl bg-zinc-100 px-4 py-4 dark:bg-zinc-800"
            >
              {[0, 200, 400].map((delay) => (
                <span
                  key={delay}
                  style={{ animationDelay: `${delay}ms` }}
                  className="size-2 animate-pulse rounded-full bg-zinc-500 dark:bg-zinc-400"
                />
              ))}
            </li>
          )}
        </ul>
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-200 bg-background dark:border-zinc-800"
      >
        <div className="mx-auto flex w-full max-w-3xl gap-2 px-4 py-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={pending}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about stays, experiences or food…"
            aria-label="Message"
            className="flex-1 rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700"
          />
          <button
            type="submit"
            disabled={!input.trim() || pending}
            className="rounded-full bg-red-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </>
  );
}
