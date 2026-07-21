import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import {
  formatGapDollars,
  type AlertItem,
} from "@/lib/mock-home-data";

type AlertsPanelProps = {
  alerts: AlertItem[];
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-border bg-neutral-50">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
        <p className="text-xs text-muted-foreground">
          Sorted by dollar Gap · act early
        </p>
      </div>

      <ul className="flex-1 space-y-2 overflow-y-auto p-3">
        {alerts.map((alert) => {
          const chip = ISSUE_NAMES[alert.issueKey].chip;

          return (
            <li
              key={alert.id}
              className="rounded-lg border border-border bg-background p-3 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-sm bg-brand-100 px-1.5 py-0.5 text-2xs font-medium text-brand-800">
                  {chip}
                </span>
                <span className="font-mono text-xs font-semibold text-error-600">
                  {formatGapDollars(alert.gapDollars)}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {alert.title}
              </p>
              <p className="mt-1 font-mono text-2xs text-muted-foreground">
                SKU {alert.sku}
              </p>
              <p className="mt-2 text-xs text-neutral-600">
                {alert.recommendation}
              </p>
              <p className="mt-2 text-2xs text-muted-foreground">
                {alert.category} · {alert.detectedAt}
              </p>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
