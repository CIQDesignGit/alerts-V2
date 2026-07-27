"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type SkuRcaView = "alert" | "skuInsights";

type SkuRcaViewToggleProps = {
  view: SkuRcaView;
  onChange: (view: SkuRcaView) => void;
};

/** In-SKU sub-tabs: live alert diagnosis vs historical issue trends. */
export function SkuRcaViewToggle({ view, onChange }: SkuRcaViewToggleProps) {
  return (
    <Tabs
      value={view}
      onValueChange={(value) => {
        if (value === "alert" || value === "skuInsights") onChange(value);
      }}
      className="gap-0"
    >
      <TabsList aria-label="SKU detail view" className="h-7 bg-neutral-100">
        <TabsTrigger value="alert" className="px-2.5 text-xs">
          Alert
        </TabsTrigger>
        <TabsTrigger value="skuInsights" className="px-2.5 text-xs">
          SKU Insights
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
