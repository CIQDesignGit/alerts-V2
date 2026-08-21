import { cn } from "@/lib/utils";
import { LAST_WEEK_RANGE_LABEL } from "@/lib/mock-calendar";

export { LAST_WEEK_RANGE_LABEL };

type PeriodBadgeTone = "live" | "wtd" | "historical";

type PeriodBadgeProps = {
  children: React.ReactNode;
  tone: PeriodBadgeTone;
  className?: string;
};

/**
 * Period chip shell used on Live / This week / Last week headers.
 * Colors vary by tone; padding, weight, and ring stay identical.
 */
export function PeriodBadge({ children, tone, className }: PeriodBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-2xs font-semibold tracking-wide uppercase ring-1",
        tone === "live" && "bg-error-50 text-error-700 ring-error-100",
        tone === "wtd" && "bg-cyan-500/10 text-cyan-700 ring-cyan-500/15",
        tone === "historical" &&
          "bg-neutral-100 text-neutral-600 ring-neutral-200/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
