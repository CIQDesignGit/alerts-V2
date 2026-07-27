import { ExternalLink, History } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { formatCompactDollars } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

/** Amazon “a” + smile mark — PNG asset in /public */
function AmazonMark({ className }: { className?: string }) {
  return (
    // Brand mark from product assets (scaled for the PDP chip)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/amazon-icon.png"
      alt=""
      width={14}
      height={14}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
    />
  );
}

export function PdpPageLink({
  href,
  compact,
}: {
  href: string;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "h-7 gap-1.5 rounded-lg border-neutral-200 bg-background px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50",
        compact && "px-2",
      )}
    >
      <AmazonMark />
      {!compact && <span>PDP Page</span>}
      <ExternalLink className="size-3.5 text-neutral-500" />
    </a>
  );
}

export function PdpSnapshotsButton({ compact }: { compact?: boolean }) {
  return (
    <Button
      type="button"
      size="sm"
      className={cn(
        "h-7 gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 text-xs font-semibold text-brand-700 shadow-none hover:bg-brand-100",
        compact && "px-2",
      )}
    >
      <History className="size-3.5 text-brand-600" />
      {!compact && "PDP Snapshots"}
    </Button>
  );
}

export function GapBadge({
  dollars,
  units,
}: {
  dollars: number;
  units?: number;
}) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-error-25 px-3 text-xs">
      <span className="font-mono font-semibold text-error-600">
        {formatCompactDollars(dollars)}
      </span>
      {units != null && (
        <>
          <span className="text-neutral-400" aria-hidden>
            ·
          </span>
          <span className="font-medium text-neutral-500">
            {units > 0 ? `+${units}` : units} units
          </span>
        </>
      )}
    </span>
  );
}
