"use client";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import {
  IssueDetailTableHeader,
  issueDetailTable,
  issueTd,
  issueTh,
} from "@/components/issue-sku-detail/issue-detail-table";
import type { DealPageTopProduct } from "@/lib/mock-issue-sku-detail";

type DealPageTopProductsProps = {
  pageLabel: string;
  products: DealPageTopProduct[];
};

/** Other products occupying the first fold of the deals page. */
export function DealPageTopProducts({
  pageLabel,
  products,
}: DealPageTopProductsProps) {
  return (
    <div className={issueDetailTable.frame}>
      <IssueDetailTableHeader
        title="Top 10 on this deals page"
        meta={
          <span className="text-sm font-semibold text-foreground">
            {pageLabel}
          </span>
        }
      />
      <div className={issueDetailTable.scroll}>
        <table className={issueDetailTable.table}>
          <thead>
            <tr className={issueDetailTable.headRow}>
              <th className={issueTh("right", "w-12")}>
                <span className={issueDetailTable.thCellRight}>#</span>
              </th>
              <th className={issueTh()}>
                <span className={issueDetailTable.thCell}>Product</span>
              </th>
              <th className={issueTh()}>
                <span className={issueDetailTable.thCell}>Brand</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.rank} className={issueDetailTable.row}>
                <td className={issueTd("right")}>
                  <span className={issueDetailTable.cellRight}>
                    {product.rank}
                  </span>
                </td>
                <td className={issueTd()}>
                  <span className={`${issueDetailTable.cell} gap-2.5`}>
                    <SkuThumbnail name={product.name} size={32} />
                    <span>{product.name}</span>
                  </span>
                </td>
                <td className={issueTd()}>
                  <span className={issueDetailTable.cell}>{product.brand}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
