"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { FullRcaReport } from "@/components/sku-rca/full-rca-report";
import type { FullRcaReportData } from "@/lib/mock-full-rca-report";

export type SkuAllyChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      kind: "full-rca";
      report: FullRcaReportData;
    }
  | { id: string; role: "assistant"; kind: "text"; text: string };

type SkuAllyChatThreadProps = {
  messages: SkuAllyChatMessage[];
};

/** Simple AllyAI message list rendered under the SKU body content. */
export function SkuAllyChatThread({ messages }: SkuAllyChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Scroll the latest Ally reply into view when the thread grows
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
                <p className="max-w-[90%] rounded-2xl bg-brand-50 px-3.5 py-2.5 text-sm text-foreground">
                  {message.text}
                </p>
              </div>
            ) : message.kind === "full-rca" ? (
              <FullRcaReport report={message.report} />
            ) : (
              <div className="flex justify-start">
                <p className="max-w-[90%] rounded-2xl border border-border bg-neutral-50 px-3.5 py-2.5 text-sm text-foreground">
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
