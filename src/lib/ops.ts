/**
 * Ordered Product Sales (OPS) helpers for Alerts lists.
 * Prototype only — real OPS would come from the backend.
 */

/** Stable mock 30-day OPS for a SKU — same numbers as the CSV export. */
export function skuOpsDollars(sku: { asin: string }): number {
  let hash = 0;
  for (const ch of sku.asin) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  // Keep values in the same ballpark as the product sample (~130k–210k)
  return 130_000 + (hash % 80_000);
}

export function sumOpsDollars(skus: { asin: string }[]): number {
  return skus.reduce((sum, sku) => sum + skuOpsDollars(sku), 0);
}

/**
 * Issue / category header total.
 * Mock lists often show skuCount larger than the SKUs we actually store —
 * scale the listed average up so the header matches the count.
 */
export function rolledUpOpsDollars(
  skus: { asin: string }[],
  skuCount: number,
): number {
  const listed = sumOpsDollars(skus);
  if (skuCount <= skus.length || skus.length === 0) return listed;
  return Math.round((listed / skus.length) * skuCount);
}

/** Compact sales amount — $33.0M, $162.4K, $840. No +/− (OPS is not a gap). */
export function formatOpsDollars(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(1)}K`;
  return `$${abs.toLocaleString()}`;
}
