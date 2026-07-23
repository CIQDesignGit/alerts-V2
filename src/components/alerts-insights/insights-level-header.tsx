"use client";

import { ChevronRight } from "lucide-react";

import { InsightsModeToggle } from "@/components/alerts-insights/insights-mode-toggle";
import type { InsightsMode } from "@/lib/insights-widgets";
import { cn, controlFocusClass } from "@/lib/utils";

export type InsightsBreadcrumb = {
  id: string;
  name: string;
};

type InsightsLevelHeaderProps = {
  name: string;
  /** Root → current path for hierarchy context */
  breadcrumbs: InsightsBreadcrumb[];
  onBreadcrumbClick: (id: string) => void;
  mode: InsightsMode;
  onModeChange: (mode: InsightsMode) => void;
};

/**
 * Shared Insights header — breadcrumb + level name + Snapshot/Trends toggle.
 * Mode-specific metrics and date range live in the scroll body.
 */
export function InsightsLevelHeader({
  name,
  breadcrumbs,
  onBreadcrumbClick,
  mode,
  onModeChange,
}: InsightsLevelHeaderProps) {
  return (
    <header className="relative shrink-0 border-b border-border bg-background">
      <div className="px-6 py-3">
        {/* Hierarchy path — e.g. Entire Business > Shark > Hair Care */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Hierarchy path"
            className="mb-1 flex min-w-0 flex-wrap items-center gap-1 text-xs text-neutral-500"
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={crumb.id} className="flex min-w-0 items-center gap-1">
                  {index > 0 && (
                    <ChevronRight
                      className="size-3 shrink-0 text-neutral-300"
                      aria-hidden
                    />
                  )}
                  {isLast ? (
                    <span
                      className="truncate font-medium text-neutral-700"
                      aria-current="page"
                    >
                      {crumb.name}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBreadcrumbClick(crumb.id)}
                      className={cn(
                        "truncate rounded-sm hover:text-foreground",
                        controlFocusClass,
                      )}
                    >
                      {crumb.name}
                    </button>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        <div className="flex w-full min-w-0 items-center justify-between gap-4">
          <h2 className="min-w-0 flex-1 truncate text-lg font-bold leading-snug text-foreground">
            {name}
          </h2>
          <InsightsModeToggle mode={mode} onChange={onModeChange} />
        </div>
      </div>
    </header>
  );
}
