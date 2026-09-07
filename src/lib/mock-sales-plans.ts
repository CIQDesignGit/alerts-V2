export type PlanStatus = "live" | "archived" | "failed";

export type SalesPlan = {
  id: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
  status: PlanStatus;
  /** Present when status is failed — shown inline in the list */
  errorMessage?: string;
};

export const MOCK_SALES_PLANS: SalesPlan[] = [
  {
    id: "plan-1",
    fileName: "SharkNinja_US_2026_AugSNAP_CIQ_Sales_Plan_v3_final.csv",
    uploadedAt: "2026-09-03T14:22:00Z",
    uploadedBy: "anurag.r@commerceiq.ai",
    status: "live",
  },
  {
    id: "plan-2",
    fileName: "SharkNinja_US_2026_AugSNAP_CIQ_Sales_Plan_v2.csv",
    uploadedAt: "2026-08-30T09:15:00Z",
    uploadedBy: "anurag.r@commerceiq.ai",
    status: "archived",
  },
  {
    id: "plan-3",
    fileName: "SharkNinja_US_2026_AugSNAP_CIQ_Sales_Plan_v1.csv",
    uploadedAt: "2026-08-28T16:40:00Z",
    uploadedBy: "anurag.r@commerceiq.ai",
    status: "failed",
    errorMessage:
      "Row 142: Invalid SKU format. Row 891: Target units must be a positive number.",
  },
  {
    id: "plan-4",
    fileName: "SharkNinja_US_2026_AugSNAP_CIQ_Sales_Plan_v1.csv",
    uploadedAt: "2026-08-25T11:05:00Z",
    uploadedBy: "anurag.r@commerceiq.ai",
    status: "archived",
  },
  {
    id: "plan-5",
    fileName: "SharkNinja_US_2026_AugSNAP_CIQ_Sales_Plan_v1.csv",
    uploadedAt: "2026-08-22T08:30:00Z",
    uploadedBy: "anurag.r@commerceiq.ai",
    status: "archived",
  },
];

export function formatPlanDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

/** Recompute live status — only the newest successful upload is live. */
export function withLiveStatus(plans: SalesPlan[]): SalesPlan[] {
  const sorted = [...plans].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
  const newestSuccessId = sorted.find((p) => p.status !== "failed")?.id;

  return plans.map((plan) => {
    if (plan.status === "failed") return plan;
    return {
      ...plan,
      status: plan.id === newestSuccessId ? "live" : "archived",
    };
  });
}

export const UPLOAD_ERROR_MESSAGES = [
  "Row 142: Invalid SKU format. Row 891: Target units must be a positive number.",
  "Missing required column 'Target Sales $'. Download the template and try again.",
  "File exceeds 10 MB limit. Split the plan or remove unused columns.",
] as const;

export const CURRENT_USER_EMAIL = "anurag.r@commerceiq.ai";
