# Design Instructions

These rules apply to every page and component in this project.
Always follow them unless the user explicitly says otherwise.

---

## Icons
- Use **Lucide React** icons only.
- No other icon libraries (no Heroicons, no FontAwesome, etc.).
- Import from `lucide-react`. Example: `import { Bell, Home } from "lucide-react"`

## Colors
- Use **Tailwind classes / semantic tokens only** — no raw hex in components.
- Prefer project tokens: `brand-*`, `neutral-*`, `warning-*`, `success-*`, `error-*`, `info-*`.
- Semantic shadcn roles are preferred in components: `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`.
- **Neutrals = Tailwind slate.** Always use `neutral-*` classes (e.g. `bg-neutral-50`, `text-neutral-700`). Their hex values are slate (`#f8fafc` … `#020617`) — see `design-specs.md`.
- Do **not** use `gray-*`, `zinc-*`, `stone-*`, or raw `slate-*` in components. Stick to `neutral-*` so one scale stays consistent.
- Shell chrome uses `shell-*` only (AppShell sidebar) — do not mix those into product content surfaces.

## Images & Avatars
- Use placeholder images via `https://placehold.co/{width}x{height}` for any product/user images.
- Example: `<img src="https://placehold.co/40x40" alt="SKU thumbnail" />`
- Never reference local images that don't exist.

## Gradients
- Do NOT add gradients unless the user explicitly asks for them.

## Styling Framework
- Tailwind CSS 4 utility classes only.
- Use shadcn/ui components for base UI primitives (Button, Avatar, Badge, etc.).
- Use prompt-kit style components for all agentic/chat UI (PromptInput, Message, Loader, etc.).

## Layout
- All pages share the AppShell layout: CommerceIQ dark left sidebar + light top header + main content.
- **Alerts and insights** (`/`) has three in-page tabs: Overview · Alerts · Insights (see `product_context.md`).
- Alerts tab: left issue→SKU panel. Insights tab: left hierarchy panel. Overview: no left product panel.
- SKU is the shared leaf from Alerts or Insights; SKU detail format is TBD — do not invent it yet.
- Keep pages under 300 lines. Extract reusable pieces into `src/components/`.

## Typography
- Inter (sans) via `--font-inter` — primary UI.
- JetBrains Mono via `--font-jetbrains-mono` — code / data.
- Headings: `font-semibold` or `font-bold`.
- Body: default weight.
- Muted text: `text-muted-foreground`.

## Product language
- Follow `product_context.md` terminology exactly (SKU, Gap to plan, Buy Box, AllyAI, Insight, Recommendation).
- Dollar Gap first; never sort impact lists alphabetically by default.
- Every alert/insight should answer “what do I do next?”

## Code Quality
- All interactive pages must be `"use client"` components.
- No inline styles — use Tailwind classes only.
- Keep component files under 150 lines; split into sub-components if needed.
- Add short comments explaining non-obvious logic only.
- Before coding against Next.js APIs, read `node_modules/next/dist/docs/` (see `AGENTS.md`).
