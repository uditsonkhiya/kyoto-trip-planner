import { amount, FILLER, formatDate, isoDate, text } from "@/lib/fallbacks";

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

// Booking-style card: tall photo banner on top, details stacked below.
export default function StayCard({ stay }: { stay: Stay }) {
  const title = text(stay.listingTitle) ?? FILLER.name;
  const checkIn = isoDate(stay.checkIn);
  const checkOut = isoDate(stay.checkOut);
  const nights =
    checkIn && checkOut
      ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000)
      : 0;
  const price = amount(stay.pricePerNight);

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="relative">
        <div
          role="img"
          aria-label={`Photo of ${title} coming soon`}
          className="flex h-40 items-center justify-center bg-linear-to-br from-coral-100 to-coral-300 text-coral-600 dark:from-coral-500/25 dark:to-coral-500/5 dark:text-coral-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="size-10"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="m21 16-5-5-9 9" />
          </svg>
        </div>
        {nights > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-coral-700 shadow-sm dark:bg-zinc-900/90 dark:text-coral-300">
            {nights} night{nights === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div>
          <h3 className="text-xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-4 text-coral-500"
              aria-hidden="true"
            >
              <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {text(stay.neighbourhood) ?? FILLER.neighbourhood}
          </p>
        </div>

        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          <span className="text-coral-500" aria-hidden="true">
            ✦{" "}
          </span>
          {text(stay.highlight) ?? FILLER.highlight}
        </p>

        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-2xl border border-zinc-200 text-sm dark:divide-zinc-800 dark:border-zinc-800">
          <div className="p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Check-in</dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
              {formatDate(stay.checkIn)}
            </dd>
          </div>
          <div className="p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Check-out</dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
              {formatDate(stay.checkOut)}
            </dd>
          </div>
        </dl>

        <div className="flex items-baseline justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          {price === undefined ? (
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{FILLER.price}</p>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">${price}</span>{" "}
              / night
            </p>
          )}
          {price !== undefined && nights > 0 && (
            <p className="text-sm font-semibold text-coral-600 dark:text-coral-300">
              ${price * nights} total
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
