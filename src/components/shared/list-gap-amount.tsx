import { formatGapDollars } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type ListGapAmountProps = {
  gapDollars: number;
  className?: string;
};

/**
 * Stacked Gap label + signed $ for list rows (issue cards, SKUs, taxonomy).
 * Dollar amount uses dark slate so the list stays scannable without traffic-light color.
 */
export function ListGapAmount({ gapDollars, className }: ListGapAmountProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 flex-col items-end self-center tabular-nums",
        className,
      )}
    >
      <span className="text-2xs font-medium text-neutral-400">Gap</span>
      <span className="font-mono text-xs font-semibold text-neutral-800">
        {formatGapDollars(gapDollars)}
      </span>
    </span>
  );
}
