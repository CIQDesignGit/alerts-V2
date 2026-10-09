import {
  IssueDetailTableHeader,
  issueDetailTable,
} from "@/components/issue-sku-detail/issue-detail-table";
import type {
  KeywordRankLostKeyword,
  KeywordRankPlacement,
} from "@/lib/mock-issue-sku-detail";
import { cn } from "@/lib/utils";

type KeywordRankLostKeywordsProps = {
  title: string;
  meta: string;
  keywords: KeywordRankLostKeyword[];
};

/** Keyword · channel · your rank · competitor · competitor rank */
const COLS =
  "sm:grid-cols-[minmax(9rem,11rem)_4.75rem_7.5rem_minmax(0,1fr)_auto]";

/** Lost keywords: your rank beside the competitor SKU that gained the most. */
export function KeywordRankLostKeywords({
  title,
  meta,
  keywords,
}: KeywordRankLostKeywordsProps) {
  return (
    <div className={issueDetailTable.frame}>
      <IssueDetailTableHeader title={title} meta={meta} />
      <div
        className={cn(
          "hidden border-b border-border px-4 py-2 text-2xs font-medium tracking-wider text-muted-foreground uppercase sm:grid sm:gap-x-4",
          COLS,
        )}
      >
        <span>Keyword</span>
        <span />
        <span>Your rank</span>
        <span>Competitor</span>
        <span className="text-right">Competitor rank</span>
      </div>
      <ul>
        {keywords.map((keyword) => (
          <li
            key={keyword.id}
            className={cn(
              "grid items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 last:border-b-0",
              COLS,
            )}
          >
            <p className="sm:row-span-2 sm:self-center">
              <span className="inline-flex rounded-md bg-brand-50 px-2 py-0.5 text-sm font-semibold text-brand-800">
                &ldquo;{keyword.keyword}&rdquo;
              </span>
            </p>
            {keyword.placements.map((placement) => (
              <PlacementRow key={placement.channel} placement={placement} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlacementRow({ placement }: { placement: KeywordRankPlacement }) {
  const missing = placement.from == null;
  const hasCompetitor =
    placement.competitorName != null &&
    placement.competitorFrom != null &&
    placement.competitorTo != null;

  return (
    <div className="grid grid-cols-1 items-center gap-x-4 gap-y-1 sm:col-span-4 sm:grid-cols-subgrid">
      <span className="w-fit rounded-md bg-neutral-100 px-1.5 py-0.5 text-2xs font-semibold tracking-wide text-neutral-600 uppercase">
        {placement.channel}
      </span>

      {missing ? (
        <p className="text-sm text-muted-foreground sm:col-span-3">
          {placement.emptyLabel}
        </p>
      ) : (
        <>
          <RankMove from={placement.from!} to={placement.to!} tone="drop" />
          {hasCompetitor ? (
            <>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {placement.competitorName}
                </p>
                {placement.competitorAsin ? (
                  <p className="font-mono text-2xs text-muted-foreground">
                    {placement.competitorAsin}
                  </p>
                ) : null}
              </div>
              <RankMove
                from={placement.competitorFrom!}
                to={placement.competitorTo!}
                tone="gain"
                align="end"
              />
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

function RankMove({
  from,
  to,
  tone,
  align = "start",
}: {
  from: number;
  to: number;
  tone: "drop" | "gain";
  align?: "start" | "end";
}) {
  return (
    <p
      className={cn(
        "text-sm tabular-nums whitespace-nowrap",
        align === "end" && "sm:text-right",
      )}
    >
      <span className="text-neutral-500">#{from}</span>
      <span className="mx-1 text-neutral-400">→</span>
      <span
        className={cn(
          "font-semibold",
          tone === "drop" ? "text-error-600" : "text-success-700",
        )}
      >
        #{to}
      </span>
    </p>
  );
}
