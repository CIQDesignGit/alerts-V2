import { cn } from "@/lib/utils";

export function LiveMetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neg" | "pos" | "neutral";
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-lg font-bold",
          tone === "neg" && "text-error-600",
          tone === "pos" && "text-success-600",
          tone === "neutral" && "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function formatSignedInt(n: number): string {
  if (n > 0) return `+${n.toLocaleString()}`;
  return n.toLocaleString();
}

export function formatAsp(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toFixed(1)}`;
}
