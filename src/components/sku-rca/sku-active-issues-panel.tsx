"use client";

import { getIssueIconForLabel } from "@/components/alerts/issue-icons";
import type { SkuActiveIssue } from "@/lib/sku-weekly-issues";

type SkuActiveIssuesPanelProps = {
  issues: SkuActiveIssue[];
};

/** Detail cards for issues that were active during the selected week. */
export function SkuActiveIssuesPanel({ issues }: SkuActiveIssuesPanelProps) {
  if (issues.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-background p-4 shadow-xs">
        <p className="text-2xs font-semibold tracking-widest text-muted-foreground uppercase">
          Active issues
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          No active issues in this period — all checks were clean.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background shadow-xs">
      <header className="border-b border-border bg-neutral-50/60 px-4 py-2.5">
        <p className="text-2xs font-semibold tracking-widest text-muted-foreground uppercase">
          Active issues · What&apos;s broken, since when, recommendation
        </p>
      </header>

      <ul className="divide-y divide-border">
        {issues.map((issue) => {
          const Icon = getIssueIconForLabel(issue.name);
          return (
            <li
              key={issue.issueKey}
              className="grid gap-4 px-4 py-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.55fr)_minmax(0,1.35fr)] md:items-start"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-error-50 text-error-600">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {issue.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {issue.statusLabel}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Since
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {issue.sinceLabel}
                </p>
              </div>

              <div>
                <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Recommendation
                </p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                  {issue.recommendation}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
