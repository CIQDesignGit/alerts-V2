"use client";

import { CalendarDays, Check, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  getScrapeHistoryData,
  type ScrapeHistoryData,
  type ScrapeZipcodeDayRow,
} from "@/lib/mock-scrape-history";
import { cn } from "@/lib/utils";

type ScrapeHistoryButtonProps = {
  asin: string;
  skuName: string;
  compact?: boolean;
};

/** Opens the 7-day scrape history modal — issue-aggregation SKU header only. */
export function ScrapeHistoryButton({
  asin,
  skuName,
  compact,
}: ScrapeHistoryButtonProps) {
  const [open, setOpen] = useState(false);
  const data = getScrapeHistoryData(asin, skuName);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        aria-label="7-day scrape history"
        className={cn(
          "h-7 gap-1.5 rounded-lg border-neutral-200 bg-background px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50",
          compact && "size-7 shrink-0 gap-0 px-0",
        )}
      >
        <CalendarDays className="size-3.5 text-neutral-500" />
        {!compact && "7-day scrape history"}
      </Button>

      {open && (
        <ScrapeHistoryModal data={data} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function ScrapeHistoryModal({
  data,
  onClose,
}: {
  data: ScrapeHistoryData;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const appShell = document.querySelector<HTMLElement>("[data-app-shell]");
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    if (appShell) appShell.inert = true;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (appShell) appShell.inert = false;
    };
  }, [handleKeyDown]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4 sm:p-8">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-neutral-900/40"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scrape-history-title"
        className="relative z-10 flex max-h-[min(90dvh,calc(100dvh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0">
            <h2
              id="scrape-history-title"
              className="text-lg font-bold text-foreground"
            >
              7-day scrape history · {data.skuName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Whether each issue was detected on that day (4 scrapes per day),
              plus the ZIP markets crawled over the last 7 days.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
          <ScrapeHistoryTable data={data} />
          <ZipcodesTable rows={data.zipcodeDays} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ScrapeHistoryTable({ data }: { data: ScrapeHistoryData }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-neutral-50/80 px-3 py-2">
        <p className="text-[11px] font-semibold tracking-wide text-neutral-600 uppercase">
          7-day scrape history ·{" "}
          <span className="font-mono normal-case">{data.asin}</span>
        </p>
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
          <span>
            {data.scrapesPerDay} scrapes per day ·{" "}
            {data.scrapesPerDay * data.days.length} total per week
          </span>
          <span className="inline-flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1">
              <DetectedDot size="sm" />
              Detected
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="size-3 text-success-600" aria-hidden />
              Clear
            </span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-neutral-50/50">
              <th className="sticky left-0 z-10 bg-neutral-50/95 px-4 py-2 text-left text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
                Issue type
              </th>
              {data.days.map((day) => (
                <th
                  key={day.label}
                  className="min-w-14 px-1.5 py-2 text-center"
                >
                  <span className="block text-[10px] font-semibold leading-tight text-neutral-700">
                    {day.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.issues.map((row) => (
              <tr
                key={row.issueLabel}
                className="border-b border-border last:border-b-0"
              >
                <td className="sticky left-0 z-10 bg-background px-4 py-2 text-xs font-medium leading-tight text-foreground">
                  {row.issueLabel}
                </td>
                {row.detectedOnDay.map((detected, i) => (
                  <td key={i} className="px-1.5 py-2 text-center">
                    <ScrapeCell detected={detected} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DetectedDot({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-error-100",
        size === "sm" ? "size-4" : "size-5",
      )}
      aria-hidden
    >
      <span
        className={cn(
          "rounded-full bg-error-600",
          size === "sm" ? "size-1.5" : "size-2",
        )}
      />
    </span>
  );
}

function ScrapeCell({ detected }: { detected: boolean }) {
  if (detected) {
    return (
      <span
        className="inline-flex items-center justify-center"
        aria-label="Issue detected"
        title="Issue detected"
      >
        <DetectedDot />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center"
      aria-label="No issue detected"
      title="No issue detected"
    >
      <Check className="size-3.5 text-success-600" aria-hidden />
    </span>
  );
}

function ZipcodesTable({ rows }: { rows: ScrapeZipcodeDayRow[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="border-b border-border bg-neutral-50/80 px-3 py-2">
        <p className="text-[11px] font-semibold tracking-wide text-neutral-600 uppercase">
          7-day zipcodes used{" "}
          <span className="font-normal normal-case text-muted-foreground">
            (randomized per scrape window · placeholder)
          </span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-neutral-50/50">
              <th className="px-4 py-2 text-left text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
                Day
              </th>
              <th className="px-4 py-2 text-left text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
                Scrapes
              </th>
              <th className="px-4 py-2 text-left text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
                Zipcodes used (by city)
              </th>
              <th className="px-4 py-2 text-left text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
                Raw zips
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.dayLabel}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-2 text-xs font-semibold leading-tight text-foreground">
                  {row.dayLabel}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-neutral-600">
                  {row.scrapeCount} scrapes
                </td>
                <td className="px-4 py-2 text-xs leading-snug text-neutral-700">
                  {row.cities.map((city, index) => (
                    <span key={city.city}>
                      {index > 0 && ", "}
                      {city.city}{" "}
                      <span className="text-neutral-400">×{city.count}</span>
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-neutral-600">
                  {row.rawZips.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
