/** One Ally “thinking” step while Gap to Plan analysis runs. */
export type AllyProcessingStep = {
  id: string;
  /** Short label shown in the live / expanded trail */
  label: string;
  /** Placeholder detail when the user expands this step */
  detail: string;
};

/** Fixed 5-step trail for “Run Gap to Plan Analysis for the last week”. */
export const GAP_TO_PLAN_PROCESSING_STEPS: AllyProcessingStep[] = [
  {
    id: "sales-vs-plan",
    label: "Last week's sales versus plan",
    detail:
      "Compared last week’s booked sales to the weekly plan target for this entity.",
  },
  {
    id: "weekly-revenue",
    label: "Weekly revenue vs plan (sales facts)",
    detail:
      "Pulled weekly revenue facts and measured the dollar gap to plan.",
  },
  {
    id: "loading-boundary",
    label: "Data loading boundary",
    detail:
      "Checked how complete recent days are so partial days aren’t treated as full performance.",
  },
  {
    id: "daily-revenue",
    label: "Daily revenue to find loading boundary",
    detail:
      "Scanned daily revenue to find where data drops off or is still loading.",
  },
  {
    id: "eight-week-trend",
    label: "8-week revenue trend",
    detail:
      "Reviewed the last 8 weeks of revenue to put last week’s gap in context.",
  },
];

/** Total mock processing time for Gap to Plan (5 × 2s). Temp 10s for review — revert to 4000 before push. */
export const GAP_TO_PLAN_PROCESSING_MS = 10000;

/** Time each step stays “active” before advancing. */
export const GAP_TO_PLAN_STEP_MS =
  GAP_TO_PLAN_PROCESSING_MS / GAP_TO_PLAN_PROCESSING_STEPS.length;
