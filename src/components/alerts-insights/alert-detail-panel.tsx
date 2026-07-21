"use client";

import { Zap } from "lucide-react";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import {
  formatAtRisk,
  formatGapDollars,
  issueLabel,
  type IssueAlert,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type AlertDetailPanelProps = {
  issue: IssueAlert;
  selectedSkuId: string | null;
  onSelectSku: (skuId: string) => void;
};

export function AlertDetailPanel({
  issue,
  selectedSkuId,
  onSelectSku,
}: AlertDetailPanelProps) {
  const remaining = Math.max(issue.skuCount - issue.skus.length, 0);
  const remainingGap = Math.max(
    issue.atRiskDollars -
      issue.skus.reduce((sum, s) => sum + Math.abs(s.gapDollars), 0),
    0,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {issueLabel(issue.issueKey)}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {issue.skuCount} SKUs · {formatAtRisk(issue.atRiskDollars)} · by $ gap
          ↓
        </p>
      </div>

      {issue.aiSignal && (
        <section className="rounded-lg border border-warning-200 bg-warning-50 p-4">
          <p className="flex items-center gap-1.5 text-2xs font-semibold tracking-wider text-warning-700 uppercase">
            <Zap className="size-3.5 fill-warning-500 text-warning-500" />
            AI Signal — Systemic Pattern
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-800">
            {issue.aiSignal}
          </p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Show reasoning →
          </button>
        </section>
      )}

      {issue.skus.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-2xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">$ Gap</th>
                <th className="px-3 py-2 font-medium">BB Owner</th>
                <th className="px-3 py-2 font-medium">Their $</th>
                <th className="px-3 py-2 font-medium">Our $</th>
                <th className="px-3 py-2 font-medium">Lost At</th>
              </tr>
            </thead>
            <tbody>
              {issue.skus.map((sku) => (
                <SkuRow
                  key={sku.id}
                  sku={sku}
                  selected={selectedSkuId === sku.id}
                  onSelect={() => onSelectSku(sku.id)}
                />
              ))}
            </tbody>
          </table>
          {remaining > 0 && (
            <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              + {remaining} more SKUs · {formatAtRisk(remainingGap)} combined
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No SKU rows loaded for this alert yet. Expand the issue in the left
          panel when SKUs are available.
        </p>
      )}
    </div>
  );
}

function SkuRow({
  sku,
  selected,
  onSelect,
}: {
  sku: IssueSku;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <tr
      onClick={onSelect}
      className={cn(
        "cursor-pointer border-t border-border",
        selected ? "bg-brand-100/70" : "hover:bg-neutral-50",
      )}
    >
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <SkuThumbnail name={sku.name} size={36} />
          <span className="font-medium text-foreground">{sku.name}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 font-mono font-semibold text-error-600">
        {formatGapDollars(sku.gapDollars)}
      </td>
      <td className="px-3 py-2.5 text-neutral-700">{sku.bbOwner ?? "—"}</td>
      <td className="px-3 py-2.5 font-mono text-warning-700">
        {sku.theirPrice != null ? `$${sku.theirPrice}` : "—"}
      </td>
      <td className="px-3 py-2.5 font-mono text-neutral-700">
        {sku.ourPrice != null ? `$${sku.ourPrice}` : "—"}
      </td>
      <td className="px-3 py-2.5 text-muted-foreground">
        {sku.lostAt ?? "—"}
      </td>
    </tr>
  );
}
