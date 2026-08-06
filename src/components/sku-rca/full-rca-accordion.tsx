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
  /**
   * No padding on the open body — use when children are flush tables
   * that should attach to the accordion header edge.
   */
  flushContent?: boolean;
};

/**
 * Expandable row in a uniform list (Law of Similarity).
 * Separators full-bleed; text padded. Open body is a softer child region.
 */
export function FullRcaAccordion({
  title,
  subtitle,
  icon,
  open,
  onOpenChange,
  children,
  className,
  flushContent = false,
}: FullRcaAccordionProps) {
  return (
    <div className={cn("border-b border-border last:border-b-0", className)}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors",
          "hover:bg-neutral-50",
          open
            ? "border-l-brand-500 bg-brand-50/35"
            : "border-l-transparent",
        )}
      >
        {icon ? (
          <span className="mt-0.5 shrink-0 text-neutral-500">{icon}</span>
        ) : null}

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
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
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-foreground",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className={cn(
            "border-t border-border",
            flushContent
              ? "bg-background"
              : "bg-neutral-50/60 px-4 py-4",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
