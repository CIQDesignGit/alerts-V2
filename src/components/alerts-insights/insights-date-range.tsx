"use client";

import { CalendarRange, ChevronDown } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  formatInsightsDateRange,
  INSIGHTS_DATE_RANGE_PRESETS,
  type InsightsDateRange,
  type InsightsDateRangeId,
} from "@/lib/insights-date-range";
import { cn } from "@/lib/utils";

type InsightsDateRangePickerProps = {
  value: InsightsDateRange;
  onChange: (next: InsightsDateRange) => void;
  className?: string;
  /**
   * toolbar = dropdown only (caption lives elsewhere in the header).
   * default = dropdown + caption inline.
   */
  variant?: "default" | "toolbar";
  /** Open menu aligned to the trigger’s right edge (header controls). */
  menuAlign?: "left" | "right";
  /** Show the resolved dates inside the button (e.g. “Week to date · Mon–Wed”). */
  showRangeInTrigger?: boolean;
};

const ALL_OPTIONS: { id: InsightsDateRangeId; label: string }[] = [
  ...INSIGHTS_DATE_RANGE_PRESETS,
  { id: "custom", label: "Custom" },
];

type MenuCoords = { top: number; left: number; minWidth: number };

/**
 * Shared period control — menu portals to body so scroll parents can’t clip it.
 */
export function InsightsDateRangePicker({
  value,
  onChange,
  className,
  variant = "default",
  menuAlign = "left",
  showRangeInTrigger = false,
}: InsightsDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const display = formatInsightsDateRange(value);
  const selectedLabel =
    ALL_OPTIONS.find((o) => o.id === value.id)?.label ?? display.label;
  const isToolbar = variant === "toolbar";

  function selectPreset(id: InsightsDateRangeId) {
    if (id === "custom") {
      onChange({
        id: "custom",
        customFrom: value.customFrom ?? "",
        customTo: value.customTo ?? "",
      });
    } else {
      onChange({ id });
    }
    setOpen(false);
  }

  function updateCoords() {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const minWidth = Math.max(rect.width, 176);
    const left =
      menuAlign === "right"
        ? Math.max(8, rect.right - minWidth)
        : Math.min(rect.left, window.innerWidth - minWidth - 8);
    setCoords({
      top: rect.bottom + 4,
      left,
      minWidth,
    });
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updateCoords();
  }, [open, menuAlign]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onReposition() {
      updateCoords();
    }

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, menuAlign]);

  const menu =
    mounted &&
    open &&
    coords &&
    createPortal(
      <ul
        ref={menuRef}
        id={listId}
        role="listbox"
        aria-label="Date range"
        style={{
          position: "fixed",
          top: coords.top,
          left: coords.left,
          minWidth: coords.minWidth,
        }}
        className="z-50 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg"
      >
        {ALL_OPTIONS.map((option) => {
          const selected = value.id === option.id;
          return (
            <li key={option.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectPreset(option.id)}
                className={cn(
                  "flex w-full px-3 py-1.5 text-left text-xs font-medium",
                  selected
                    ? "bg-brand-50 text-brand-800"
                    : "text-foreground hover:bg-neutral-50",
                )}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>,
      document.body,
    );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1.5",
          isToolbar && "justify-end",
        )}
      >
        {!isToolbar && (
          <p className="text-xs text-muted-foreground">
            Showing performance metrics for{" "}
            <span className="font-medium text-foreground">
              {display.rangeText}
            </span>
          </p>
        )}

        <div className="relative shrink-0">
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            aria-haspopup="listbox"
            aria-label={
              showRangeInTrigger
                ? `${selectedLabel}, ${display.rangeText}`
                : selectedLabel
            }
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
              "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground hover:bg-neutral-50",
              showRangeInTrigger ? "h-auto items-start py-1.5" : "h-7",
            )}
          >
            <CalendarRange
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground",
                showRangeInTrigger && "mt-0.5",
              )}
              aria-hidden
            />
            {showRangeInTrigger ? (
              <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                <span className="truncate leading-tight">{selectedLabel}</span>
                <span className="truncate text-2xs font-normal leading-tight text-muted-foreground">
                  {display.rangeText}
                </span>
              </span>
            ) : (
              <span className="truncate">{selectedLabel}</span>
            )}
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                showRangeInTrigger && "mt-0.5",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {menu}
        </div>
      </div>

      {value.id === "custom" && (
        <div
          className={cn(
            "flex flex-wrap items-end gap-2",
            isToolbar && "justify-end",
          )}
        >
          <label className="flex flex-col gap-0.5 text-2xs text-muted-foreground">
            From
            <input
              type="date"
              value={value.customFrom ?? ""}
              onChange={(e) =>
                onChange({ ...value, id: "custom", customFrom: e.target.value })
              }
              className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground"
            />
          </label>
          <label className="flex flex-col gap-0.5 text-2xs text-muted-foreground">
            To
            <input
              type="date"
              value={value.customTo ?? ""}
              onChange={(e) =>
                onChange({ ...value, id: "custom", customTo: e.target.value })
              }
              className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground"
            />
          </label>
        </div>
      )}
    </div>
  );
}
