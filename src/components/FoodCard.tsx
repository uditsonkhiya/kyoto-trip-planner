export type Food = {
  restaurantName: string;
  neighbourhood: string;
  mealType: string;
  /** e.g. "$", "$$", "$$$" */
  priceRange: string;
  pricePerPerson: number;
  highlight: string;
};

export default function FoodCard({ food }: { food: Food }) {
  return (
    <article className="flex overflow-hidden rounded-2xl border border-zinc-200 border-l-4 border-l-amber-500 bg-white shadow-sm dark:border-zinc-800 dark:border-l-amber-500 dark:bg-zinc-900">
      <div
        role="img"
        aria-label={`Photo of ${food.restaurantName} coming soon`}
        className="flex w-28 shrink-0 items-center justify-center bg-amber-100 text-amber-500 sm:w-40 dark:bg-amber-500/10"
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

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
          {food.neighbourhood}
        </p>
        <h3 className="text-xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {food.restaurantName}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {food.mealType} · <span aria-label={`Price range ${food.priceRange}`}>{food.priceRange}</span>
        </p>
        <p className="w-fit rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
          {food.highlight}
        </p>
        <p className="mt-auto pt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            ${food.pricePerPerson}
          </span>{" "}
          / person
        </p>
      </div>
    </article>
  );
}
