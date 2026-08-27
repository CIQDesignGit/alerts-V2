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
- **`/` = Alerts (landing)** — no top-level tabs. Header row: title + alert count + Brand · Category · SKU filters.
- Alerts: left issue→SKU or category→SKU panel (layout **final**). Right: aggregate detail or `SkuRca`.
- **`SkuRca` sub-tabs:** **Alert** (live diagnosis, no historic trends) · **SKU Insights** (issue trends over time, date range, persisted widgets).
- Do **not** show historic trend charts in aggregate alert views or on the Alert sub-tab.
- Keep pages under 300 lines. Extract reusable pieces into `src/components/`.

### Temporary: issue-type view — skip issue aggregate (may revert)

**Status:** Temporary prototype behavior. Product may turn the issue-level insights page back on.

**Current behavior (Group by Issue type):**
- Do **not** show the issue-level insights / aggregate right panel (`AlertDetailPanel`).
- Clicking an issue accordion header selects that issue, expands its SKU list, and **opens the first SKU** in the right panel (`SkuDetailPanel` / issue SKU detail).
- Landing / filter reset also lands on the first issue’s first SKU (not the aggregate).
- Closing SKU detail must **not** return to `AlertDetailPanel` — keep/reopen the first SKU under the current issue.
- Taxonomy (Group by Taxonomy) is unchanged: Overall / Brand / Category still use `TaxonomyRcaPanel`; SKU leaves use `SkuRca`.

**Why / where:**
- Wired in `src/components/alerts-insights/alerts-tab.tsx` (`firstSkuIdForIssue`, `onGroupCardClick`, issue-branch right panel, `onBackToAlert`).
- Keep `src/components/alerts-insights/alert-detail-panel.tsx` in the repo — do not delete it.

**How to revert later:**
1. In `onGroupCardClick`, clear `selectedSkuId` and toggle expand (previous accordion behavior).
2. On issue filter/group reset, set `selectedSkuId` to `null` so the aggregate can show.
3. Restore the right-panel branch that renders `<AlertDetailPanel group={…} />` when `groupBy === "issue" && selectedIssue && !selectedSku`.
4. Restore `onBackToAlert={() => setSelectedSkuId(null)}` so close returns to the issue aggregate.
5. Remove this Temporary section once product confirms the permanent IA.

### Temporary: AllyAI summaries hidden (may revert)

**Status:** Temporary prototype behavior. Product may bring these narrative summaries back.

**What is hidden (do not re-show unless product asks):**

| Surface | What’s hidden | Still visible |
| ------- | ------------- | ------------- |
| **Taxonomy · Overall / Brand / Category** (`TaxonomyRcaPanel`) | `TaxonomyPeriodSummaries` — **Live right now** + **Last week** numbered insight cards (and their `PrecomputedInsightFootnote` lines). Also the “Was this insight helpful?” `ContentFeedback` that sat under those cards. | KPI tiles, Explore more chips, Ally chat thread |
| **Taxonomy · SKU** (`SkuRca` → `SkuRcaIssues`) | `SkuRcaIssueAiSummary` under **Live right now** (brand wash — “As of the latest scrape…”) **and** under **Top Issues last week** (muted wash — 7-day narrative). | Live issue chips + accordion detail, last-week ranked issue rows, Explore more, chat |
| **Issue type · aggregate** | Issue Key insights live inside `AlertDetailPanel` — already skipped by the Temporary issue-type rule above. | N/A while aggregate is off |

**Why / where (keep files — do not delete):**
- Taxonomy rolled-up: removed from `src/components/alerts-insights/taxonomy-rca-panel.tsx`. Component still at `taxonomy-period-summaries.tsx`. Mock bullets still built in `buildTaxonomyRcaView` (`liveNowBullets` / `lastWeekBullets`).
- Taxonomy SKU: removed from `src/components/sku-rca/sku-rca-issues.tsx`. Component still at `sku-rca-issue-ai-summary.tsx`. Copy still produced on `SkuRcaData` as `liveIssuesSummary` / `lastWeekIssuesSummary` in `mock-sku-rca.ts`.
- Footnote helper: `PrecomputedInsightFootnote` in `ally-ai-surface.tsx` (still used by issue Key insights when aggregate returns).

**How to revert later:**
1. **Taxonomy Overall / Brand / Category:** In `taxonomy-rca-panel.tsx`, remount `<TaxonomyPeriodSummaries liveNowBullets={…} lastWeekBullets={…} />` (and optional `ContentFeedback` under it) above Explore more.
2. **Taxonomy SKU — Live:** In `sku-rca-issues.tsx`, restore `<SkuRcaIssueAiSummary summary={liveIssuesSummary} variant="live" />` under the Live header; pass `liveIssuesSummary` from `sku-rca-live-panel.tsx` again.
3. **Taxonomy SKU — Last week:** Restore `<SkuRcaIssueAiSummary summary={lastWeekIssuesSummary} variant="historical" />` under the Top Issues last week header; pass `lastWeekIssuesSummary` from the live panel again.
4. Remove this Temporary section once product confirms the permanent summary IA.

## Typography
- Inter (sans) via `--font-inter` — primary UI.
- JetBrains Mono via `--font-jetbrains-mono` — code / data.
- Headings: `font-semibold` or `font-bold`.
- Body: default weight.
- Muted text: `text-muted-foreground`.

## Product language
- Follow `product_context.md` terminology exactly (SKU, Gap to plan, Buy Box, AllyAI, Insight, Recommendation). Issue list titles come from `issue-names.ts` `.filter` (e.g. Missing Promo Badge, OOS).
- Dollar Gap first; never sort impact lists alphabetically by default.
- Every alert/insight should answer “what do I do next?”

## Code Quality
- All interactive pages must be `"use client"` components.
- No inline styles — use Tailwind classes only.
- Keep component files under 150 lines; split into sub-components if needed.
- Add short comments explaining non-obvious logic only.
- Before coding against Next.js APIs, read `node_modules/next/dist/docs/` (see `AGENTS.md`).
