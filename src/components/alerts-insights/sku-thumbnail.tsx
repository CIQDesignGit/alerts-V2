import { cn } from "@/lib/utils";

type SkuThumbnailProps = {
  name: string;
  /** Width & height in pixels — default 40 for list/table rows */
  size?: number;
  className?: string;
};

/** Product photos in /public/assets/sku — assigned by name hash (stable “random”). */
const SKU_IMAGE_SRCS = [
  "/assets/sku/sku-01-bosch-canister.png",
  "/assets/sku/sku-02-bissell-upright.png",
  "/assets/sku/sku-03-dyson-head.png",
  "/assets/sku/sku-04-dynavac-industrial.png",
  "/assets/sku/sku-05-domestica-stick.png",
  "/assets/sku/sku-06-robot-vacuum.png",
] as const;

function imageSrcForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % SKU_IMAGE_SRCS.length;
  }
  return SKU_IMAGE_SRCS[hash];
}

function sizeClass(size: number) {
  if (size >= 96) return "size-24"; // 96px
  if (size >= 80) return "size-20"; // 80px — expanded RCA header
  if (size >= 64) return "size-16"; // 64px
  if (size >= 56) return "size-14"; // 56px
  if (size >= 40) return "size-10"; // 40px
  if (size >= 32) return "size-8"; // 32px — collapsed RCA header
  return "size-9"; // 36px
}

/** SKU product thumbnail — picks one of the shared asset photos from the name. */
export function SkuThumbnail({ name, size = 40, className }: SkuThumbnailProps) {
  return (
    // Local static assets — same pattern as other /public images in this app
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrcForName(name)}
      alt={`${name} thumbnail`}
      width={size}
      height={size}
      className={cn(
        "inline-block shrink-0 rounded-sm border border-neutral-200/50 bg-neutral-100 object-cover",
        sizeClass(size),
        className,
      )}
    />
  );
}
