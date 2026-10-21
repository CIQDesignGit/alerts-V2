"use client";

import dynamic from "next/dynamic";

/** Alerts UI is mock/client-only — skip SSR to avoid hydration drift on filters and icons. */
export const HomePageClient = dynamic(
  () =>
    import("@/components/home/home-page").then((mod) => ({
      default: mod.HomePage,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading alerts…
      </div>
    ),
  },
);
