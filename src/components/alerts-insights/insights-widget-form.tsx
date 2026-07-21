"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type WidgetFormProps = {
  initialTitle?: string;
  initialPrompt?: string;
  submitLabel: string;
  onSubmit: (title: string, prompt: string) => void;
  onCancel: () => void;
};

export function InsightsWidgetForm({
  initialTitle = "",
  initialPrompt = "",
  submitLabel,
  onSubmit,
  onCancel,
}: WidgetFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [prompt, setPrompt] = useState(initialPrompt);

  return (
    <form
      className="flex flex-col gap-2 rounded-lg border border-brand-200 bg-brand-50/40 p-3 sm:col-span-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(title, prompt);
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Widget title"
        className="h-8 rounded-md border border-border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What should AllyAI show historically?"
        rows={2}
        className="resize-none rounded-md border border-border bg-background px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <div className="flex justify-end gap-1.5">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
