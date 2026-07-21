type SkuRcaRecommendationsProps = {
  items: string[];
  /** Hide the list visually while keeping structure for later */
  hidden?: boolean;
};

export function SkuRcaRecommendations({
  items,
  hidden = false,
}: SkuRcaRecommendationsProps) {
  if (hidden) {
    return (
      <section className="hidden" aria-hidden data-sku-rca-recommendations>
        <ol>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-foreground">
        Recommendations
      </h3>
      <ol className="list-decimal space-y-2 pl-5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-neutral-700">
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}
