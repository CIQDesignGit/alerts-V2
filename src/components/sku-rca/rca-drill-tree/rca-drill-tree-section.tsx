"use client";

import ReactMarkdown from "react-markdown";

import { RcaDrillTree } from "@/components/sku-rca/rca-drill-tree/rca-drill-tree";
import type { RcaDrillTreeData } from "@/lib/mock-rca-drill-tree";
import { cn } from "@/lib/utils";

type RcaDrillTreeSectionProps = {
  data: RcaDrillTreeData;
};

const legendItems = [
  { label: "Decrease", className: "bg-error-50 text-error-600" },
  { label: "Increase", className: "bg-success-50 text-success-600" },
  { label: "No change", className: "bg-neutral-100 text-muted-foreground" },
] as const;

/** Strip **bold** markers for screen-reader labels. */
function headlinePlain(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
}

/** Headline + legend + horizontally scrollable drill-down tree. */
export function RcaDrillTreeSection({ data }: RcaDrillTreeSectionProps) {
  const plainHeadline = headlinePlain(data.headline);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
          Causal breakdown · last week
        </p>
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mt-1.5 text-sm leading-snug text-neutral-700">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-neutral-900">{children}</strong>
            ),
          }}
        >
          {data.headline}
        </ReactMarkdown>
      </div>

      <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Delta legend">
        {legendItems.map((item) => (
          <li key={item.label}>
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-2xs font-medium",
                item.className,
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div
        className="overflow-x-auto pb-1"
        role="img"
        aria-label={plainHeadline}
        tabIndex={0}
      >
        <RcaDrillTree data={data} />
      </div>
    </div>
  );
}
