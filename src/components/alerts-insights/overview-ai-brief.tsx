import {
  AllyAiHeader,
  AllyAiSurface,
} from "@/components/alerts-insights/ally-ai-surface";
import { aiBrief } from "@/lib/mock-alerts-insights";

/**
 * AllyAI narrative — left: avatar + label + portfolio title;
 * right: Brand / Category / Issue points.
 */
export function OverviewAiBrief() {
  return (
    <AllyAiSurface contentClassName="grid gap-5 p-5 md:grid-cols-2 md:gap-8 md:p-6">
      {/* Left — Ally label + portfolio one-liner */}
      <div className="flex flex-col justify-center gap-3">
        <AllyAiHeader label="AllyAI Brief" />
        <p className="text-base font-semibold leading-snug text-neutral-900 md:text-lg">
          {aiBrief.title}
        </p>
      </div>

      {/* Right — supporting points */}
      <div className="flex flex-col justify-center border-t border-brand-200/50 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-8">
        <ul className="space-y-2">
          {aiBrief.points.map((point) => (
            <li
              key={point.level}
              className="flex gap-2 text-sm leading-snug text-neutral-700"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                aria-hidden
              />
              <span>{point.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </AllyAiSurface>
  );
}
