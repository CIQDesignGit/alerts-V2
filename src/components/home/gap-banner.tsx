import { formatGapDollars } from "@/lib/mock-home-data";

type GapBannerProps = {
  gapDollars: number;
  gapUnits: number;
};

export function GapBanner({ gapDollars, gapUnits }: GapBannerProps) {
  return (
    <section className="rounded-xl border border-border bg-neutral-50 px-5 py-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Overall business Gap to plan
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-3">
        <p className="font-mono text-3xl font-bold tracking-tight text-error-600">
          {formatGapDollars(gapDollars)}
        </p>
        <p className="text-sm text-muted-foreground">
          {gapUnits.toLocaleString()} units behind target
        </p>
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        Biggest gaps are already ranked below — start with the top brand.
      </p>
    </section>
  );
}
