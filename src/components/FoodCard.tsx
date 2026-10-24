export type Food = {
  restaurantName: string;
  neighbourhood: string;
  mealType: string;
  /** e.g. "$", "$$", "$$$" */
  priceRange: string;
  pricePerPerson: number;
  highlight: string;
};

const MAX_PRICE_RANGE = 4;

// Menu-style card: centred, serif type, round photo and a dotted dish-to-price line.
export default function FoodCard({ food }: { food: Food }) {
  return (
    <article className="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center dark:border-amber-500/30 dark:bg-amber-500/5">
      <div
        role="img"
        aria-label={`Photo of ${food.restaurantName} coming soon`}
        className="flex size-16 items-center justify-center rounded-full bg-amber-200 text-amber-700 ring-4 ring-white dark:bg-amber-500/20 dark:text-amber-300 dark:ring-zinc-900"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="size-6"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="m21 16-5-5-9 9" />
        </svg>
      </div>

      <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300">
        {food.mealType} · {food.neighbourhood}
      </p>
      <h3 className="font-serif text-2xl leading-tight text-zinc-900 dark:text-zinc-50">
        {food.restaurantName}
      </h3>
      <div aria-hidden="true" className="h-px w-12 bg-amber-300 dark:bg-amber-500/40" />

      <p className="flex w-full items-baseline gap-2 font-serif text-zinc-800 dark:text-zinc-200">
        <span className="italic">{food.highlight}</span>
        <span
          aria-hidden="true"
          className="flex-1 border-b-2 border-dotted border-amber-400 dark:border-amber-500/50"
        />
        <span className="font-semibold">${food.pricePerPerson}</span>
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        per person ·{" "}
        <span className="font-semibold text-amber-800 dark:text-amber-300">{food.priceRange}</span>
        <span aria-hidden="true" className="text-amber-300 dark:text-amber-500/40">
          {"$".repeat(Math.max(0, MAX_PRICE_RANGE - food.priceRange.length))}
        </span>
      </p>
    </article>
  );
}
