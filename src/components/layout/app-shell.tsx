"use client";

import { useState } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopBar } from "@/components/layout/top-bar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  // Platform chrome starts collapsed (matches CIQ Alerts & insights view)
  const [collapsed, setCollapsed] = useState(true);

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
