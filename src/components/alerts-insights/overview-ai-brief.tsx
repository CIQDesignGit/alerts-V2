import { Sparkles } from "lucide-react";

import { aiBrief } from "@/lib/mock-alerts-insights";

/** AllyAI narrative — short brief of what is driving the gap. */
export function OverviewAiBrief() {
  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Sparkles className="size-3.5" aria-hidden />
        </span>
        <div>
          <p className="text-2xs font-semibold tracking-wider text-primary uppercase">
            AllyAI Brief
          </p>
          <p className="text-xs text-muted-foreground">What is driving this week’s gap</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-700">{aiBrief}</p>
    </section>
  );
}
