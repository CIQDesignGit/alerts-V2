"use client";

import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { FullRcaAccordion } from "@/components/sku-rca/full-rca-accordion";
import { FullRcaDataTable } from "@/components/sku-rca/full-rca-data-table";
import { FullRcaRecommendationsList } from "@/components/sku-rca/full-rca-recommendations";
import { FullRcaRevenueChart } from "@/components/sku-rca/full-rca-revenue-chart";
import { FullRcaRootCausesList } from "@/components/sku-rca/full-rca-root-causes";
import type { FullRcaReportData } from "@/lib/mock-full-rca-report";

type FullRcaReportProps = {
  report: FullRcaReportData;
};

/**
 * AllyAI full-week RCA answer.
 *
 * Supporting analysis = one section. Its accordion rows are inset underneath
 * the title (common region + nesting), not a full-bleed peer block.
 */
export function FullRcaReport({ report }: FullRcaReportProps) {
  const [openPlan, setOpenPlan] = useState(false);
  const [openEquation, setOpenEquation] = useState(false);
  const [openCauses, setOpenCauses] = useState(true);
  const [openRevenue, setOpenRevenue] = useState(true);
  const [openRecs, setOpenRecs] = useState(false);

  const causesSubtitle = useMemo(() => {
    const openCount = report.rootCauses.filter(
      (c) => c.status === "still-an-issue",
    ).length;
    const total = report.rootCauses.length;
    return `${total} drivers · ${openCount} still an issue`;
  }, [report.rootCauses]);

  return (
    <article className="rounded-xl border border-border bg-background">
      <header className="border-b border-border px-5 py-4">
        <div className="mb-1.5 flex items-center gap-1.5 text-brand-600">
          <Sparkles className="size-3.5 shrink-0" aria-hidden />
          <span className="text-2xs font-medium tracking-wide uppercase">
            AllyAI
          </span>
        </div>
        <h2 className="text-sm font-semibold leading-snug text-foreground">
          Amazon RCA · ASIN {report.asin}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {report.brand} · {report.weekLabel} · {report.periodLabel}
        </p>
      </header>

      {/* Primary — key takeaway */}
      <section className="border-b border-border bg-neutral-50/50 px-5 py-6">
        <h3 className="text-sm font-semibold text-foreground">Key finding</h3>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-800">
          {report.keyFinding}
        </p>
      </section>

      {/*
        Supporting analysis = parent section.
        Title lives in the padded frame; accordion list is nested inside it
        (indented + bordered) so it reads as children, not siblings.
      */}
      <section
        aria-labelledby="full-rca-supporting-heading"
        className="bg-neutral-50/40 px-5 py-5"
      >
        <div className="mb-3">
          <h3
            id="full-rca-supporting-heading"
            className="text-sm font-semibold text-foreground"
          >
            Supporting analysis
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Plan, drivers, trends, and next actions
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <FullRcaAccordion
            title="Plan vs Actual"
            subtitle="Where this ASIN missed or beat plan"
            open={openPlan}
            onOpenChange={setOpenPlan}
            flushContent
          >
            <FullRcaDataTable table={report.planVsActual} />
          </FullRcaAccordion>

          <FullRcaAccordion
            title="Ecommerce Equation"
            subtitle="Week-over-Week Change: Traffic × Conversion × Price"
            open={openEquation}
            onOpenChange={setOpenEquation}
            flushContent
          >
            <FullRcaDataTable table={report.ecommerceEquation.table} />
            <p className="max-w-prose px-4 py-4 text-sm leading-relaxed text-muted-foreground">
              {report.ecommerceEquation.summary}
            </p>
          </FullRcaAccordion>

          <FullRcaAccordion
            title="Root Causes"
            subtitle={causesSubtitle}
            open={openCauses}
            onOpenChange={setOpenCauses}
          >
            <FullRcaRootCausesList causes={report.rootCauses} />
          </FullRcaAccordion>

          <FullRcaAccordion
            title="8-Week Revenue Context"
            subtitle="Actual revenue vs plan across the last 8 weeks"
            open={openRevenue}
            onOpenChange={setOpenRevenue}
          >
            <FullRcaRevenueChart data={report.revenueSeries} />
          </FullRcaAccordion>

          <FullRcaAccordion
            title="Recommendations"
            subtitle={report.recommendationsUrgency}
            open={openRecs}
            onOpenChange={setOpenRecs}
          >
            <FullRcaRecommendationsList items={report.recommendations} />
          </FullRcaAccordion>
        </div>
      </section>
    </article>
  );
}
