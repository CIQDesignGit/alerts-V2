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
| **C2** | Prefer **old / canonical issue names** (e.g. “Lost Buy Box”, not mock “Buy Box Lost”). Use the three-location table + `issue-names.ts`. | ✅ Locked |
| **C3** | Every issue **belongs to one group**: Sales · Operations · Marketing. Store/show as an **issue group tag**. Do **not** organize the Alerts UI into Sales/Ops/Marketing sections yet — list issues by **$ at risk**. | ✅ Locked |
| **C4** | Primary surface = Alerts and insights with Overview / Alerts / Insights tabs. | ✅ Locked |
| **C5** | **Revamp the landing experience** to the new Overview (not the old “Gap banner + top 3 brands only” landing). Old top-3 API is superseded for this page. | ✅ Locked — build Overview as landing |
| **C6** | Product = issue-level alerts + top-down Insights; SKU shared leaf. | ✅ Locked |
| **C7** | Alerts tab headers = **filter / full** names (e.g. “Lost Buy Box”). Compact chips elsewhere = chip names (e.g. “Buy Box”). | ✅ Locked |

**Still TBD:** Fixed SKU detail layout (shared leaf UI).

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

## What Are We Building? — Alerts and insights

These features live inside **Sales Agent (AllyAI)** — the AI-powered command center for ecommerce sales teams.

**Product focus:** One page — **Alerts and insights** — with three tabs that share a single leaf (SKU):

1. **Overview** — combination of Alerts + Insights (portfolio health, AI brief, active alerts teaser, business overview teaser).
2. **Alerts** — issue-level early warning; each issue expands to the SKUs driving it.
3. **Insights** — top-down drill-down of the business hierarchy with AI summaries at each level.

---

## Page IA — Three Tabs

Route: `/` (Alerts and insights). Tabs are **in-page**, not separate product areas.

| Tab | Job to be done | Primary layout |
|---|---|---|
| **Overview** | Answer “how is the business doing, and what needs attention?” in one scan | KPI / Gap cards → AI Brief → Active Alerts teaser → Business Overview teaser |
| **Alerts** | Act on the highest-$ issues fast | Left: issue → SKU tree · Right: issue aggregate **or** SKU detail |
| **Insights** | Diagnose top-down by hierarchy | Left: hierarchy tree · Right: level view (AI insight + trend + child breakdown) |

### Shared leaf: SKU

```
Alerts path:     Issue (e.g. Lost Buy Box)  →  SKU
Insights path:   Entire Business → Brand → Category → (Sub-category) → SKU
```

- A **SKU is always the end leaf**, regardless of entry path.
- Selecting a SKU opens the **same fixed SKU detail format** (layout defined later — do not invent until specified).
- Until SKU format is defined, treat the right pane as a placeholder that names the selected path.

---

### Tab 1 — Overview (**this is the landing experience**)

Overview **replaces** the old landing (Gap banner + top-3 brand cards only). Build Overview as the default tab on `/`.

Overview is a **combined teaser** of Alerts and Insights (mock is direction; refine for clarity — dollar-first, action-oriented).

**Required blocks:**
1. **Summary Gap cards** — Portfolio gap (e.g. WTD) + top brands with Gap $, attainment %, sparkline.
2. **AI Brief** — short AllyAI narrative of what is driving the miss / win + “Show reasoning”.
3. **Active Alerts** — issue-level cards using **canonical issue names** (issue · SKU count · $ at risk · optional group tag) + CTA “Go to Alerts”.
4. **Business Overview** — hierarchy path reminder (Entire Business → Brand → Category → SKU) + brand cards + CTA “Go to Insights”.

**Rules:**
- Dollar Gap / $ at risk first; never alphabetical default sort.
- Overview should not require sorting or filters to find the biggest problem.
- CTAs deep-link into Alerts or Insights with context when possible.
- Do **not** ship the superseded “top 3 brands only” landing as the primary experience.

---

### Tab 2 — Alerts (issue-first)

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
- **No SKU selected** → aggregated issue view (AI signal + stats + SKU table)
- **SKU selected** → shared SKU detail format (TBD)

**Breadcrumb example:** `Alerts > Lost Buy Box > Shark IQ AV970`

**Issue names:** use the canonical table below (and `src/components/alerts/issue-names.ts`). Mock labels like “Buy Box Lost” / “Deal Badge Gone” are **not** UI copy — map to “Lost Buy Box” / “Deal Page Visibility” (or Promo Badge) as appropriate.

**Historical / platform note (may still be true outside this page):**
Additional signal types (Sales Drop / Increase, Predictive OOS, Content Change, Competitor OOS/Promo, Amazon Forecast change, Predicted CRaP, PO Discrepancy) and delivery via ESM Recommendations / email remain **adjacent surfaces**, not this tab’s list taxonomy unless added to the canonical table.

---

### Tab 3 — Insights (top-down hierarchy)

**Job:** Drill the business from portfolio → brand → category → (optional sub-category) → SKU, with **AI-driven insight / summary at each level**.

**Left panel — Hierarchy:**
- Configurable visible levels (Entire Business, Brand, Category, Sub-category, SKU)
- Tree nodes show entity name + Gap $
- Sorted by Gap impact (most negative first), not alphabetically
- Selecting a node drives the right panel

**Right panel — Level view (e.g. Brand):**
- Level label + entity name
- Gap vs plan + attainment
- Snapshot / Trends toggle (if enabled) with a shared date-range picker
- **AI {Level} Insights** narrative + “Show reasoning”
- Trend chart (e.g. issue trends + Gap by issue; promo annotations)
- **Child breakdown table** (click row to drill) — columns such as $ Gap, Units Δ, ASP Δ, Attainment; may show issue badges using **chip** names (e.g. Buy Box ×4)
- At **SKU leaf** → same shared SKU detail format as Alerts (TBD)

**Breadcrumb example:** `Entire Business > Shark`

---

## Root Cause Analysis (RCA) — "Ask AllyAI Diagnostics"

**What it does:**
Automatically identifies *why* sales are changing — drilling across traffic, conversion, price, availability, and media spend — at the SKU, category, and brand level.

**How it relates to this page:**
- Overview AI Brief / Insights AI cards / Alerts issue aggregate views are **surfaces** for AllyAI diagnosis.
- Full conversational RCA Chat (“Ask Ally”) remains a related workflow; entry from an alert or insight should carry entity context when we wire it.

**How chat works (when present):**
1. System surfaces a diagnosis.
2. User asks follow-ups in plain language.
3. Agent appends insights into a continuous discovery thread.
4. Deep Reasoning explains *why* and *what to do next*.

---

## The "Diagnose → Act" Loop

```
Overview / Alerts / Insights  →  surface the problem (Gap $, issue, or hierarchy node)
   ↓
Issue or entity selected  →  AllyAI brief / insight / reasoning
   ↓
SKU leaf  →  fixed SKU detail (TBD) + recommended action
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
| Alerts and insights | News Feed & Alerts *(old nav label)* |
| Issue (alert) | Ticket / Incident *(unless ops tooling)* |
| Group tag (Sales / Operations / Marketing) | Organizing the Alerts list into three sections *(not yet)* |
| $ at risk | Vague “impact” without $ |

### Issue group tags

Every canonical issue **belongs to exactly one group**. Use as a **tag** on alert cards/rows. Do **not** section the Alerts list by group until product asks for it.

| Group | Typical issues (examples) |
|---|---|
| **Sales** | Lost Buy Box, Best Seller Rank, Rating & Reviews, Conversion Drop |
| **Operations** | Stock Availability, Shipping Speed |
| **Marketing** | Promo Badge, Deal Page Visibility, Coupon, Sponsored Share of Voice, Keyword Rank, Media Spend |

Canonical mapping lives with names in `src/components/alerts/issue-names.ts` (`group` field).

### RCA Issue Names — Three UI Locations

Each RCA issue type has **three display names** depending on where it appears. Canonical source: `src/components/alerts/issue-names.ts`.

| Filter dropdown / Alerts header | Left-panel chip | RCA right pane |
|---|---|---|
| Lost Buy Box | Buy Box | Buy Box |
| Promo Badge | Promo Badge | Promo Badge |
| Deal Page Visibility | Deal Page | Deal Page Visibility |
| Coupon | Coupon | Coupon |
| Best Seller Rank | Best Seller Rank | Best Seller Rank |
| Rating & Reviews | Rating | Rating & Reviews |
| Stock Availability | Stock | Stock Availability |
| Shipping Speed | Shipping | Shipping Speed |
| Sponsored Share of Voice | SOV | Sponsored Share of Voice |
| Keyword Rank | Keyword Rank | Keyword Rank |
| Media Spend | Media Spend | Media Spend |
| Conversion Drop | Conversion | Conversion |

**Rules:**
- **Filter dropdown & Alerts tab issue headers** — full descriptive names (e.g. "Lost Buy Box", "Conversion Drop"). **Never** use mock synonyms like “Buy Box Lost”.
- **Left-panel chips / compact badges** — short labels (e.g. "Buy Box", "SOV", "Deal Page").
- **RCA right pane** — issue row titles in the root-cause accordion.

---

## Design Principles

1. **Dollar-first** — Always show business impact in $ terms, not just percentages.
2. **Action-oriented** — Every alert or insight should have a clear "what to do" next step.
3. **Lean team-friendly** — Minimize clicks. A manager should get to the answer in under 30 seconds.
4. **Trust through specificity** — Show the exact SKU, the exact keyword, the exact drop.
5. **Agentic, not just reporting** — Feels like talking to a smart analyst, not reading a dense dashboard.
6. **One leaf, two paths** — Alerts and Insights can start differently; they must land on the same SKU detail.

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
| `/` · Tab **Overview** (**landing**) | Revamped combined Alerts + Insights experience |
| `/` · Tab **Alerts** | Issue → SKU left tree; aggregate or SKU detail right |
| `/` · Tab **Insights** | Hierarchy tree; level AI insight + breakdown; SKU leaf |
| `/chat` | RCA Chat with AllyAI (future; not this page’s tabs) |
| `/settings` | Prototype settings placeholder |
| Other shell nav links | Platform chrome placeholders only |

---

## Landing / Overview Data Expectations (revamp)

> **Supersedes** the old “overall Gap + top 3 brands (+ 3 categories)” as the sole landing contract for this page.

| Data | Where it appears |
|---|---|
| Portfolio / overall Gap + attainment | Overview summary cards |
| Top brands by Gap (+ sparklines) | Overview cards + Business Overview teaser + Insights tree |
| AI Brief narrative | Overview |
| Issue-level active alerts (canonical name, group tag, SKU count, $ at risk) | Overview Active Alerts + Alerts tab |
| Hierarchy path Entire Business → … → SKU | Insights + Overview Business Overview label |
| Sort order (impact first) | All ranked lists |

### Important design implications

- **Never sort alphabetically** by default.
- **Always show dollar Gap / $ at risk prominently.**
- Overview loads **pre-prioritized** — biggest problems front and center.
- Overview is the **default landing tab** — implement this before polishing secondary shells.
- SKU detail format is **fixed and shared** — specify before building the leaf UI.
