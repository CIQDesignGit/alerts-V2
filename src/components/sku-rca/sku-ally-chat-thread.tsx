"use client";

import { useEffect, useRef } from "react";

import { ContentFeedback } from "@/components/shared/content-feedback";
import { AllyProcessingTrail } from "@/components/sku-rca/ally-processing-trail";
import { FullRcaReport } from "@/components/sku-rca/full-rca-report";
import { LastWeekTrendCard } from "@/components/sku-rca/last-week-trend-card";
import type { AllyProcessingStep } from "@/lib/ally-processing-steps";
import type { FullRcaReportData } from "@/lib/mock-full-rca-report";
import type { LastWeekTrendData } from "@/lib/mock-last-week-trend";

export type SkuAllyChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      kind: "full-rca";
      report: FullRcaReportData;
    }
  | {
      id: string;
      role: "assistant";
      kind: "last-week-trend";
      trend: LastWeekTrendData;
    }
  | { id: string; role: "assistant"; kind: "text"; text: string }
  | { id: string; role: "assistant"; kind: "thinking" }
  | {
      id: string;
      role: "assistant";
      kind: "processing";
      steps: AllyProcessingStep[];
      activeIndex: number;
      status: "running" | "done";
    };

type SkuAllyChatThreadProps = {
  messages: SkuAllyChatMessage[];
};

/** Three bouncing dots — shown while Ally is “processing” a chip reply */
function ThinkingDots() {
  return (
    <div
      className="flex justify-start"
      role="status"
      aria-live="polite"
      aria-label="AllyAI is thinking"
    >
      <div className="inline-flex items-center gap-1.5 px-0 py-1">
        <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-neutral-400" />
      </div>
    </div>
  );
}

/** AllyAI message list — one question + reply (or processing trail) at a time. */
export function SkuAllyChatThread({ messages }: SkuAllyChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the latest bubble / card in view when the reply changes
  useEffect(() => {
    if (messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, messages.at(-1)?.id, messages.at(-1)]);

  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <h3 className="text-sm font-semibold tracking-tight text-neutral-800">
        Chat with Ally AI
      </h3>

      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {messages.map((message) => (
          <li key={message.id}>
            {message.role === "user" ? (
              <div className="flex justify-end">
                {/* User ask: keep boxed bubble; sharp top-right corner */}
                <p className="max-w-[90%] rounded-2xl rounded-br-sm border border-brand-200/80 bg-brand-50 px-3.5 py-2.5 text-sm text-foreground">
                  {message.text}
                </p>
              </div>
            ) : message.kind === "thinking" ? (
              <ThinkingDots />
            ) : message.kind === "processing" ? (
              <AllyProcessingTrail
                steps={message.steps}
                activeIndex={message.activeIndex}
                status={message.status}
              />
            ) : message.kind === "full-rca" ? (
              <div className="flex flex-col gap-4">
                <FullRcaReport report={message.report} />
                <ContentFeedback
                  variant="subtle"
                  feedbackKey={`${message.id}:${message.report.headerTitle}`}
                  surface="gap-to-plan"
                  contextLabel={message.report.headerTitle}
                  title="Was this Gap to Plan analysis helpful?"
                  positiveChips={[
                    "Clear priorities",
                    "Useful $ impact",
                    "Actionable recommendations",
                    "Good context",
                    "Saved me time",
                  ]}
                  negativeChips={[
                    "Wrong root cause",
                    "Missing context",
                    "Unclear actions",
                    "Numbers seem off",
                    "Not relevant",
                  ]}
                />
              </div>
            ) : message.kind === "last-week-trend" ? (
              <LastWeekTrendCard trend={message.trend} />
            ) : (
              <div className="flex justify-start">
                {/* Ally reply: plain text — no border / fill; sharp bottom-left */}
                <p className="max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-sm px-0 py-1 text-sm text-foreground">
                  {message.text}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div ref={endRef} aria-hidden />
    </div>
  );
}
