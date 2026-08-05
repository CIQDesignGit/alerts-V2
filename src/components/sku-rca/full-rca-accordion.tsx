"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FullRcaAccordionProps = {
  title: ReactNode;
  /** Extra line under the title (always visible) */
  subtitle?: ReactNode;
  /** Leading icon in the header row */
  icon?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
};

/**
 * Divider-style disclosure row — matches SkuRca issue accordions.
 * Spacing + a hairline do the grouping; no nested brand-bordered cards.
 */
export function FullRcaAccordion({
  title,
  subtitle,
  icon,
  open,
  onOpenChange,
  children,
  className,
}: FullRcaAccordionProps) {
  return (
    <div className={cn("border-t border-border", className)}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        className="flex w-full items-start gap-2.5 py-3 text-left transition-colors hover:bg-neutral-50/80"
      >
        {icon ? (
          <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        ) : null}

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </span>

        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? <div className="pb-4 pl-0 sm:pl-6">{children}</div> : null}
    </div>
  );
}
