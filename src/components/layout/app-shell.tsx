"use client";

import { useEffect, useState } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopBar } from "@/components/layout/top-bar";

type AppShellProps = {
  children: React.ReactNode;
};

/** SSR + first client paint — shell placeholders (no Lucide SVGs) to avoid hydration drift. */
function AppShellPlaceholder({ children }: AppShellProps) {
  return (
    <div
      data-app-shell
      className="relative flex h-screen overflow-hidden bg-background"
    >
      <aside
        className="relative h-full w-3 shrink-0 bg-shell"
        aria-label="Navigation"
      >
        <div
          className="absolute top-2.5 -right-3.5 z-30 size-7 rounded-full bg-shell-accent shadow-md"
          aria-hidden
        />
      </aside>
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <header
          className="h-12 shrink-0 border-b border-border bg-background"
          aria-hidden
        />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  // Platform chrome starts collapsed (matches CIQ Alerts & insights view)
  const [collapsed, setCollapsed] = useState(true);
  const [shellReady, setShellReady] = useState(false);

  useEffect(() => {
    setShellReady(true);
  }, []);

  if (!shellReady) {
    return <AppShellPlaceholder>{children}</AppShellPlaceholder>;
  }

  return (
    <div
      data-app-shell
      className="relative flex h-screen overflow-hidden bg-background"
    >
      <SidebarNav
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
