export type Experience = {
  activityName: string;
  neighbourhood: string;
  /** ISO date, e.g. "2025-04-12" */
  date: string;
  durationHours: number;
  pricePerPerson: number;
  highlight: string;
};

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className="flex overflow-hidden rounded-2xl border border-zinc-200 border-l-4 border-l-purple-500 bg-white shadow-sm dark:border-zinc-800 dark:border-l-purple-500 dark:bg-zinc-900">
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-purple-600 dark:text-purple-300">
          {experience.neighbourhood}
        </p>
        <h3 className="text-xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {experience.activityName}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatDate(experience.date)} · {formatDuration(experience.durationHours)}
        </p>
        <p className="w-fit rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
          {experience.highlight}
        </p>
        <p className="mt-auto pt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            ${experience.pricePerPerson}
          </span>{" "}
          / person
        </p>
      </div>

      <div
        role="img"
        aria-label={`Photo of ${experience.activityName} coming soon`}
        className="flex w-28 shrink-0 items-center justify-center bg-purple-100 text-purple-500 sm:w-40 dark:bg-purple-500/10"
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

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
