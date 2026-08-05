"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { FullRcaWeekPoint } from "@/lib/mock-full-rca-report";

const chartConfig = {
  plan: { label: "Plan", color: "var(--color-neutral-500)" },
  actual: { label: "Revenue (Actual)", color: "var(--color-brand-500)" },
} satisfies ChartConfig;

type FullRcaRevenueChartProps = {
  data: FullRcaWeekPoint[];
};

/** 8-week Plan vs Actual line chart inside the full RCA card. */
export function FullRcaRevenueChart({ data }: FullRcaRevenueChartProps) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
      <LineChart accessibilityLayer data={data} margin={{ left: 4, right: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v: number) => `$${v}K`}
          domain={[0, 800]}
          ticks={[0, 200, 400, 600, 800]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `$${Number(value).toLocaleString()}K`}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="plan"
          stroke="var(--color-plan)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--color-actual)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--background)", strokeWidth: 2 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
