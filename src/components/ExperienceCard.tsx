export type Experience = {
  activityName: string;
  neighbourhood: string;
  /** ISO date, e.g. "2025-04-12" */
  date: string;
  durationHours: number;
  pricePerPerson: number;
  highlight: string;
};

// Ticket-style card: filled purple pass with a tear-off date stub on the left.
export default function ExperienceCard({ experience }: { experience: Experience }) {
  const date = new Date(experience.date + "T00:00:00Z");
  const part = (opts: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

  return (
    <article className="flex rounded-2xl bg-purple-600 text-white shadow-md dark:bg-purple-800">
      <time
        dateTime={experience.date}
        className="flex w-24 shrink-0 flex-col items-center justify-center py-5 sm:w-28"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-200">
          {part({ weekday: "short" })}
        </span>
        <span className="text-4xl font-bold leading-none">{part({ day: "numeric" })}</span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-purple-200">
          {part({ month: "short" })}
        </span>
      </time>

      {/* Perforation, with notches punched out of the top and bottom edges. */}
      <div aria-hidden="true" className="relative border-l-2 border-dashed border-white/40">
        <span className="absolute -left-[13px] -top-3 size-6 rounded-full bg-background" />
        <span className="absolute -bottom-3 -left-[13px] size-6 rounded-full bg-background" />
      </div>

      <div className="flex min-w-0 flex-1 gap-3 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-purple-200">
            {experience.neighbourhood}
          </p>
          <h3 className="text-lg font-bold leading-tight">{experience.activityName}</h3>
          <p className="flex items-center gap-1.5 text-sm text-purple-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {formatDuration(experience.durationHours)}
          </p>
          <p className="text-sm text-purple-100">
            <span aria-hidden="true">✓ </span>
            {experience.highlight}
          </p>
          <p className="mt-auto pt-1 text-sm text-purple-100">
            <span className="text-lg font-semibold text-white">${experience.pricePerPerson}</span> /
            person
          </p>
        </div>

        <div
          role="img"
          aria-label={`Photo of ${experience.activityName} coming soon`}
          className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white/15 text-purple-100"
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
