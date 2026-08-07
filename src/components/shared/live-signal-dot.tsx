import { cn } from "@/lib/utils";

type LiveSignalDotProps = {
  className?: string;
};

/** Pulsing live indicator used on Live right now / Key insights headers */
export function LiveSignalDot({ className }: LiveSignalDotProps) {
  return (
    <span
      className={cn(
        "relative flex size-4 shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <span className="live-signal-halo absolute size-3 rounded-full bg-error-500" />
      <span className="relative size-2 rounded-full bg-error-500" />
    </span>
  );
}
