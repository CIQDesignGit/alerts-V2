"use client";

import { ExternalLink, History, MapPin } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { PDP_SNAPSHOTS } from "@/lib/mock-pdp-snapshots";
import { formatCompactDollars } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

const SNAPSHOT_PANEL_WIDTH = 320;

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
      aria-label="Open PDP on Amazon"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "h-7 gap-1.5 rounded-lg border-neutral-200 bg-background px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50",
        // Minimized header: square Amazon-only control
        compact && "size-7 shrink-0 gap-0 px-0",
      )}
    >
      <AmazonMark className={compact ? "size-3.5" : undefined} />
      {!compact && (
        <>
          <span>PDP Page</span>
          <ExternalLink className="size-3.5 text-neutral-500" />
        </>
      )}
    </a>
  );
}

/** Opens a popover of product-page snapshots saved at each crawl */
export function PdpSnapshotsButton({ compact }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Header clips overflow, so the panel is drawn on the page body instead.
  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    const anchor = rootRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const margin = 8;
    let left = rect.left;
    if (left + SNAPSHOT_PANEL_WIDTH > window.innerWidth - margin) {
      left = Math.max(margin, rect.right - SNAPSHOT_PANEL_WIDTH);
    }
    setCoords({ top: rect.bottom + 6, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onDocMouseDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onScrollOrResize(event: Event) {
      if (event.type === "scroll" && panelRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <Button
        type="button"
        size="sm"
        aria-label="PDP Snapshots"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "h-7 gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 text-xs font-semibold text-brand-700 shadow-none hover:bg-brand-100",
          compact && "size-7 shrink-0 gap-0 px-0",
          open && "bg-brand-100",
        )}
      >
        <History className="size-3.5 text-brand-600" />
        {!compact && "PDP Snapshots"}
      </Button>

      {open && coords
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-label="PDP Snapshots"
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-50 flex w-80 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg"
            >
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  PDP Snapshots
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Product page snapshots saved at the time of each crawl.
                </p>
              </div>

              <ul className="m-0 max-h-80 list-none divide-y divide-border overflow-y-auto p-0">
                {PDP_SNAPSHOTS.map((snap) => (
                  <li key={snap.id}>
                    <a
                      href={snap.href}
                      onClick={(event) => event.preventDefault()}
                      className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
                    >
                      <span className="min-w-0 flex flex-col gap-1">
                        <span className="text-sm font-semibold text-foreground">
                          {snap.whenLabel}
                        </span>
                        <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
                          <span>{snap.relativeLabel}</span>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3 shrink-0" aria-hidden />
                            {snap.city} ({snap.zip})
                          </span>
                        </span>
                      </span>
                      <ExternalLink
                        className="mt-0.5 size-4 shrink-0 text-neutral-400"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function GapBadge({ dollars }: { dollars: number }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-error-25 px-3 text-xs">
      <span className="font-medium text-neutral-500">Gap</span>
      <span className="font-mono font-semibold text-error-600">
        {formatCompactDollars(dollars)}
      </span>
    </span>
  );
}
