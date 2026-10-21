import { Triangle } from "lucide-react";

import {
  IssueDetailTableHeader,
  issueDetailTable,
} from "@/components/issue-sku-detail/issue-detail-table";
import type { ShippingMarketPoint } from "@/lib/mock-issue-sku-detail";
import { cn } from "@/lib/utils";

type ShippingSpeedMarketGridProps = {
  markets: ShippingMarketPoint[];
  normLabel: string;
  crawlsPerDay: number;
};

/** First / last columns use px-5 so text lines up with the card title */
const th = "whitespace-nowrap px-3 py-2 font-medium first:pl-5 last:pr-5";
const td = "whitespace-nowrap px-3 py-2.5 first:pl-5 last:pr-5";

/** Latest status per crawled market — one row per market, affected rows washed red. */
export function ShippingSpeedMarketGrid({
  markets,
  normLabel,
  crawlsPerDay,
}: ShippingSpeedMarketGridProps) {
  return (
    <div className={issueDetailTable.frame}>
      <IssueDetailTableHeader
        title={`Crawled markets (${markets.length})`}
        meta={`Norm = ${normLabel} · ${crawlsPerDay} crawls (24h)`}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-xl border-collapse text-xs">
          <thead className="bg-neutral-50 text-2xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className={cn(th, "text-left")}>Market</th>
              <th className={cn(th, "text-right")}>Standard (days)</th>
              <th className={cn(th, "text-right")}>Prime (days)</th>
              <th className={cn(th, "text-right")}>Breaching crawls</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market) => (
              <MarketRow
                key={market.id}
                market={market}
                crawlsPerDay={crawlsPerDay}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MarketRow({
  market,
  crawlsPerDay,
}: {
  market: ShippingMarketPoint;
  crawlsPerDay: number;
}) {
  const affected = market.breachingCrawls > 0;
  const hasPrime = market.primeFrom != null && market.primeTo != null;

  return (
    <tr className={cn("border-t border-border", affected && "bg-error-25")}>
      <td className={cn(td, "text-left")}>
        <span className="inline-flex items-center gap-2">
          <span className="font-semibold text-foreground">{market.city}</span>
          {affected ? (
            <span className="shrink-0 rounded-md bg-error-100 px-1.5 py-0.5 text-2xs font-semibold tracking-wider text-error-700 uppercase">
              Affected
            </span>
          ) : null}
        </span>
      </td>
      <td className={cn(td, "text-right")}>
        <PromiseCell
          from={market.standardFrom}
          to={market.standardTo}
          delta={market.standardDelta}
        />
      </td>
      <td className={cn(td, "text-right")}>
        {hasPrime ? (
          <PromiseCell
            from={market.primeFrom!}
            to={market.primeTo!}
            delta={market.primeDelta}
          />
        ) : (
          <span className="text-muted-foreground">NA</span>
        )}
      </td>
      <td
        className={cn(
          td,
          "text-right tabular-nums",
          affected ? "font-semibold text-error-700" : "text-neutral-400",
        )}
      >
        {market.breachingCrawls} of {crawlsPerDay}
      </td>
    </tr>
  );
}

/** No change: single value. Worse: norm → latest + delta badge. */
function PromiseCell({
  from,
  to,
  delta,
}: {
  from: number;
  to: number;
  delta: number;
}) {
  if (delta <= 0) {
    return (
      <span className="font-medium tabular-nums text-foreground">{to}</span>
    );
  }

  return (
    <span className="inline-flex items-center justify-end gap-2 tabular-nums">
      <span className="text-neutral-500">
        {from}
        <span className="mx-1 text-neutral-300">→</span>
        <span className="font-semibold text-foreground">{to}</span>
      </span>
      <span className="inline-flex items-center justify-center gap-0.5 rounded-md bg-error-100 px-1.5 py-0.5 font-semibold text-error-700">
        <Triangle className="size-2 fill-current" aria-hidden />+{delta}
      </span>
    </span>
  );
}
