"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { FullRcaRevenueTrend } from "@/lib/mock-full-rca-report";

const chartConfig = {
  actual: { label: "Actual", color: "var(--color-brand-500)" },
  plan: { label: "Plan", color: "var(--color-warning-600)" },
} satisfies ChartConfig;

type FullRcaRevenueTrendSectionProps = {
  data: FullRcaRevenueTrend;
};

function formatAxisValue(value: number) {
  return value.toLocaleString("en-US");
}

function formatTooltipValue(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString("en-US")}`;
}

/**
 * Recent Trend — 8 Weeks: plan vs actual line chart + narrative
 * (matches the Gap to Plan design reference).
 */
export function FullRcaRevenueTrendSection({
  data,
}: FullRcaRevenueTrendSectionProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="overflow-hidden rounded-lg border border-border bg-background px-2 pb-2 pt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <LineChart
            accessibilityLayer
            data={data.series}
            margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              label={{
                value: "Week",
                position: "insideBottom",
                offset: -2,
                className: "fill-muted-foreground text-2xs",
              }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              height={56}
              angle={-90}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              label={{
                value: "Value",
                angle: -90,
                position: "insideLeft",
                offset: 8,
                className: "fill-muted-foreground text-2xs",
              }}
              tickLine={false}
              axisLine={false}
              width={72}
              domain={[0, 120_000_000]}
              ticks={[
                0, 20_000_000, 40_000_000, 60_000_000, 80_000_000, 100_000_000,
                120_000_000,
              ]}
              tickFormatter={formatAxisValue}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatTooltipValue(Number(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={{
                r: 3.5,
                fill: "var(--color-actual)",
                strokeWidth: 0,
              }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="plan"
              stroke="var(--color-plan)"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{
                r: 3.5,
                fill: "var(--color-plan)",
                strokeWidth: 0,
              }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
        {data.narrative}
      </p>
    </div>
  );
}
