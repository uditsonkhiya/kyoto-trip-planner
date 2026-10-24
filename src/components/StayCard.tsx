export type Stay = {
  listingTitle: string;
  neighbourhood: string;
  /** ISO date, e.g. "2025-04-12" */
  checkIn: string;
  /** ISO date, e.g. "2025-04-14" */
  checkOut: string;
  pricePerNight: number;
  highlight: string;
};

export default function StayCard({ stay }: { stay: Stay }) {
  const nights = Math.round(
    (Date.parse(stay.checkOut) - Date.parse(stay.checkIn)) / 86_400_000,
  );

  return (
    <article className="flex overflow-hidden rounded-2xl border border-zinc-200 border-l-4 border-l-coral-500 bg-white shadow-sm dark:border-zinc-800 dark:border-l-coral-500 dark:bg-zinc-900">
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-coral-600 dark:text-coral-300">
          {stay.neighbourhood}
        </p>
        <h3 className="text-xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {stay.listingTitle}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatDate(stay.checkIn)} – {formatDate(stay.checkOut)}
          {nights > 0 && ` · ${nights} night${nights === 1 ? "" : "s"}`}
        </p>
        <p className="w-fit rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-medium text-coral-700 dark:bg-coral-500/15 dark:text-coral-300">
          {stay.highlight}
        </p>
        <p className="mt-auto pt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            ${stay.pricePerNight}
          </span>{" "}
          / night
          {nights > 0 && (
            <span className="text-zinc-500"> · ${stay.pricePerNight * nights} total</span>
          )}
        </p>
      </div>

      <div
        role="img"
        aria-label={`Photo of ${stay.listingTitle} coming soon`}
        className="flex w-28 shrink-0 items-center justify-center bg-coral-100 text-coral-500 sm:w-40 dark:bg-coral-500/10"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="size-8"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="m21 16-5-5-9 9" />
        </svg>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
