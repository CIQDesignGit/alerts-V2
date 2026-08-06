import type { ReactNode } from "react";

import type {
  AllyInsightBullet,
  AllyInsightSegment,
} from "@/lib/mock-alerts-insights";
import { formatAtRisk, formatGapDollars } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type AllyAiSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** brand = live/current week (purple). muted = last week / historical (grey). */
  tone?: "brand" | "muted";
};

/**
 * Shared AllyAI card chrome — soft gradient shell.
 * Pair with AllyAiHeader for the title row.
 */
export function AllyAiSurface({
  children,
  className,
  contentClassName,
  tone = "brand",
}: AllyAiSurfaceProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border shadow-xs",
        tone === "muted"
          ? "border-neutral-200/80 bg-linear-to-r from-background via-neutral-50 to-neutral-100"
          : "border-brand-200/60 bg-linear-to-r from-background via-brand-50 to-brand-100",
        className,
      )}
    >
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}

type AllyAiHeaderProps = {
  /** Title next to the Ally label */
  label: string;
  /** Optional line under the title (e.g. date range) */
  subtitle?: string;
};

/** Title row for AllyAI surfaces — text only (no avatar in summaries). */
export function AllyAiHeader({ label, subtitle }: AllyAiHeaderProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800">
        {label}
      </p>
      {subtitle ? (
        <p className="max-w-[55%] shrink-0 text-right text-2xs text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function formatInsightMoney(amount: number, variant: "emphasis" | "inline") {
  if (variant === "emphasis") return formatGapDollars(amount);
  const base = formatAtRisk(amount);
  return amount < 0 ? `−${base}` : base;
}

/** Renders one rich-text segment (shared by Ally Insight + taxonomy RCA narratives). */
export function InsightSegmentText({ segment }: { segment: AllyInsightSegment }) {
  if (segment.kind === "text") {
    return <span>{segment.text}</span>;
  }
  if (segment.kind === "strong") {
    return <strong className="font-semibold text-foreground">{segment.text}</strong>;
  }
  const variant = segment.variant ?? "inline";
  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        variant === "emphasis" ? "text-error-600" : "text-neutral-600",
      )}
    >
      {formatInsightMoney(segment.amount, variant)}
    </span>
  );
}

type AllyInsightContentProps = {
  bullets: AllyInsightBullet[];
  /** Card heading — matches taxonomy RCA insight blocks */
  title?: string;
  className?: string;
};

/** Numbered insight card — prompts render outside via SuggestedAiPrompts. */
export function AllyInsightContent({
  bullets,
  title = "Ally Insight",
  className,
}: AllyInsightContentProps) {
  if (bullets.length === 0) return null;

  return (
    <AllyAiSurface className={cn("shrink-0", className)} contentClassName="p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      <ol
        className="mt-3 flex flex-col gap-3"
        aria-label={title}
      >
        {bullets.map((bullet, index) => (
          <li key={bullet.id} className="flex gap-3">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
              aria-hidden
            >
              {index + 1}
            </span>
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-neutral-800">
              {bullet.segments.map((segment, segmentIndex) => (
                <InsightSegmentText
                  key={`${bullet.id}-${segmentIndex}`}
                  segment={segment}
                />
              ))}
            </p>
          </li>
        ))}
      </ol>
    </AllyAiSurface>
  );
}
