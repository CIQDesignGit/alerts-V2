"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Atom,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Lightbulb,
  Mail,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";

import { CommerceIqLogo } from "@/components/layout/commerceiq-logo";
import { RegionRetailer } from "@/components/layout/region-retailer";
import {
  SHELL_NAV_ITEMS,
  type ShellNavItem,
} from "@/components/layout/shell-nav-items";
import { SkuSearch } from "@/components/layout/sku-search";
import { cn } from "@/lib/utils";

const ICONS = {
  command: Atom,
  building: Building2,
  lightbulb: Lightbulb,
  sparkles: Sparkles,
  mail: Mail,
  message: MessageSquare,
  file: FileText,
} as const;

type SidebarNavProps = {
  collapsed: boolean;
  onToggle: () => void;
};

function isItemActive(pathname: string, item: ShellNavItem) {
  if (item.match === "exact") {
    return pathname === item.href || pathname.startsWith("/alerts");
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SidebarNav({ collapsed, onToggle }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex h-full shrink-0 flex-col bg-shell text-shell-foreground transition-[width] duration-200",
        collapsed ? "w-3" : "w-60",
      )}
    >
      {/* Expand / collapse — sits on the sidebar edge (CIQ chrome) */}
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggle}
        className="absolute top-2.5 -right-3.5 z-30 flex size-7 items-center justify-center rounded-full bg-shell-accent text-white shadow-md"
      >
        {collapsed ? (
          <ChevronsRight className="size-3.5" />
        ) : (
          <ChevronsLeft className="size-3.5" />
        )}
      </button>

      {/* Expanded shell contents — hidden when collapsed */}
      {!collapsed && (
        <>
          <div className="flex h-14 items-center px-4">
            <CommerceIqLogo />
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <RegionRetailer />
            <SkuSearch />
          </div>

          <div className="mt-5 flex min-h-0 flex-1 flex-col px-3">
            <div className="mb-2 px-1">
              <p className="text-2xs font-semibold tracking-wider text-shell-section uppercase">
                My Workspace
              </p>
              <p className="mt-1 flex items-center gap-1 text-2xs text-shell-muted">
                <Star className="size-3 fill-shell-section text-shell-section" />
                Star any page for easy access
              </p>
            </div>

            <nav aria-label="My Workspace" className="flex flex-col gap-0.5">
              {SHELL_NAV_ITEMS.map((item) => {
                const Icon = ICONS[item.icon];
                const active = isItemActive(pathname, item);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-shell-accent text-white"
                        : "text-shell-foreground/90 hover:bg-shell-hover",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-success-500 px-1.5 py-0.5 text-2xs font-semibold tracking-wide text-white uppercase">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </aside>
  );
}
