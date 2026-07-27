import type { ReactNode } from "react";

import { Sparkles } from "lucide-react";

import type {
  AllyInsightBullet,
  AllyInsightSegment,
  AllyAiPrompt,
} from "@/lib/mock-alerts-insights";
import { formatAtRisk, formatGapDollars } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

import { SuggestedAiPrompts } from "@/components/alerts-insights/suggested-ai-prompts";

type AllyAiSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Shared AllyAI card chrome — soft brand gradient shell.
 * Pair with AllyAiHeader for the avatar + label row.
 */
export function AllyAiSurface({
  children,
  className,
  contentClassName,
}: AllyAiSurfaceProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border border-brand-200/60 bg-linear-to-r from-background via-brand-50 to-brand-100 shadow-xs",
        className,
      )}
    >
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}

type AllyAiHeaderProps = {
  /** Title next to the Ally avatar */
  label: string;
  /** Optional line under the title (e.g. date range) */
  subtitle?: string;
};

/** Ally avatar + title (optional subtitle on the right) — use inside AllyAiSurface. */
export function AllyAiHeader({ label, subtitle }: AllyAiHeaderProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <span className="flex size-7 shrink-0 overflow-hidden rounded-lg bg-white">
        <img
          src="/ally-avatar.png"
          alt=""
          className="size-full object-cover"
        />
      </span>
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
  prompts?: AllyAiPrompt[];
  onPromptSelect?: (prompt: AllyAiPrompt) => void;
  className?: string;
};

/** Bulleted Ally Insight block — sparkles label + purple dots (alert aggregate). */
export function AllyInsightContent({
  bullets,
  prompts,
  onPromptSelect,
  className,
}: AllyInsightContentProps) {
  if (bullets.length === 0) return null;

  return (
    <AllyAiSurface className={cn("shrink-0", className)} contentClassName="p-4 md:p-5">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-4 text-brand-600" aria-hidden />
        <p className="text-2xs font-semibold tracking-widest text-brand-600 uppercase">
          Ally Insight
        </p>
      </div>

      <ul className="mt-3 flex flex-col gap-2.5">
        {bullets.map((bullet) => (
          <li
            key={bullet.id}
            className="flex gap-2.5 text-sm leading-relaxed text-neutral-800"
          >
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500"
              aria-hidden
            />
            <span>
              {bullet.segments.map((segment, index) => (
                <InsightSegmentText key={`${bullet.id}-${index}`} segment={segment} />
              ))}
            </span>
          </li>
        ))}
      </ul>

      {prompts && prompts.length > 0 && (
        <div className="mt-4 border-t border-brand-200/50 pt-4">
          <SuggestedAiPrompts prompts={prompts} onSelect={onPromptSelect} />
        </div>
      )}
    </AllyAiSurface>
  );
}
