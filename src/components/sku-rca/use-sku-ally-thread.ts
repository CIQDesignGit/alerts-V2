"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { IssueKey } from "@/components/alerts/issue-names";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import type { SkuAllyChatMessage } from "@/components/sku-rca/sku-ally-chat-thread";
import { getAllyChipReply } from "@/lib/ally-chip-replies";
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

/** Brief pause so the dots feel like Ally is thinking */
const THINKING_MS = 750;

/**
 * AllyAI reply for SKU, issue-aggregate, and taxonomy RCA surfaces.
 * Each chip click shows only that prompt + one reply (replaces any prior pair).
 */
export function useSkuAllyThread(
  sku: IssueSku,
  { issueKey }: UseSkuAllyThreadOptions = {},
) {
  const [messages, setMessages] = useState<SkuAllyChatMessage[]>([]);
  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the delay timer if this screen unmounts
  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    };
  }, []);

  /** Build the Ally reply for this prompt (mock router — not a real model) */
  const buildReply = useCallback(
    (trimmed: string, stamp: number): SkuAllyChatMessage => {
      const isFullRca =
        trimmed === FULL_RCA_LAST_WEEK_PROMPT.prompt ||
        /full root cause analysis/i.test(trimmed);

      if (isFullRca) {
        return {
          id: `rca-${stamp}`,
          role: "assistant",
          kind: "full-rca",
          report: getFullRcaReport(sku),
        };
      }

      if (isLastSevenDayTrendPrompt(trimmed)) {
        const trendIssue = resolveTrendIssueFromPrompt(trimmed, issueKey);
        const trend =
          trendIssue && hasLastWeekTrendCard(trendIssue)
            ? getLastWeekTrend(trendIssue, sku)
            : null;

        if (trend) {
          return {
            id: `trend-${stamp}`,
            role: "assistant",
            kind: "last-week-trend",
            trend,
          };
        }

        const issueLabel = trendIssue
          ? ISSUE_NAMES[trendIssue].filter
          : "this issue";
        return {
          id: `ally-${stamp}`,
          role: "assistant",
          kind: "text",
          text: `I don’t have a last-7-day trend card for ${issueLabel} yet. Try another issue’s “changed in 7 days” prompt, or pick a different Explore more suggestion.`,
        };
      }

      // Chip-specific mock copy (2–3 lines) when we have it
      const chipReply = getAllyChipReply(trimmed);
      return {
        id: `ally-${stamp}`,
        role: "assistant",
        kind: "text",
        text:
          chipReply ??
          "Got it — I’m reviewing this alert. Ask a follow-up from Explore more above.",
      };
    },
    [issueKey, sku],
  );

  /** Show the question right away, dots while “thinking”, then the answer */
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
      const reply = buildReply(trimmed, stamp);

      // Cancel any in-flight thinking delay from a prior chip click
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);

      setMessages([
        userMessage,
        {
          id: `thinking-${stamp}`,
          role: "assistant",
          kind: "thinking",
        },
      ]);

      thinkingTimerRef.current = setTimeout(() => {
        setMessages([userMessage, reply]);
        thinkingTimerRef.current = null;
      }, THINKING_MS);
    },
    [buildReply],
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
