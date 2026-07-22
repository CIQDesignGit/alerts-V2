"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import {
  ATTAINMENT_TREND,
  BUY_BOX_WIN_RATE,
  CONVERSION_TREND,
  GAP_DRIVERS,
  ISSUE_TRENDS,
  MEDIA_VS_SALES,
  OOS_DAYS,
  REVENUE_VS_PLAN,
} from "@/lib/insights-chart-data";

/** Count of SKUs hit by each issue type — Trends default for this level. */
export function IssueTrendsChart() {
  const config = {
    buyBox: { label: "Buy Box", color: "var(--chart-5)" },
    dealPage: { label: "Deal Page", color: "var(--chart-4)" },
    stock: { label: "Stock", color: "var(--chart-3)" },
    conversion: { label: "Conversion", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <LineChart accessibilityLayer data={ISSUE_TRENDS}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="buyBox"
          stroke="var(--color-buyBox)"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
        <Line
          type="monotone"
          dataKey="dealPage"
          stroke="var(--color-dealPage)"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
        <Line
          type="monotone"
          dataKey="stock"
          stroke="var(--color-stock)"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
        <Line
          type="monotone"
          dataKey="conversion"
          stroke="var(--color-conversion)"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function RevenueVsPlanChart() {
  const config = {
    plan: { label: "Plan", color: "var(--chart-2)" },
    actual: { label: "Actual", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <LineChart accessibilityLayer data={REVENUE_VS_PLAN}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="plan"
          stroke="var(--color-plan)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--color-actual)"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function GapDriversChart() {
  const config = {
    buyBox: { label: "Buy Box", color: "var(--chart-5)" },
    media: { label: "Media", color: "var(--chart-4)" },
    stock: { label: "Stock", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <BarChart accessibilityLayer data={GAP_DRIVERS}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="buyBox" stackId="a" fill="var(--color-buyBox)" radius={2} />
        <Bar dataKey="media" stackId="a" fill="var(--color-media)" radius={2} />
        <Bar dataKey="stock" stackId="a" fill="var(--color-stock)" radius={2} />
      </BarChart>
    </ChartContainer>
  );
}

export function AttainmentChart() {
  const config = {
    attainment: { label: "Attainment %", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <AreaChart accessibilityLayer data={ATTAINMENT_TREND}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={28} domain={[0, 110]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="attainment"
          fill="var(--color-attainment)"
          fillOpacity={0.2}
          stroke="var(--color-attainment)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function BuyBoxWinChart() {
  const config = {
    winRate: { label: "Win rate %", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <LineChart accessibilityLayer data={BUY_BOX_WIN_RATE}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={28} domain={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="winRate"
          stroke="var(--color-winRate)"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function MediaVsSalesChart() {
  const config = {
    spend: { label: "Spend $K", color: "var(--chart-4)" },
    adSales: { label: "Ad sales $K", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <BarChart accessibilityLayer data={MEDIA_VS_SALES}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="spend" fill="var(--color-spend)" radius={3} />
        <Bar dataKey="adSales" fill="var(--color-adSales)" radius={3} />
      </BarChart>
    </ChartContainer>
  );
}

export function ConversionChart() {
  const config = {
    cvr: { label: "CVR %", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <AreaChart accessibilityLayer data={CONVERSION_TREND}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="cvr"
          fill="var(--color-cvr)"
          fillOpacity={0.15}
          stroke="var(--color-cvr)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function OosDaysChart() {
  const config = {
    days: { label: "OOS days", color: "var(--chart-5)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-40 w-full">
      <BarChart accessibilityLayer data={OOS_DAYS}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="days" fill="var(--color-days)" radius={3} />
      </BarChart>
    </ChartContainer>
  );
}
