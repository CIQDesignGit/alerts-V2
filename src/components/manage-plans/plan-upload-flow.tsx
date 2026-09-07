"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, controlFocusClass, fieldFocusClass } from "@/lib/utils";

type UploadPhase = "idle" | "uploading" | "success" | "error";
type PlanSource = "template" | "auto";

type PlanUploadFlowProps = {
  onBack: () => void;
  onComplete: (file: File, shouldFail: boolean) => void;
  onSuccessDone: () => void;
};

const ACCEPTED_TYPES = [".csv", ".xlsx", ".xls"];
const MAX_SIZE_MB = 10;

function downloadTemplate() {
  const blob = new Blob(
    ["SKU,Category,Target Units,Target Revenue\n"],
    { type: "text/csv" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sales-plan-template.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PlanUploadFlow({
  onBack,
  onComplete,
  onSuccessDone,
}: PlanUploadFlowProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<PlanSource>("template");
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const reset = useCallback(() => {
    setFile(null);
    setPhase("idle");
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  function validate(selected: File): string | null {
    const ext = selected.name.slice(selected.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      return "Only CSV or Excel files (.csv, .xlsx, .xls) are supported.";
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File exceeds ${MAX_SIZE_MB} MB. Split the plan or remove unused columns.`;
    }
    return null;
  }

  function handleFile(selected: File) {
    const validationError = validate(selected);
    if (validationError) {
      setFile(null);
      setError(validationError);
      setPhase("error");
      return;
    }
    setFile(selected);
    setError(null);
    setPhase("idle");
  }

  function startUpload() {
    const activeFile =
      file ??
      (source === "auto"
        ? new File(
            ["auto-generated-plan"],
            "Auto_Generated_Sales_Plan.csv",
            { type: "text/csv" },
          )
        : null);
    if (!activeFile) return;
    if (!file) setFile(activeFile);
    setPhase("uploading");
    setProgress(0);
    setError(null);

    // Simulate upload progress — ~20% of files fail for demo
    const shouldFail = Math.random() < 0.2;
    let tick = 0;
    const interval = window.setInterval(() => {
      tick += 1;
      setProgress(Math.min(tick * 10, 100));
      if (tick >= 10) {
        window.clearInterval(interval);
        if (shouldFail) {
          setPhase("error");
          setError(
            "Row 142: Invalid SKU format. Row 891: Target units must be a positive number.",
          );
          onComplete(activeFile, true);
        } else {
          setPhase("success");
          onComplete(activeFile, false);
        }
      }
    }, 200);
  }

  const canSubmit = source === "auto" || Boolean(file);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 hover:text-foreground",
            controlFocusClass,
          )}
          aria-label="Back to plan history"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">Upload plan</h3>
          <p className="text-xs text-muted-foreground">
            CSV or Excel · max {MAX_SIZE_MB} MB
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {phase === "success" ? (
          <SuccessState
            fileName={file?.name ?? ""}
            onDone={onSuccessDone}
          />
        ) : (
          <>
            <Tabs
              value={source}
              onValueChange={(value) => {
                if (value !== "template" && value !== "auto") return;
                setSource(value);
                reset();
              }}
              className="gap-3"
            >
              <TabsList variant="line" className="w-full border-b border-border">
                <TabsTrigger value="template" className="flex-1">
                  Upload from template
                </TabsTrigger>
                <TabsTrigger value="auto" className="flex-1">
                  Auto-generate plan
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {source === "template" ? (
              <>
                <DropZone
                  inputId={inputId}
                  inputRef={inputRef}
                  file={file}
                  dragOver={dragOver}
                  disabled={phase === "uploading"}
                  onDragOver={() => setDragOver(true)}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(f) => {
                    setDragOver(false);
                    handleFile(f);
                  }}
                  onBrowse={(f) => handleFile(f)}
                  onClear={() => reset()}
                />

                <div className="flex items-center gap-3 rounded-lg border border-border bg-neutral-50 p-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <FileSpreadsheet className="size-4 text-brand-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Template: Sales Plan
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Download this sheet, fill in your plan&rsquo;s details,
                      then re-upload the completed file.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Download sales plan template"
                    onClick={downloadTemplate}
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-neutral-100 hover:text-foreground",
                      controlFocusClass,
                    )}
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-neutral-50/50 p-6 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-50">
                  <Sparkles className="size-5 text-brand-600" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Auto-generate from recent sales
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Build a plan from the last 90 days of sales
                    performance — no file needed.
                  </p>
                </div>
              </div>
            )}

            {phase === "uploading" && (
              <div className="rounded-lg border border-border bg-neutral-50/80 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {source === "auto" ? "Generating…" : "Uploading…"}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {phase === "error" && error && (
              <ErrorBanner message={error} onDismiss={() => setPhase("idle")} />
            )}

            <div className="mt-auto flex flex-col gap-3 pt-2">
              <p className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                <Clock className="size-3.5 shrink-0" aria-hidden />
                Plans take a few hours to update. We&rsquo;ll notify you by
                email when it&rsquo;s ready.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!canSubmit || phase === "uploading"}
                  onClick={startUpload}
                  className="flex-1"
                >
                  <Upload className="size-4" data-icon="inline-start" />
                  {source === "auto"
                    ? "Generate and activate"
                    : "Upload and activate"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DropZone({
  inputId,
  inputRef,
  file,
  dragOver,
  disabled,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowse,
  onClear,
}: {
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  dragOver: boolean;
  disabled: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (file: File) => void;
  onBrowse: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) onDragOver();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        onDragLeave();
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (disabled) return;
        const dropped = e.dataTransfer.files[0];
        if (dropped) onDrop(dropped);
      }}
      className={cn(
        "relative rounded-xl border-2 border-dashed p-6 transition-colors",
        dragOver
          ? "border-brand-400 bg-brand-50/50"
          : "border-border bg-neutral-50/50",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) onBrowse(selected);
        }}
      />

      {file ? (
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand-100">
            <FileSpreadsheet className="size-5 text-brand-600" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            type="button"
            aria-label="Remove file"
            onClick={onClear}
            className={cn(
              "flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-neutral-100 hover:text-foreground",
              controlFocusClass,
            )}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            "flex cursor-pointer flex-col items-center py-4 text-center",
            fieldFocusClass,
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-50">
            <Upload className="size-5 text-brand-600" />
          </span>
          <p className="mt-3 text-sm font-medium text-foreground">
            Drop your plan file here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or{" "}
            <span className="font-medium text-brand-600 underline-offset-2 hover:underline">
              browse to upload
            </span>
          </p>
        </label>
      )}
    </div>
  );
}

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-lg border border-error-200 bg-error-25 p-3"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-error-600" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-error-700">Upload failed</p>
        <p className="mt-0.5 text-xs leading-relaxed text-error-700">
          {message}
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss error"
        onClick={onDismiss}
        className={cn(
          "shrink-0 text-error-600 hover:text-error-800",
          controlFocusClass,
        )}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function SuccessState({
  fileName,
  onDone,
}: {
  fileName: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-success-100">
        <CheckCircle2 className="size-7 text-success-600" />
      </span>
      <p className="mt-4 text-sm font-semibold text-foreground">Plan is live</p>
      <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
        {fileName}
      </p>
      <p className="mt-3 text-2xs text-muted-foreground">
        Returning to plan history…
      </p>
    </div>
  );
}
