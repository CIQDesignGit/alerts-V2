export type ShellNavItem = {
  label: string;
  href: string;
  /** Lucide icon name key resolved in the sidebar component */
  icon:
    | "command"
    | "building"
    | "lightbulb"
    | "sparkles"
    | "mail"
    | "message"
    | "file";
  badge?: "NEW";
  /** Highlight this item when pathname matches */
  match?: "exact" | "prefix";
};

/** CommerceIQ MY WORKSPACE nav — mirrors platform chrome */
export const SHELL_NAV_ITEMS: ShellNavItem[] = [
  {
    label: "Command Center",
    href: "/command-center",
    icon: "command",
    match: "prefix",
  },
  {
    label: "Business Overview",
    href: "/business-overview",
    icon: "building",
    match: "prefix",
  },
  {
    label: "Recommendations",
    href: "/recommendations",
    icon: "lightbulb",
    match: "prefix",
  },
  {
    label: "Agentspace",
    href: "/agentspace",
    icon: "sparkles",
    match: "prefix",
  },
  {
    label: "Alerts and insights",
    href: "/",
    icon: "mail",
    badge: "NEW",
    match: "exact",
  },
  {
    label: "Ask Ally",
    href: "/chat",
    icon: "message",
    badge: "NEW",
    match: "prefix",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: "file",
    badge: "NEW",
    match: "prefix",
  },
];
