"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { FullRcaReport } from "@/components/sku-rca/full-rca-report";
import { LastWeekTrendCard } from "@/components/sku-rca/last-week-trend-card";
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
  | { id: string; role: "assistant"; kind: "thinking" };

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

/** AllyAI message list — one question + one reply (or thinking dots) at a time. */
export function SkuAllyChatThread({ messages }: SkuAllyChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the latest bubble / card in view when the reply changes
  useEffect(() => {
    if (messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, messages.at(-1)?.id]);

  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-brand-600" aria-hidden />
        <p className="text-xs font-medium text-muted-foreground">
          Conversation with AllyAI
        </p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-4 p-0">
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
            ) : message.kind === "full-rca" ? (
              <FullRcaReport report={message.report} />
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
