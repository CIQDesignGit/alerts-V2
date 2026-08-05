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
 * All major sections share one accordion row style; nested causes sit one level down.
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

      <div className="px-5 py-5">
        <section className="mb-6">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Key Finding
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-800">
            {report.keyFinding}
          </p>
        </section>

        {/* Peer-level sections — same FullRcaAccordion chrome for every item */}
        <div className="flex flex-col">
          <FullRcaAccordion
            title="Plan vs Actual"
            open={openPlan}
            onOpenChange={setOpenPlan}
          >
            <FullRcaDataTable table={report.planVsActual} />
          </FullRcaAccordion>

          <FullRcaAccordion
            title="Ecommerce Equation"
            subtitle="Week-over-Week Change: Traffic × Conversion × Price"
            open={openEquation}
            onOpenChange={setOpenEquation}
          >
            <div className="space-y-4">
              <FullRcaDataTable table={report.ecommerceEquation.table} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {report.ecommerceEquation.summary}
              </p>
            </div>
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
      </div>
    </article>
  );
}
