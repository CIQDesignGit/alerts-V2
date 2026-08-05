"use client";

import type { FullRcaCallout } from "@/lib/mock-full-rca-report";

type FullRcaCalloutBoxProps = {
  callout: FullRcaCallout;
};

/** Soft find/action note — left accent only, no filled “AI callout” card. */
export function FullRcaCalloutBox({ callout }: FullRcaCalloutBoxProps) {
  return (
    <p className="border-l-2 border-brand-400 pl-3 text-sm leading-relaxed text-neutral-800">
      <span className="font-semibold text-foreground">{callout.label}</span>{" "}
      <span className="text-muted-foreground">{callout.body}</span>
    </p>
  );
}
