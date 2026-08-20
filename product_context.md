# Product Context — Alerts V2 (RCA Chat & Alerts / CommerceIQ / AllyAI)

> Always read this file before designing, building, or describing any feature in this project.
> It defines who we are building for, what problems we are solving, and the exact product language to use.

| Field | Value |
| ----- | ----- |
| **Product** | Alerts and insights (Alerts V2) |
| **Parent** | Sales Agent (AllyAI) inside CommerceIQ |
| **Version** | v1 |
| **Status** | Draft |

---

## Decisions log (resolved conflicts)

| # | Decision | Status |
|---|---|---|
| **C1** | Alerts are **issue-first**; SKUs nest inside each issue. SKU is still the leaf. | ✅ Locked |
| **C2** | Alerts list / filter titles use design labels in `issue-names.ts` `.filter` (e.g. “Missing Promo Badge”, “OOS”). Compact chips + RCA pane keep shorter names. Never use reversed mock copy like “Buy Box Lost”. | ✅ Locked |
| **C3** | Every issue **belongs to one group**: Sales · Operations · Marketing. Store/show as an **issue group tag**. Do **not** organize the Alerts UI into Sales/Ops/Marketing sections yet — list issues by **$ at risk**. | ✅ Locked |
| **C4** | Primary surface = **Alerts** at `/` — no separate homepage or hierarchy Insights page. | ✅ Locked |
| **C5** | **Landing = Alerts** (issue/category list). No Overview tab. | ✅ Locked |
| **C6** | SKU detail lives inside Alerts: **Alert sub-tab** (live diagnosis) + **SKU Insights sub-tab** (issue trends over time). | ✅ Locked |
| **C7** | Alerts tab headers = **filter / full** names (e.g. “Lost Buy Box”). Compact chips elsewhere = chip names (e.g. “Buy Box”). | ✅ Locked |
| **C8** | **No historic trends in Alerts** — aggregate views and Alert sub-tab are live/current only. Trends live in SKU Insights sub-tab only. | ✅ Locked |
| **C9** | Alerts list layout (issue + category/taxonomy grouping) is **final** — do not restructure left/right panels. | ✅ Locked |

---

## What is CommerceIQ?

CommerceIQ (CIQ) is an **AI-powered ecommerce management platform** built for consumer brands (primarily CPGs — Consumer Packaged Goods companies) selling on Amazon and other major retailers.

It helps brands **protect revenue, grow market share, and reduce operational overhead** by combining:
- Data aggregation across retailers
- Automation of repetitive ecommerce tasks
- AI analytics and root cause analysis
- Agentic decision-making (AI that can take corrective actions, not just flag issues)

### CIQ's Core Modules
| Module | What It Does |
|---|---|
| **ESM** (Sales & Operations) | Day-to-day sales performance, gap-to-plan tracking, recommendations |
| **Retail Media Management** | Advertising budget and campaign optimization |
| **PRA** (Profit Recovery) | Recovering money lost to Amazon shortages, chargebacks, price variance |
| **Market Share Intelligence** | Competitive positioning and share tracking |
| **Content Agent** | PDP (product detail page) content compliance and SEO |
| **Sales Agent / AllyAI** | Agentic AI workflows — the home of RCA Chat and Alerts |

### The Core Problem CIQ Solves
Brand ecommerce teams are **lean (3–5 people)** managing hundreds or thousands of SKUs across complex retailer environments. CIQ automates the monitoring, alerting, and corrective actions that would otherwise require multiple full-time employees.

---

## What Are We Building? — Alerts

These features live inside **Sales Agent (AllyAI)** — the AI-powered command center for ecommerce sales teams.

**Product focus:** One page — **Alerts** at `/`. The landing experience opens directly on the issue-first alerts list. There is no separate homepage or hierarchy Insights page.

1. **Alerts (landing)** — issue-level early warning; grouped by **issue type** or **category/taxonomy**; each issue expands to SKUs → **Alert SKU detail** (`SkuRca`).
2. **SKU Insights sub-tab** — inside Alert SKU detail only; shows **issue trends over time** (date range, widgets, AllyAI chat). Not shown in aggregate alert views or on the Alert sub-tab.

---

## Page IA — Alerts-first

Route: `/` (**Alerts**). No top-level tabs.

| Surface | Job to be done | Primary layout |
|---|---|---|
| **Alerts (landing)** | Act on the highest-$ issues fast | Header: filters · Left: issue or category → SKU tree · Right: issue aggregate **or Alert SKU detail** |
| **Alert SKU detail** | Diagnose and act on one SKU under an alert | `SkuRca` with **Alert** and **SKU Insights** sub-tabs |

### Alert SKU detail — two sub-tabs (in one shell)

```
Issue (e.g. Lost Buy Box)  →  SKU  →  SkuRca
                                        ├── Alert sub-tab — live diagnosis, issues, recommendations (NO historic trends)
                                        └── SKU Insights sub-tab — issue trends over time, date range, widgets
```

- Selecting a SKU in **Alerts** opens `SkuRca` with the **Alert** sub-tab active by default.
- **SKU Insights** is reached via the header control or sub-tab toggle — stays in-place (no separate page).
- **Do not** show historic trend charts in aggregate alert views or on the Alert sub-tab.

---

### Alerts (issue-first) — landing & final layout

**Generation grain: issue level (not one alert per SKU).**

Each alert = one **issue type** rolled up across affected SKUs, showing:
- **Canonical issue name** (filter/full form — e.g. Lost Buy Box)
- **Group tag** — exactly one of: Sales · Operations · Marketing (metadata / badge; not a list section)
- Count of SKUs
- Total $ at risk / Gap impact

**Left panel:**
- Header: alert count · total $ at risk (e.g. `8 ALERTS · $550K AT RISK`)
- Flat list of **issues**, sorted by $ at risk (highest first) — **not** bucketed into Sales/Ops/Marketing sections (yet)
- Optional: show the group tag on each issue row/card
- Inside an expanded issue: filter SKUs (name, ASIN, $ gap) + ranked SKU list + “+ N more SKUs”
- Lower-severity issues may appear visually de-emphasized

**Right panel:**
- **No SKU selected** → aggregated issue view (AI signal + stats + SKU table) — **no historic trends**
- **SKU selected** → **Alert SKU detail** (`SkuRca`: Alert sub-tab default + optional SKU Insights sub-tab)

**List grouping (final):**
- **Issue type** — canonical issue names, sorted by $ at risk
- **Taxonomy** — nested Overall → Brand → Category → SKU tree (same left/right shell)

**Breadcrumb example:** `Alerts > Lost Buy Box > CleanPro Robot Vac R900`

**Issue names:** use the three-location table below (and `src/components/alerts/issue-names.ts`). Left list + filters use the `.filter` column. Reversed mock labels like “Buy Box Lost” / “Deal Badge Gone” are **not** UI copy.

**Historical / platform note (may still be true outside this page):**
Additional signal types (Sales Drop / Increase, Predictive OOS, Content Change, Competitor OOS/Promo, Amazon Forecast change, Predicted CRaP, PO Discrepancy) and delivery via ESM Recommendations / email remain **adjacent surfaces**, not this tab’s list taxonomy unless added to the canonical table.

---

### SKU Insights sub-tab (inside SkuRca)

| Block | Behavior |
|---|---|
| Header | Same `SkuRca` header + sub-tab toggle (Alert · SKU Insights) |
| Trends | Date range + comparison picker · default **Issue trends over time** widget · optional add/edit widgets (persisted per SKU) |
| Footer | `SkuRcaChatFooter` / AllyAI — trends-focused placeholder copy |
| Not included | Live diagnosis accordion, aggregate alert framing, or revenue trend on Alert sub-tab |

**Superseded (not mounted from `/`):** Overview tab, hierarchy Insights tab, separate Insights SKU page.

---

## Root Cause Analysis (RCA) — "Ask AllyAI Diagnostics"

**What it does:**
Automatically identifies *why* sales are changing — drilling across traffic, conversion, price, availability, and media spend — at the SKU, category, and brand level.

**How it relates to this page:**
- Alerts issue aggregate views and Alert sub-tab diagnosis are **surfaces** for AllyAI.
- SKU Insights sub-tab carries historical issue-trend context.
- Full conversational RCA Chat (“Ask Ally”) remains a related workflow at `/chat`.

**How chat works (when present):**
1. System surfaces a diagnosis.
2. User asks follow-ups in plain language.
3. Agent appends insights into a continuous discovery thread.
4. Deep Reasoning explains *why* and *what to do next*.

---

## The "Diagnose → Act" Loop

```
Alerts (landing)  →  surface the problem ($ at risk, issue, SKU)
   ↓
Issue or category selected  →  AllyAI brief / aggregate view (no trends)
   ↓
SKU selected  →  Alert sub-tab (live diagnosis + recommended action)
              →  SKU Insights sub-tab (issue trends over time)
   ↓
Recommendations / ops follow-through  →  “what do I do next?”
```

---

## Who Are We Designing For? — The Personas

| Persona | Day-to-Day Focus |
|---|---|
| **Ecommerce Manager / Director** | Sales performance, gap-to-plan tracking, retail execution |
| **Commercial / Sales Team** | Closing performance gaps, reporting up to leadership |
| **Analyst** | Deep-dive diagnostics, data exports, ad-hoc reporting |
| **Finance / Revenue Recovery** | PRA disputes — shortages, chargebacks, price variance |
| **Content / Digital Shelf Team** | PDP content compliance, SEO, syndication |

**Key insight about these users:**
- They are NOT engineers or data scientists.
- They manage 100s–1000s of SKUs with a 3–5 person team.
- They are time-poor and need answers fast.
- They care about dollars and rank, not technical metrics.
- The UI must be **clear, fast, and action-oriented** — every screen should answer "so what do I do about it?"

---

## Language & Terminology to Use in the UI

| Use This | Not This |
|---|---|
| SKU | Product / Item |
| Gap to plan | Budget shortfall |
| Buy Box | Purchase button |
| Keyword rank | Search position |
| Out of stock (OOS) | Unavailable *(except when alert type is literally Unavailable / Suppressed)* |
| Suppress / Suppressed | Hidden / Inactive |
| RCA | Root cause analysis (spell it out on first use) |
| AllyAI | The AI agent (not "chatbot") |
| Insight | Finding / Result |
| Recommendation | Suggestion |
| Alerts | News Feed & Alerts *(old nav label)* |
| Issue (alert) | Ticket / Incident *(unless ops tooling)* |
| Group tag (Sales / Operations / Marketing) | Organizing the Alerts list into three sections *(not yet)* |
| $ at risk | Vague “impact” without $ |

### Issue group tags

Every canonical issue **belongs to exactly one group**. Use as a **tag** on alert cards/rows. Do **not** section the Alerts list by group until product asks for it.

| Group | Typical issues (examples) |
|---|---|
| **Sales** | Lost Buy Box, Best Seller Rank Change, Rating Dropped, Conversion |
| **Operations** | OOS, Shipping Speed |
| **Marketing** | Missing Promo Badge, Deal Page Visibility, Active Coupon, Share of Voice Drop, Keyword Rank Drop, Media Spend, Credit Offer |

Canonical mapping lives with names in `src/components/alerts/issue-names.ts` (`group` field).

### RCA Issue Names — Three UI Locations

Each RCA issue type has **three display names** depending on where it appears. Canonical source: `src/components/alerts/issue-names.ts`.

| Filter dropdown / Alerts left list | Left-panel chip | RCA right pane |
|---|---|---|
| Lost Buy Box | Buy Box | Buy Box |
| Missing Promo Badge | Promo Badge | Promo Badge |
| Deal Page Visibility | Deal Page | Deal Page Visibility |
| Active Coupon | Coupon | Coupon |
| Credit Offer | Offer | Credit Offer |
| Best Seller Rank Change | Best Seller Rank | Best Seller Rank |
| Rating Dropped | Rating | Rating & Reviews |
| OOS | Stock | Stock Availability |
| Shipping Speed | Shipping | Shipping Speed |
| Share of Voice Drop | SOV | Sponsored Share of Voice |
| Keyword Rank Drop | Keyword Rank | Keyword Rank |
| Media Spend | Media Spend | Media Spend |
| Conversion | Conversion | Conversion |

**Rules:**
- **Filter dropdown & Alerts left-list titles** — use the design labels in the first column (e.g. "Missing Promo Badge", "OOS", "Rating Dropped"). **Never** use reversed mock synonyms like “Buy Box Lost”.
- **Left-panel chips / compact badges** — short labels (e.g. "Buy Box", "SOV", "Deal Page").
- **RCA right pane** — issue row titles in the root-cause accordion.

---

## Design Principles

1. **Dollar-first** — Always show business impact in $ terms, not just percentages.
2. **Action-oriented** — Every alert or insight should have a clear "what to do" next step.
3. **Lean team-friendly** — Minimize clicks. A manager should get to the answer in under 30 seconds.
4. **Trust through specificity** — Show the exact SKU, the exact keyword, the exact drop.
5. **Agentic, not just reporting** — Feels like talking to a smart analyst, not reading a dense dashboard.
6. **Trends stay in SKU Insights** — Historic issue trends never appear in aggregate alert views or the Alert sub-tab. Live diagnosis and trends are separated by sub-tab.

---

## Gap Sorting Rules (Business Rules for UI)

| Term | Definition |
|---|---|
| **Gap Value ($)** | Target sales $ minus actual sales $. Negative = underperforming. **Primary sort key** for Insights hierarchy and brand lists. |
| **Gap Value (Units)** | Target units minus actual units. Secondary sort when dollar Gap is tied. |
| **Target Value** | Sales target for that entity. Tertiary sort — lower target ranks higher when both Gaps tie. |
| **$ at risk** | Dollar impact rolled up on an **issue-level alert** (and sum of its SKUs). Primary sort for Alerts lists. |

**Sort precedence (Insights / brands / categories):**
1. Dollar Gap — most negative first *(primary)*
2. Unit Gap — most negative first *(secondary)*
3. Target value ascending *(tertiary)*

**Sort precedence (Alerts):**
1. Issue $ at risk — highest first
2. Within an issue: SKU Gap $ — most negative first

**Never sort alphabetically** unless the user explicitly chooses a non-impact sort.

---

## Feature / Page Map (Prototype)

| Route / UI | Purpose |
|---|---|
| `/` · **Alerts** (**landing**) | Issue/category left tree; aggregate or **Alert SKU detail** (`SkuRca`) right |
| `/` · **SkuRca · Alert sub-tab** | Live diagnosis — no historic trends |
| `/` · **SkuRca · SKU Insights sub-tab** | Issue trends over time for the selected SKU |
| `/chat` | RCA Chat with AllyAI (future) |
| `/settings` | Prototype settings placeholder |
| Other shell nav links | Platform chrome placeholders only |

---

## Landing data expectations (Alerts)

| Data | Where it appears |
|---|---|
| Issue-level alerts (canonical name, group tag, SKU count, $ at risk) | Alerts list (landing) |
| Taxonomy grouping | Alerts list — Group by Taxonomy (Overall → Brand → Category → SKU) |
| Sort order ($ at risk / Gap first) | All ranked lists |
| SKU issue trends over time | SKU Insights sub-tab only |

### Important design implications

- **Never sort alphabetically** by default.
- **Always show dollar Gap / $ at risk prominently.**
- `/` loads **directly on Alerts** — pre-prioritized issue list.
- **No historic trends** in Alerts aggregate or Alert sub-tab.
