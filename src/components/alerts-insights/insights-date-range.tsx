"use client";

import { Calendar, ChevronDown, GitCompareArrows } from "lucide-react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import {
  formatInsightsComparison,
  formatInsightsDateRange,
  INSIGHTS_COMPARISON_PRESETS,
  INSIGHTS_DATE_RANGE_PRESETS,
  type InsightsComparisonId,
  type InsightsComparisonPeriod,
  type InsightsDateRange,
  type InsightsDateRangeId,
} from "@/lib/insights-date-range";
import { cn } from "@/lib/utils";

type InsightsDateRangePickerProps = {
  value: InsightsDateRange;
  onChange: (next: InsightsDateRange) => void;
  /** When set, shows a compare-to control next to the primary range */
  comparison?: InsightsComparisonPeriod;
  onComparisonChange?: (next: InsightsComparisonPeriod) => void;
  className?: string;
  /**
   * toolbar = dropdown only (caption lives elsewhere in the header).
   * default = dropdown + caption inline.
   */
  variant?: "default" | "toolbar";
  /** Open menus aligned to the trigger’s right edge (header controls). */
  menuAlign?: "left" | "right";
  /** Show the resolved dates inside the buttons. */
  showRangeInTrigger?: boolean;
};

const DATE_OPTIONS: { id: InsightsDateRangeId; label: string }[] = [
  ...INSIGHTS_DATE_RANGE_PRESETS,
  { id: "custom", label: "Custom" },
];

type MenuCoords = { top: number; left: number; minWidth: number };

type PortalSelectProps = {
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  options: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  menuAlign: "left" | "right";
  listLabel: string;
};

/** Shared dropdown — portals to body so scroll parents can’t clip it. */
function PortalSelect({
  label,
  ariaLabel,
  icon,
  options,
  selectedId,
  onSelect,
  menuAlign,
  listLabel,
}: PortalSelectProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  function updateCoords() {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const minWidth = Math.max(rect.width, 176);
    const left =
      menuAlign === "right"
        ? Math.max(8, rect.right - minWidth)
        : Math.min(rect.left, window.innerWidth - minWidth - 8);
    setCoords({ top: rect.bottom + 4, left, minWidth });
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

  usePortalDismiss(open, setOpen, triggerRef, menuRef, updateCoords, menuAlign);

  const menu =
    mounted &&
    open &&
    coords &&
    createPortal(
      <ul
        ref={menuRef}
        id={listId}
        role="listbox"
        aria-label={listLabel}
        style={{
          position: "fixed",
          top: coords.top,
          left: coords.left,
          minWidth: coords.minWidth,
        }}
        className="z-50 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg"
      >
        {options.map((option) => {
          const selected = selectedId === option.id;
          return (
            <li key={option.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}
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
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-8 max-w-full items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
      >
        {icon}
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-neutral-600 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  );
}

function usePortalDismiss(
  open: boolean,
  setOpen: (v: boolean) => void,
  triggerRef: RefObject<HTMLButtonElement | null>,
  menuRef: RefObject<HTMLUListElement | null>,
  updateCoords: () => void,
  menuAlign: "left" | "right",
) {
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

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [open, menuAlign, setOpen, triggerRef, menuRef, updateCoords]);
}

/**
 * Primary period + optional comparison period — shared by Snapshot and Trends.
 */
export function InsightsDateRangePicker({
  value,
  onChange,
  comparison,
  onComparisonChange,
  className,
  variant = "default",
  menuAlign = "left",
  showRangeInTrigger = false,
}: InsightsDateRangePickerProps) {
  const display = formatInsightsDateRange(value);
  const selectedLabel =
    DATE_OPTIONS.find((o) => o.id === value.id)?.label ?? display.label;
  const dateTriggerLabel = showRangeInTrigger
    ? `${selectedLabel} · ${display.rangeText}`
    : selectedLabel;

  const isToolbar = variant === "toolbar";
  const showComparison = comparison != null && onComparisonChange != null;
  const comparisonDisplay = showComparison
    ? formatInsightsComparison(comparison, value)
    : null;
  const comparisonTriggerLabel =
    comparisonDisplay &&
    comparison &&
    (showRangeInTrigger && comparison.id !== "none"
      ? `${comparisonDisplay.label} · ${comparisonDisplay.rangeText}`
      : comparisonDisplay.label);

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
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1.5",
          isToolbar && "justify-end",
        )}
      >
        {!isToolbar && (
          <p className="mr-1 text-xs text-muted-foreground">
            Showing performance metrics for{" "}
            <span className="font-medium text-foreground">
              {display.rangeText}
            </span>
            {comparisonDisplay && comparison?.id !== "none" && (
              <>
                {" "}
                vs{" "}
                <span className="font-medium text-foreground">
                  {comparisonDisplay.rangeText}
                </span>
              </>
            )}
          </p>
        )}

        <PortalSelect
          label={dateTriggerLabel}
          ariaLabel={
            showRangeInTrigger
              ? `${selectedLabel}, ${display.rangeText}`
              : selectedLabel
          }
          icon={
            <Calendar
              className="size-3.5 shrink-0 text-neutral-600"
              aria-hidden
            />
          }
          options={DATE_OPTIONS}
          selectedId={value.id}
          onSelect={(id) => selectPreset(id as InsightsDateRangeId)}
          menuAlign={menuAlign}
          listLabel="Date range"
        />

        {showComparison && comparisonTriggerLabel && (
          <>
            <span
              className="shrink-0 text-2xs font-medium tracking-wide text-neutral-400 uppercase"
              aria-hidden
            >
              vs
            </span>
            <PortalSelect
              label={comparisonTriggerLabel}
              ariaLabel={
                comparison.id === "none"
                  ? comparisonDisplay!.label
                  : `${comparisonDisplay!.label}, ${comparisonDisplay!.rangeText}`
              }
              icon={
                <GitCompareArrows
                  className="size-3.5 shrink-0 text-neutral-600"
                  aria-hidden
                />
              }
              options={INSIGHTS_COMPARISON_PRESETS}
              selectedId={comparison.id}
              onSelect={(id) =>
                onComparisonChange({ id: id as InsightsComparisonId })
              }
              menuAlign={menuAlign}
              listLabel="Comparison period"
            />
          </>
        )}
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
