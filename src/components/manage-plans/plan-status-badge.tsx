import { cn } from "@/lib/utils";
import type { PlanStatus } from "@/lib/mock-sales-plans";

const STATUS_CONFIG: Record<
  PlanStatus,
  { label: string; className: string } | null
> = {
  live: {
    label: "Live",
    className: "bg-success-100 text-success-700",
  },
  failed: {
    label: "Failed",
    className: "bg-error-100 text-error-700",
  },
  archived: null,
};

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg px-2 py-0.5 text-2xs font-semibold",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
