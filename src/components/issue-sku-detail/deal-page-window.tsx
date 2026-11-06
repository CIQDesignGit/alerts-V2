"use client";

import { issueDetailTable } from "@/components/issue-sku-detail/issue-detail-table";
import type { DealPageSkuDetail } from "@/lib/mock-issue-sku-detail";
import { cn } from "@/lib/utils";

type DealPageWindowProps = {
  detail: DealPageSkuDetail;
};

function augustDate(day: number) {
  return `${day} Aug`;
}

/** Deal name and the three dates in one card — including never-observed edge case. */
export function DealPageWindow({ detail }: DealPageWindowProps) {
  const neverObserved = detail.neverObserved;
  const startLabel = augustDate(detail.startDay);
  const endLabel = augustDate(detail.endDay);
  const ariaLabel = neverObserved
    ? `Deal started ${startLabel}. Not seen on deals page during this window. Deal ends ${endLabel}.`
    : `Deal started ${startLabel}. Last seen on the deals page ${augustDate(detail.lastSeenDay!)} at ${detail.lastSeenTime}. Deal ends ${endLabel}.`;

  return (
    <div className={issueDetailTable.frame}>
      <header className={issueDetailTable.header}>
        <div className="flex min-w-0 items-center gap-2">
          <h3 className={issueDetailTable.headerTitle}>Deal</h3>
          <span
            title="Deal name"
            className="inline-flex items-center rounded-md bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700"
          >
            {detail.dealType}
          </span>
        </div>
      </header>

      <div className="px-5 py-3" role="group" aria-label={ariaLabel}>
        <div className="grid grid-cols-3">
          <Point
            label="Deal started"
            date={startLabel}
            align="start"
          />
          {neverObserved ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-error-700">
                Not Seen on Deals Page
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                during this window
              </p>
            </div>
          ) : (
            <Point
              label="Last seen on deals page"
              date={augustDate(detail.lastSeenDay!)}
              detail={`${detail.lastSeenTime} · ${detail.lastSeenRelative}`}
              align="center"
              emphasis
            />
          )}
          <Point
            label="Deal ends"
            date={endLabel}
            align="end"
          />

          <div className="col-span-3 mt-2 grid grid-cols-3" aria-hidden>
            {neverObserved ? (
              <>
                <TrackSegment edge="start" tone="missing" />
                <TrackSegment edge="middle" tone="line" />
                <TrackSegment edge="end" tone="missing" />
              </>
            ) : (
              <>
                <TrackSegment edge="start" tone="seen" />
                <TrackSegment edge="middle" tone="break" />
                <TrackSegment edge="end" tone="missing" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Point({
  label,
  date,
  detail,
  align,
  emphasis = false,
  tone = "neutral",
}: {
  label: string;
  date: string;
  detail?: string;
  align: "start" | "center" | "end";
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        align === "end" && "text-right",
      )}
    >
      <p
        className={cn(
          "text-xs",
          emphasis ? "font-medium text-error-700" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 tabular-nums",
          emphasis
            ? "text-xl font-bold text-foreground"
            : "text-base font-semibold text-foreground",
        )}
      >
        {date}
      </p>
      <p className={cn("mt-0.5 h-4 text-xs", emphasis && "text-foreground")}>
        {emphasis ? detail : null}
      </p>
    </div>
  );
}

function TrackSegment({
  edge,
  tone,
}: {
  edge: "start" | "middle" | "end";
  tone: "seen" | "break" | "missing" | "line";
}) {
  const connectorMissing =
    tone === "missing" || tone === "break" || tone === "line";

  return (
    <div className="flex h-3 items-center">
      {edge !== "start" && (
        <span
          className={cn(
            "h-1 flex-1",
            connectorMissing || edge === "end"
              ? "bg-error-500/35"
              : "bg-neutral-300",
          )}
        />
      )}
      {tone !== "line" ? (
        <span
          className={cn(
            "shrink-0 rounded-full",
            tone === "break"
              ? "size-3 bg-error-600"
              : tone === "missing"
                ? "size-2.5 border-2 border-error-600 bg-background"
                : "size-2.5 bg-neutral-500",
          )}
        />
      ) : null}
      {edge !== "end" && (
        <span
          className={cn(
            "h-1 flex-1",
            edge === "start" && tone === "seen"
              ? "bg-neutral-300"
              : "bg-error-500/35",
          )}
        />
      )}
    </div>
  );
}
