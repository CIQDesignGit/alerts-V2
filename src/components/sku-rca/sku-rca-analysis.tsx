import type { RcaAnalysisBlock } from "@/lib/mock-sku-rca";

type SkuRcaAnalysisProps = {
  blocks: RcaAnalysisBlock[];
};

export function SkuRcaAnalysis({ blocks }: SkuRcaAnalysisProps) {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-foreground">Analysis</h3>
      {blocks.map((block) => (
        <div key={block.heading} className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold text-foreground">
            {block.heading}
          </h4>
          <p className="text-sm leading-relaxed text-neutral-600">{block.body}</p>
        </div>
      ))}
    </section>
  );
}
