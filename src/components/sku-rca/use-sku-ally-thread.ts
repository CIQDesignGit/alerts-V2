"use client";

import { useCallback, useState } from "react";

import type { IssueKey } from "@/components/alerts/issue-names";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import type { SkuAllyChatMessage } from "@/components/sku-rca/sku-ally-chat-thread";
import {
  FULL_RCA_LAST_WEEK_PROMPT,
  type AllyAiPrompt,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { getFullRcaReport } from "@/lib/mock-full-rca-report";
import {
  getLastWeekTrend,
  hasLastWeekTrendCard,
  isLastSevenDayTrendPrompt,
  resolveTrendIssueFromPrompt,
} from "@/lib/mock-last-week-trend";

type UseSkuAllyThreadOptions = {
  /** When set (issue SKU pages), trend replies can target that issue */
  issueKey?: IssueKey;
};

/**
 * AllyAI chat thread for SKU, issue-aggregate, and taxonomy RCA surfaces.
 * Suggested chips send straight into the thread (no floating composer).
 */
export function useSkuAllyThread(
  sku: IssueSku,
  { issueKey }: UseSkuAllyThreadOptions = {},
) {
  const [messages, setMessages] = useState<SkuAllyChatMessage[]>([]);

  /** Push a user message + Ally reply into the thread */
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const stamp = Date.now();
      const userMessage: SkuAllyChatMessage = {
        id: `user-${stamp}`,
        role: "user",
        text: trimmed,
      };

      // Same full-RCA wording as the chip → rich report card
      const isFullRca =
        trimmed === FULL_RCA_LAST_WEEK_PROMPT.prompt ||
        /full root cause analysis/i.test(trimmed);

      if (isFullRca) {
        setMessages([
          userMessage,
          {
            id: `rca-${stamp}`,
            role: "assistant",
            kind: "full-rca",
            report: getFullRcaReport(sku),
          },
        ]);
        return;
      }

      // “How has {Issue} changed in 7 days?” → last-week trend card (when designed)
      if (isLastSevenDayTrendPrompt(trimmed)) {
        const trendIssue = resolveTrendIssueFromPrompt(trimmed, issueKey);
        const trend =
          trendIssue && hasLastWeekTrendCard(trendIssue)
            ? getLastWeekTrend(trendIssue, sku)
            : null;

        if (trend) {
          setMessages((prev) => [
            ...prev,
            userMessage,
            {
              id: `trend-${stamp}`,
              role: "assistant",
              kind: "last-week-trend",
              trend,
            },
          ]);
          return;
        }

        const issueLabel = trendIssue
          ? ISSUE_NAMES[trendIssue].filter
          : "this issue";
        setMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: `ally-${stamp}`,
            role: "assistant",
            kind: "text",
            text: `I don’t have a last-7-day trend card for ${issueLabel} yet. Try another issue’s “changed in 7 days” prompt, or pick a different Explore more suggestion.`,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: `ally-${stamp}`,
          role: "assistant",
          kind: "text",
          text: "Got it — I’m reviewing this alert. Ask a follow-up from Explore more above.",
        },
      ]);
    },
    [issueKey, sku],
  );

  const onPromptSelect = useCallback(
    (prompt: AllyAiPrompt) => {
      sendMessage(prompt.prompt);
    },
    [sendMessage],
  );

  return {
    messages,
    onPromptSelect,
  };
}
