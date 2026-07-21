"use client";

import {
  formatGapDollars,
  issueLabel,
  type IssueAlert,
  type IssueSku,
} from "@/lib/mock-alerts-insights";

type SkuDetailPanelProps = {
  issue: IssueAlert;
  sku: IssueSku;
  onBackToAlert: () => void;
};

/**
 * Shared SKU leaf placeholder — full fixed SKU layout is TBD in product_context.
 */
export function SkuDetailPanel({
  issue,
  sku,
  onBackToAlert,
}: SkuDetailPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
      <div>
        <button
          type="button"
          onClick={onBackToAlert}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to {issueLabel(issue.issueKey)}
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          Alerts &gt; {issueLabel(issue.issueKey)} &gt; {sku.name}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">
          {sku.name}
        </h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {sku.asin} · {sku.seller}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="$ Gap" value={formatGapDollars(sku.gapDollars)} emphasis />
        <Stat
          label="BB Owner"
          value={sku.bbOwner ?? "—"}
        />
        <Stat
          label="Price"
          value={
            sku.theirPrice != null && sku.ourPrice != null
              ? `$${sku.theirPrice} vs $${sku.ourPrice}`
              : "—"
          }
        />
      </div>

      <section className="rounded-lg border border-dashed border-border bg-neutral-50 p-4">
        <p className="text-sm font-medium text-foreground">SKU detail layout</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Full shared SKU format is coming next (same leaf whether you arrive
          from Alerts or Insights). This panel confirms selection is synced.
        </p>
        {sku.lostAt && (
          <p className="mt-3 text-xs text-muted-foreground">
            Lost at {sku.lostAt}
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-2xs tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={
          emphasis
            ? "mt-1 font-mono text-lg font-bold text-error-600"
            : "mt-1 text-sm font-semibold text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}
