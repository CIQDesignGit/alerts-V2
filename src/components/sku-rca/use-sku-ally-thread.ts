"use client";

import { useCallback, useState } from "react";

import type { SkuAllyChatMessage } from "@/components/sku-rca/sku-ally-chat-thread";
import {
  FULL_RCA_LAST_WEEK_PROMPT,
  type AllyAiPrompt,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { getFullRcaReport } from "@/lib/mock-full-rca-report";

/**
 * AllyAI chat thread for SKU, issue-aggregate, and taxonomy RCA surfaces.
 * Suggested chips send straight into the thread (no floating composer).
 */
export function useSkuAllyThread(sku: IssueSku) {
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
    [sku],
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
