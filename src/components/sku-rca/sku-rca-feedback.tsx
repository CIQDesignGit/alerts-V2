"use client";

import { ContentFeedback } from "@/components/shared/content-feedback";

type SkuRcaFeedbackProps = {
  /** ASIN (or similar) so feedback resets when the SKU changes */
  feedbackKey: string;
};

/** SKU-level diagnosis feedback — wraps shared ContentFeedback. */
export function SkuRcaFeedback({ feedbackKey }: SkuRcaFeedbackProps) {
  return (
    <ContentFeedback
      variant="subtle"
      feedbackKey={feedbackKey}
      surface="sku-rca"
      title="Was this alert helpful?"
      positiveChips={[
        "Accurate diagnosis",
        "Clear next steps",
        "Actionable recommendations",
        "Right SKU context",
        "Saved me time",
      ]}
      negativeChips={[
        "Wrong root cause",
        "Missing context",
        "Unclear actions",
        "Outdated data",
        "Not relevant",
      ]}
    />
  );
}
