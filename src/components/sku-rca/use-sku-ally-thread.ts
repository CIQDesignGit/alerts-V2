"use client";

import { useCallback, useState } from "react";

import type { SkuAllyChatMessage } from "@/components/sku-rca/sku-ally-chat-thread";
import {
  FULL_RCA_LAST_WEEK_PROMPT,
  type AllyAiPrompt,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { getFullRcaReport } from "@/lib/mock-full-rca-report";

type PromptSelectResult = "seed" | "sent";

/**
 * AllyAI chat thread for SKU, issue-aggregate, and taxonomy RCA surfaces.
 * The “Run full RCA” chip auto-sends; other chips just fill the chat input.
 */
export function useSkuAllyThread(sku: IssueSku) {
  const [messages, setMessages] = useState<SkuAllyChatMessage[]>([]);
  const [promptSeed, setPromptSeed] = useState<
    { id: string; text: string } | undefined
  >();
  const [chatExpanded, setChatExpanded] = useState(false);

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
        setChatExpanded(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: `ally-${stamp}`,
          role: "assistant",
          kind: "text",
          text: "Got it — I’m reviewing this alert. Ask a follow-up, or try “Run full RCA for the last week” for the full weekly breakdown.",
        },
      ]);
    },
    [sku],
  );

  const onPromptSelect = useCallback(
    (prompt: AllyAiPrompt): PromptSelectResult => {
      // Full RCA chip → show the rich report in the thread right away
      if (prompt.id === FULL_RCA_LAST_WEEK_PROMPT.id) {
        sendMessage(prompt.prompt);
        return "sent";
      }

      // Other chips still just pre-fill the composer
      setPromptSeed({ id: `${prompt.id}-${Date.now()}`, text: prompt.prompt });
      setChatExpanded(true);
      return "seed";
    },
    [sendMessage],
  );

  return {
    messages,
    promptSeed,
    chatExpanded,
    setChatExpanded,
    onPromptSelect,
    sendMessage,
  };
}
