"use client";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import { DealPageSelect } from "@/components/issue-sku-detail/deal-page-select";
import {
  IssueDetailTableHeader,
  issueDetailTable,
  issueTd,
  issueTh,
} from "@/components/issue-sku-detail/issue-detail-table";
import type {
  DealPageOption,
  DealPageTopProduct,
} from "@/lib/mock-issue-sku-detail";
import { cn } from "@/lib/utils";

type DealPageTopProductsProps = {
  pages: DealPageOption[];
  pageId: string;
  onPageChange: (pageId: string) => void;
  products: DealPageTopProduct[];
};

/** Other products occupying the first fold of the selected deals page. */
export function DealPageTopProducts({
  pages,
  pageId,
  onPageChange,
  products,
}: DealPageTopProductsProps) {
  return (
    <div className={cn(issueDetailTable.frame, "overflow-visible")}>
      <IssueDetailTableHeader
        title="Top 10 on this deals page"
        meta={
          <div className="flex items-center gap-2">
            <span>Deals page</span>
            <DealPageSelect
              pages={pages}
              value={pageId}
              onChange={onPageChange}
            />
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className={issueDetailTable.table}>
          <thead className="bg-neutral-50">
            <tr className={issueDetailTable.headRow}>
              <th className={issueTh("right", "w-12 align-middle py-0")}>
                <span className="flex h-8 items-center justify-end leading-none">
                  #
                </span>
              </th>
              <th className={issueTh("left", "align-middle py-0")}>
                <span className="flex h-8 items-center leading-none">
                  Product
                </span>
              </th>
              <th className={issueTh("left", "align-middle py-0")}>
                <span className="flex h-8 items-center leading-none">
                  Brand
                </span>
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
