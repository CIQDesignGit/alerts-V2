"use client";

import { Flag, Search, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PlanHistoryList } from "@/components/manage-plans/plan-history-list";
import { PlanHistoryPagination } from "@/components/manage-plans/plan-history-pagination";
import { PlanUploadFlow } from "@/components/manage-plans/plan-upload-flow";
import { Button } from "@/components/ui/button";
import {
  CURRENT_USER_EMAIL,
  MOCK_SALES_PLANS,
  withLiveStatus,
  type SalesPlan,
} from "@/lib/mock-sales-plans";
import { cn, controlFocusClass, fieldFocusClass } from "@/lib/utils";

type PanelView = "list" | "upload";

const PAGE_SIZE = 4;

type ManagePlansPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function ManagePlansPanel({ open, onClose }: ManagePlansPanelProps) {
  const [view, setView] = useState<PanelView>("list");
  const [search, setSearch] = useState("");
  const [plans, setPlans] = useState<SalesPlan[]>(() =>
    withLiveStatus(MOCK_SALES_PLANS),
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setView("list");
      setSearch("");
      setPage(1);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const sortedPlans = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = normalized
      ? plans.filter(
          (p) =>
            p.fileName.toLowerCase().includes(normalized) ||
            p.uploadedBy.toLowerCase().includes(normalized),
        )
      : plans;

    return [...filtered].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  }, [plans, search]);

  const totalPages = Math.max(1, Math.ceil(sortedPlans.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPlans = sortedPlans.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleUploadComplete(file: File, failed: boolean) {
    const newPlan: SalesPlan = {
      id: `plan-${Date.now()}`,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      uploadedBy: CURRENT_USER_EMAIL,
      status: failed ? "failed" : "live",
      errorMessage: failed
        ? "Row 142: Invalid SKU format. Row 891: Target units must be a positive number."
        : undefined,
    };

    setPlans((prev) => withLiveStatus([newPlan, ...prev]));
    setPage(1);
  }

  async function handleDownload(plan: SalesPlan) {
    setDownloadingId(plan.id);
    await new Promise((resolve) => window.setTimeout(resolve, 700));

    const blob = new Blob(
      [`Mock export for ${plan.fileName}\nStatus: ${plan.status}`],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = plan.fileName;
    anchor.click();
    URL.revokeObjectURL(url);

    setDownloadingId(null);
  }

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close manage plans panel"
        className="fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-plans-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-background shadow-xl animate-in slide-in-from-right duration-200"
      >
        {view === "upload" ? (
          <PlanUploadFlow
            onBack={() => setView("list")}
            onComplete={handleUploadComplete}
            onSuccessDone={() => setView("list")}
          />
        ) : (
          <>
            <header className="flex items-start gap-3 border-b border-border px-4 py-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                <Flag className="size-4 text-brand-600" />
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id="manage-plans-title"
                  className="text-base font-semibold text-foreground"
                >
                  Manage plans
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Sales targets that drive gap-to-plan alerts
                </p>
              </div>
              <button
                type="button"
                aria-label="Close panel"
                onClick={onClose}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 hover:text-foreground",
                  controlFocusClass,
                )}
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search plans</span>
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by file or author…"
                  className={cn(
                    "w-full rounded-lg border border-border bg-background py-2 pr-3 pl-8 text-xs",
                    fieldFocusClass,
                  )}
                />
              </label>
              <Button
                type="button"
                size="sm"
                onClick={() => setView("upload")}
                className="shrink-0"
              >
                <Upload className="size-3.5" data-icon="inline-start" />
                Upload plan
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <PlanHistoryList
                plans={pagedPlans}
                onDownload={handleDownload}
                downloadingId={downloadingId}
              />
            </div>

            {sortedPlans.length > 0 && (
              <PlanHistoryPagination
                page={safePage}
                totalPages={totalPages}
                totalItems={sortedPlans.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </aside>
    </>
  );
}
