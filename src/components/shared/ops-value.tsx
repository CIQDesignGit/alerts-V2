import { formatOpsDollars } from "@/lib/ops";
import { cn } from "@/lib/utils";

type OpsValueProps = {
  dollars: number;
  /** inline = list rows; badge = SKU header chip next to Gap */
  variant?: "inline" | "badge";
  /** Hide “OPS” on nested tree rows — dollar amount still shows */
  showLabel?: boolean;
  /**
   * Where the unlabeled $ sits on a two-line row.
   * title = next to the name · meta = next to the ASIN / SKU count line
   */
  alignWith?: "title" | "meta";
  className?: string;
};

/**
 * OPS = Ordered Product Sales. Label is for top-level rows only
 * so nested tree items stay quieter.
 */
export function OpsValue({
  dollars,
  variant = "inline",
  showLabel = true,
  alignWith = "title",
  className,
}: OpsValueProps) {
  if (variant === "badge") {
    return (
      <span
        title="Ordered Product Sales"
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-lg bg-neutral-100 px-3 text-xs",
          className,
        )}
      >
        <span className="font-medium text-neutral-500">OPS</span>
        <span className="font-mono font-semibold text-neutral-800">
          {formatOpsDollars(dollars)}
        </span>
      </span>
    );
  }

  const matchMeta = !showLabel && alignWith === "meta";

  return (
    <span
      title="Ordered Product Sales"
      className={cn(
        "inline-flex shrink-0 flex-col items-end leading-tight",
        matchMeta && "self-end",
        className,
      )}
    >
      {showLabel && (
        <span className="text-2xs font-medium tracking-wide text-muted-foreground">
          OPS
        </span>
      )}
      <span
        className={cn(
          "font-mono text-xs font-semibold tabular-nums text-foreground",
          !showLabel && !matchMeta && "leading-5",
          matchMeta && "leading-4",
        )}
      >
        {formatOpsDollars(dollars)}
      </span>
    </span>
  );
}
