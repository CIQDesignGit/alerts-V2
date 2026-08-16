import type { AlertMetricTilesData } from "@/lib/mock-alerts-insights";

/**
 * Split "Shark 100%" into name + percent for display only.
 * Does not change source data — only how the string is laid out.
 */
function splitValueNameAndPct(value: string): {
  name: string;
  pct: string | null;
} {
  const match = value.match(/^(.*)\s(\d+%)$/);
  if (!match) return { name: value, pct: null };
  return { name: match[1], pct: match[2] };
}

/**
 * Pull category name + (N%) from the subtitle for a matching layout.
 * Display only — source strings stay unchanged.
 */
function splitSubtitleNameAndPct(
  subtitle: string,
  emphasis?: string,
): { name: string; pct: string | null } {
  const pctMatch = subtitle.match(/\((\d+%)\)/);
  const pct = pctMatch?.[1] ?? null;
  const name = emphasis?.trim() || subtitle.replace(/\s*\(\d+%\)\s*$/, "").trim();
  return { name, pct };
}

/** Brand + category as parallel name / number columns (same data). */
export function AlertMetricTiles({ metrics }: { metrics: AlertMetricTilesData }) {
  const { concentration } = metrics;
  const brand = splitValueNameAndPct(concentration.value);
  const category = concentration.subtitle
    ? splitSubtitleNameAndPct(
        concentration.subtitle,
        concentration.subtitleEmphasis,
      )
    : null;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <header className="border-b border-neutral-100 px-4 py-2.5">
        <h3 className="text-sm font-semibold text-foreground">
          {concentration.title}
        </h3>
      </header>

      <div className="grid px-4 py-3 sm:grid-cols-2 sm:divide-x sm:divide-border">
        <ConcentrationColumn
          roleLabel="Brand"
          name={brand.name}
          pct={brand.pct}
          className="sm:pr-6"
        />

        {category ? (
          <ConcentrationColumn
            roleLabel="Category"
            name={category.name}
            pct={category.pct}
            className="mt-3 sm:mt-0 sm:pl-6"
          />
        ) : null}
      </div>
    </article>
  );
}

/** Shared column — quiet label, then name + % on one row */
function ConcentrationColumn({
  roleLabel,
  name,
  pct,
  className,
}: {
  roleLabel: string;
  name: string;
  pct: string | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
        {roleLabel}
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="min-w-0 truncate text-sm font-semibold leading-snug text-foreground">
          {name}
        </p>
        <p className="shrink-0 font-mono text-xl font-bold tabular-nums tracking-tight text-foreground">
          {pct ?? "—"}
        </p>
      </div>
    </div>
  );
}
