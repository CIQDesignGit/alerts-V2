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

type NumberedInsightItem = {
  id: string;
  content: ReactNode;
};

type NumberedInsightListProps = {
  items: NumberedInsightItem[];
  label: string;
  className?: string;
  /** brand = purple wash; muted = grey wash (under Live / Last week headers) */
  tone?: "brand" | "muted";
};

/** Numbered 1·2·3 insight bullets — shared by Key insights + taxonomy summaries */
export function NumberedInsightList({
  items,
  label,
  className,
  tone,
}: NumberedInsightListProps) {
  const list = (
    <ol
      className={cn("m-0 flex list-none flex-col gap-3 px-4 py-3", className)}
      aria-label={label}
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex gap-3">
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              tone === "muted"
                ? "bg-neutral-200 text-neutral-700"
                : "bg-brand-100 text-brand-700",
            )}
            aria-hidden
          >
            {index + 1}
          </span>
          <p className="min-w-0 flex-1 text-sm leading-relaxed text-neutral-800">
            {item.content}
          </p>
        </li>
      ))}
    </ol>
  );

  if (!tone) return list;

  return (
    <AllyAiSurface
      tone={tone}
      className={cn(
        "rounded-none border-x-0 border-t-0 shadow-none",
        tone === "muted"
          ? "border-b border-neutral-200/70"
          : "border-b border-brand-200/50",
      )}
      contentClassName="p-0"
    >
      {list}
    </AllyAiSurface>
  );
}

/** Footnote under precomputed Ally insight cards — filters don’t refresh the copy. */
export function PrecomputedInsightFootnote() {
  return (
    <p className="pl-0.5 text-2xs leading-snug text-muted-foreground">
      Precomputed for this alert, doesn’t update with filters.
    </p>
  );
}

type AllyInsightContentProps = {
  bullets: AllyInsightBullet[];
  /** Card heading — e.g. Key insights for Lost Buy Box */
  title?: string;
  className?: string;
};

/**
 * Issue-level Key insights — Live header chrome + numbered bullets
 * (same shell as taxonomy Live right now cards).
 */
export function AllyInsightContent({
  bullets,
  title = "Ally Insight",
  className,
}: AllyInsightContentProps) {
  if (bullets.length === 0) return null;

  return (
    <div className={cn("flex shrink-0 flex-col gap-1.5", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="border-b border-neutral-100 px-4 py-2.5">
          <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">
            {title}
          </h3>
        </header>

        <NumberedInsightList
          label={title}
          tone="brand"
          items={bullets.map((bullet) => ({
            id: bullet.id,
            content: bullet.segments.map((segment, segmentIndex) => (
              <InsightSegmentText
                key={`${bullet.id}-${segmentIndex}`}
                segment={segment}
              />
            )),
          }))}
        />
      </div>

      <PrecomputedInsightFootnote />
    </div>
  );
}
