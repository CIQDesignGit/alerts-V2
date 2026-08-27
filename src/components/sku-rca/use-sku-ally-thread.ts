"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { IssueKey } from "@/components/alerts/issue-names";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import type { SkuAllyChatMessage } from "@/components/sku-rca/sku-ally-chat-thread";
import { getAllyChipReply } from "@/lib/ally-chip-replies";
import {
  GAP_TO_PLAN_PROCESSING_STEPS,
  GAP_TO_PLAN_STEP_MS,
} from "@/lib/ally-processing-steps";
import {
  isGapToPlanPrompt,
  isScrapeHistoryPrompt,
  type AllyAiPrompt,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { getFullRcaReport, type FullRcaReportContext } from "@/lib/mock-full-rca-report";
import {
  getLastWeekTrend,
  hasLastWeekTrendCard,
  isLastSevenDayTrendPrompt,
  resolveTrendIssueFromPrompt,
} from "@/lib/mock-last-week-trend";
import { getScrapeHistoryData } from "@/lib/mock-scrape-history";

type UseSkuAllyThreadOptions = {
  /** When set (issue SKU pages), trend replies can target that issue */
  issueKey?: IssueKey;
  /** Taxonomy Overall / Brand / Category — shapes the Gap to Plan header */
  reportScope?: FullRcaReportContext;
};

/** Brief pause so the dots feel like Ally is thinking (non–Gap-to-Plan chips) */
const THINKING_MS = 750;

/**
 * AllyAI reply for SKU, issue-aggregate, and taxonomy RCA surfaces.
 * Each chip click shows only that prompt + one reply (replaces any prior pair).
 */
export function useSkuAllyThread(
  sku: IssueSku,
  { issueKey, reportScope }: UseSkuAllyThreadOptions = {},
) {
  const [messages, setMessages] = useState<SkuAllyChatMessage[]>([]);
  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Stop any in-flight thinking / step timers */
  const clearTimers = useCallback(() => {
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
  }, []);

  // Clear Ally chat when you switch taxonomy / SKU so an old Gap to Plan
  // title (e.g. CleanPro) does not stick around on Floor Care
  useEffect(() => {
    clearTimers();
    setMessages([]);
  }, [clearTimers, reportScope?.entityName, reportScope?.level, sku.id]);

  // Clear timers if this screen unmounts
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  /** Build the Ally reply for this prompt (mock router — not a real model) */
  const buildReply = useCallback(
    (trimmed: string, stamp: number): SkuAllyChatMessage => {
      const isFullRca = isGapToPlanPrompt(trimmed);

      if (isFullRca) {
        return {
          id: `rca-${stamp}`,
          role: "assistant",
          kind: "full-rca",
          report: getFullRcaReport(sku, reportScope),
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

      // Same 7-day grid as the header modal — shown inline in the thread
      if (isScrapeHistoryPrompt(trimmed)) {
        return {
          id: `scrape-${stamp}`,
          role: "assistant",
          kind: "scrape-history",
          scrapeHistory: getScrapeHistoryData(sku.asin, sku.name),
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
    [issueKey, reportScope, sku],
  );

  /** Gap to Plan: 5-step trail over 4s, then collapsed trail + full report */
  const startGapToPlanProcessing = useCallback(
    (
      userMessage: Extract<SkuAllyChatMessage, { role: "user" }>,
      stamp: number,
    ) => {
      const processingId = `processing-${stamp}`;
      const steps = GAP_TO_PLAN_PROCESSING_STEPS;
      const report = buildReply(userMessage.text, stamp);

      setMessages([
        userMessage,
        {
          id: processingId,
          role: "assistant",
          kind: "processing",
          steps,
          activeIndex: 0,
          status: "running",
        },
      ]);

      let stepIndex = 0;
      stepIntervalRef.current = setInterval(() => {
        stepIndex += 1;

        if (stepIndex >= steps.length) {
          clearTimers();
          // Keep trail (done) above the Gap to Plan report
          setMessages([
            userMessage,
            {
              id: processingId,
              role: "assistant",
              kind: "processing",
              steps,
              activeIndex: steps.length - 1,
              status: "done",
            },
            report,
          ]);
          return;
        }

        setMessages([
          userMessage,
          {
            id: processingId,
            role: "assistant",
            kind: "processing",
            steps,
            activeIndex: stepIndex,
            status: "running",
          },
        ]);
      }, GAP_TO_PLAN_STEP_MS);
    },
    [buildReply, clearTimers],
  );

  /** Show the question right away, then thinking / processing, then the answer */
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const stamp = Date.now();
      const userMessage: Extract<SkuAllyChatMessage, { role: "user" }> = {
        id: `user-${stamp}`,
        role: "user",
        text: trimmed,
      };

      clearTimers();

      const isFullRca = isGapToPlanPrompt(trimmed);

      if (isFullRca) {
        startGapToPlanProcessing(userMessage, stamp);
        return;
      }

      const reply = buildReply(trimmed, stamp);

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
    [buildReply, clearTimers, startGapToPlanProcessing],
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
