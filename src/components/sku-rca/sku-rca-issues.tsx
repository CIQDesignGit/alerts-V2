"use client";

import { useState } from "react";

import { SkuRcaIssueRow } from "@/components/sku-rca/sku-rca-issue-row";
import type { RcaIssueGroup } from "@/lib/mock-sku-rca";

type SkuRcaIssuesProps = {
  groups: RcaIssueGroup[];
  lastUpdated: string;
};

export function SkuRcaIssues({ groups, lastUpdated }: SkuRcaIssuesProps) {
  // Multiple rows can be open at once
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">Issues</h3>
        <p className="text-xs text-muted-foreground">{lastUpdated}</p>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group.label}
          </p>
          <ul className="overflow-hidden rounded-lg border border-border bg-background">
            {group.issues.map((issue) => {
              const rowId = `${group.id}:${issue.issueKey}`;
              return (
                <SkuRcaIssueRow
                  key={rowId}
                  issue={issue}
                  open={openIds.has(rowId)}
                  onToggle={() => toggle(rowId)}
                />
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
