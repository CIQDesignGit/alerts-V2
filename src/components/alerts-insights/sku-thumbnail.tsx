import { cn } from "@/lib/utils";

type SkuThumbnailProps = {
  name: string;
  /** Width & height in pixels — default 40 for list/table rows */
  size?: number;
};

/**
 * Soft pastel washes — very light so they don’t compete with text.
 * Each SKU name maps to a stable variant (same product = same gradient).
 */
const PASTEL_CLASSES = [
  // blue → yellow
  "bg-[linear-gradient(135deg,#eef3fb_0%,#fbf7ea_100%)]",
  "bg-[linear-gradient(160deg,#f0f5fc_0%,#faf5e6_55%,#f8f1e0_100%)]",
  // pink → green
  "bg-[linear-gradient(135deg,#faf0f4_0%,#eef6f0_100%)]",
  "bg-[linear-gradient(150deg,#f9eef3_0%,#f2f8f3_60%,#ebf4ee_100%)]",
  // peach → purple
  "bg-[linear-gradient(135deg,#fbf1e9_0%,#f3eef8_100%)]",
  "bg-[linear-gradient(145deg,#faf0e8_0%,#f5f0f9_50%,#eee8f5_100%)]",
] as const;

function pastelClassForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % PASTEL_CLASSES.length;
  }
  return PASTEL_CLASSES[hash];
}

function sizeClass(size: number) {
  if (size >= 56) return "size-14"; // 56px
  if (size >= 40) return "size-10"; // 40px
  return "size-9"; // 36px
}

/** Placeholder product image until real SKU art is wired up */
export function SkuThumbnail({ name, size = 40 }: SkuThumbnailProps) {
  return (
    <span
      role="img"
      aria-label={`${name} thumbnail`}
      className={cn(
        "inline-block shrink-0 rounded-sm border border-neutral-200/50",
        sizeClass(size),
        pastelClassForName(name),
      )}
    />
  );
}
