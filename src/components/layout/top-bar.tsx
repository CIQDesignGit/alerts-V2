"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronRight,
  CircleHelp,
  Download,
  Home,
  Lightbulb,
  MessageCircleWarning,
  Rocket,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const BREADCRUMB_BY_PATH: Record<string, string[]> = {
  "/": ["Agents", "Alerts and insights"],
  "/alerts": ["Agents", "Alerts and insights"],
  "/chat": ["Agents", "Ask Ally"],
  "/settings": ["Settings"],
  "/command-center": ["Agents", "Command Center"],
  "/business-overview": ["Business Overview"],
  "/recommendations": ["Recommendations"],
  "/agentspace": ["Agents", "Agentspace"],
  "/reports": ["Reports"],
};

type UtilityAction = {
  label: string;
  icon: LucideIcon;
  dot?: boolean;
  successDot?: boolean;
};

const utilityActions: UtilityAction[] = [
  { label: "Agent status", icon: Bot, successDot: true },
  { label: "Notifications", icon: Bell, dot: true },
  { label: "Help", icon: CircleHelp },
  { label: "Tips", icon: Lightbulb },
  { label: "Downloads", icon: Download },
  { label: "Analytics", icon: BarChart3 },
  { label: "Updates", icon: Rocket, dot: true },
  { label: "Feedback", icon: MessageCircleWarning },
];

export function TopBar() {
  const pathname = usePathname();
  const crumbs = BREADCRUMB_BY_PATH[pathname] ?? ["Agents"];

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm font-normal text-neutral-500"
      >
        <Link
          href="/"
          aria-label="Home"
          className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-foreground"
        >
          <Home className="size-4" />
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb} className="flex items-center gap-1">
            <ChevronRight className="size-3.5 text-neutral-300" />
            <span className="text-sm font-normal text-neutral-500">{crumb}</span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        {utilityActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="ghost"
              size="icon-sm"
              aria-label={action.label}
              className="relative text-muted-foreground hover:bg-neutral-100"
            >
              <Icon className="size-4" />
              {action.dot && (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-error-500" />
              )}
              {action.successDot && (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-success-500" />
              )}
            </Button>
          );
        })}

        <div
          aria-label="User AB"
          className="ml-1 flex size-7 items-center justify-center rounded-full bg-cyan-500 text-2xs font-semibold tracking-wide text-white uppercase"
        >
          AB
        </div>
      </div>
    </header>
  );
}
