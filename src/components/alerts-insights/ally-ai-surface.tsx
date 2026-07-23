import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AllyAiSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Shared AllyAI card chrome — soft brand gradient shell.
 * Pair with AllyAiHeader for the avatar + label row.
 */
export function AllyAiSurface({
  children,
  className,
  contentClassName,
}: AllyAiSurfaceProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border border-brand-200/60 bg-linear-to-r from-background via-brand-50 to-brand-100 shadow-xs",
        className,
      )}
    >
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}

type AllyAiHeaderProps = {
  /** Title next to the Ally avatar */
  label: string;
  /** Optional line under the title (e.g. date range) */
  subtitle?: string;
};

/** Ally avatar + title (optional subtitle) — use inside AllyAiSurface. */
export function AllyAiHeader({ label, subtitle }: AllyAiHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 shrink-0 overflow-hidden rounded-lg bg-white">
        <img
          src="/ally-avatar.png"
          alt=""
          className="size-full object-cover"
        />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-md font-medium text-neutral-800">{label}</p>
        {subtitle ? (
          <p className="text-2xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
