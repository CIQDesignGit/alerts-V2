/**
 * Static Ally text replies for Explore more chips (mock — not a live model).
 * Keys match the chip `prompt` string exactly.
 */
const ALLY_CHIP_REPLIES: Record<string, string> = {
  // ── Lost Buy Box · SKU ──────────────────────────────────────────────
  "Why is this SKU losing buy box - price, stock, or shipping speed?":
    "Price is the primary driver — a competing offer is undercutting you by about $1.20 on most crawls.\nStock looks healthy (on-hand > 7 days), and shipping speed is within Prime norms.\nFix: match or beat the competitor’s landed price for the next 48 hours, then re-check Buy Box win rate.",

  "Who's the most frequent buy box competitor on this SKU (last 7 days)?":
    "Marketplace seller “HomeEssentials Pro” held Buy Box on 5 of the last 7 days.\nThey typically undercut by $0.80–$1.40 and keep Fast Shipping badges active.\nNext step: review their offer price vs. your MAP and decide whether to compete or hold margin.",

  // ── Promo Badge · SKU ───────────────────────────────────────────────
  "Why is this SKU flagged for Missing Promo Badge?":
    "A live promo is scheduled, but the badge is not rendering on the PDP in the latest crawl.\nExpected badge: Lightning Deal; live price is already discounted.\nAction: re-publish the promo creative or raise a content ticket so the badge syndicates.",

  "What's the expected vs. live price for this promo?":
    "Expected promo price is $29.99; live crawl shows $34.99 (no discount applied).\nThat $5 gap is why the Missing Promo Badge alert is firing.\nConfirm the deal is still approved and push the correct price within the promo window.",

  // ── Deal Page · SKU ─────────────────────────────────────────────────
  "Why is this SKU flagged for Deal Page Visibility?":
    "This SKU is on an active promo but was missing from the Deals page on the last two crawls.\nCategory placement and deal eligibility still look valid in planning data.\nAsk retail media / deals ops to re-list it on the category deals page today.",

  "Which deals pages or categories were checked for this SKU?":
    "We checked Home & Kitchen deals, Lightning Deals hub, and the brand store deals shelf.\nThe SKU appears in planning for Home & Kitchen only — and it is currently absent there.\nFocus remediation on the Home & Kitchen deals page first.",

  // ── Coupon · SKU ────────────────────────────────────────────────────
  "How long has this coupon been active?":
    "The coupon has been live on the PDP for 6 consecutive days this week.\nClip rate is steady; no expiry is showing in the next 48 hours.\nIf this was meant to be a short burst, confirm end date with promotions ops.",

  "Is the Selling Price for the SKU Correct?":
    "Live selling price is $42.99 before the coupon; after clip it lands at $38.99.\nThat matches the planned promo price within $0.00.\nNo price-fix action needed — keep monitoring clip rate vs. plan.",

  // ── Credit Offer · SKU ──────────────────────────────────────────────
  "How much credit/savings is being offered on this SKU?":
    "The PDP is showing a $15 instant credit / savings offer on this SKU.\nThat equates to roughly 12% off the current list price.\nValidate whether this depth was intentional for the current campaign week.",

  "How long has this credit offer been active?":
    "The credit offer has been active for 4 of the last 7 days.\nIt first appeared mid-week and is still present on today’s crawl.\nIf budget is capped, schedule an end date before weekend traffic peaks.",

  // ── Best Seller Rank · SKU ──────────────────────────────────────────
  "Did this SKU's rank improve or worsen day-over-day?":
    "Best Seller Rank worsened day-over-day — roughly a 18% drop vs. yesterday.\nMost of the move happened in the last 24 hours, not a slow drift.\nPair this with glance views and Buy Box to see if traffic or conversion slipped first.",

  "How does this SKU's rank compare to its own 7d average?":
    "Current BSR is weaker than this SKU’s 7-day average by about 22%.\nThree of the last seven days were below average; today is the weakest.\nPrioritize recovering traffic drivers (price, ads, availability) before the weekly close.",

  // ── Rating · SKU ────────────────────────────────────────────────────
  "What's driving this - a rating drop or a spike in 1-2 star reviews?":
    "Both are in play, but the spike in 1–2 star reviews is the sharper signal.\nFive new low-star reviews landed in the last week, pulling the average down.\nTriage recent reviews for product vs. shipping complaints and route accordingly.",

  "How much has the rating changed vs. last week?":
    "Average rating slipped from 4.6 to 4.4 vs. last week (−0.2 stars).\nReview volume is up ~30%, which accelerated the drop.\nRespond to recent negative reviews and check for a packaging or quality batch issue.",

  // ── OOS / Stock · SKU ───────────────────────────────────────────────
  "Does the SKU have any On-Hand Inventory?":
    "On-hand inventory is effectively zero in the primary FC feeding this ASIN.\nInbound POs exist but are not yet received (ETA 3–5 days).\nUntil stock lands, suppress ads spend and set customer-facing OOS messaging.",

  "What's the Unavailability % and Rep OOS % for this SKU?":
    "Unavailability is ~68% over the last 7 days; Rep OOS sits near 54%.\nThat means shoppers often cannot buy even when some nodes still show stock.\nEscalate replenishment and verify regional FC allocation.",

  // ── Shipping Speed · SKU ────────────────────────────────────────────
  "What's the Prime vs. Standard delivery gap for this SKU?":
    "Prime delivery is quoting 1–2 days; Standard is landing at 5–7 days.\nThe gap is largest in Southeast ZIP clusters.\nIf you need Prime parity, check FC placement and offer shipping template.",

  "Which markets show the slowest delivery speeds for this SKU?":
    "Slowest markets this week: Miami, Houston, and Atlanta metro ZIPs.\nThose nodes are quoting +2 days vs. national Prime median.\nPrioritize inventory moves into the Southeast network.",

  "Which Zipcodes have delivery data for this SKU today?":
    "We have fresh delivery quotes for 42 of 50 sampled ZIP codes today.\nCoverage is thin in mountain-west ZIPs (8 missing samples).\nTreat missing ZIPs as unknown — don’t assume Prime coverage there.",

  // ── SOV · SKU ───────────────────────────────────────────────────────
  "Is this SKU's SoV drop bigger in Sponsored Products or Sponsored Brands?":
    "The Share of Voice drop is steeper in Sponsored Products (−11 pts) than Sponsored Brands (−4 pts).\nCompetitor bids on your top converting keywords rose mid-week.\nReallocate budget toward the SP keywords losing impression share first.",

  "What's the Top Competitor SOV %":
    "Top competitor “CleanHome Co” now holds ~34% Sponsored SOV on your brand terms.\nYour SKU sits near 22% on the same set — down from ~31% last week.\nRaise bids or broaden match on the three highest-revenue terms.",

  // ── Keyword Rank · SKU ──────────────────────────────────────────────
  "Which keywords dropped rank for this SKU?":
    "Biggest organic drops: “robot vacuum”, “self empty vacuum”, and “pet hair vacuum”.\nSponsored rank also slipped on “robot vacuum” during peak hours.\nRestore content freshness and consider defending those terms with SP.",

  "Is the drop in organic or sponsored rank?":
    "Organic rank is the larger problem this week; sponsored rank is only mildly down.\nTwo hero keywords fell outside the top 20 organically.\nStart with SEO/content and ratings health before changing ad structure.",

  // ── Conversion · SKU ────────────────────────────────────────────────
  "Is this SKU's conversion drop tied to a drop in glance views?":
    "Glance views are roughly flat; conversion rate is down ~1.4 pts week over week.\nThat points to PDP friction (price, reviews, or offer) more than traffic loss.\nAudit Buy Box, price, and recent review sentiment before cutting ad spend.",

  "How does this SKU's conversion rate compare to last week?":
    "Conversion is ~11.2% this week vs. ~12.6% last week (−1.4 pts).\nUnits are down even though sessions held steady.\nPair with Buy Box and rating checks — those usually explain this pattern.",

  // ── Media Spend · SKU ───────────────────────────────────────────────
  "Which keywords on this SKU are most underfunded?":
    "Most underfunded vs. importance: “robot vacuum”, “self empty”, and “mapping vacuum”.\nThey drive ~40% of attributed sales but only ~18% of spend.\nShift budget from low-ROAS discovery terms into these three for 48 hours.",

  "How does this SKU's spend compare to last week?":
    "Spend is down ~12% week over week while revenue from ads fell ~9%.\nEfficiency is slightly better, but you may be leaving impression share on the table.\nIf Gap to plan is still red, restore spend on the top converting terms.",

  // ── Lost Buy Box · Rolled up ─────────────────────────────────────────
  "Which SKUs drive most of the Lost Buy Box gap?":
    "Three SKUs account for most of the Lost Buy Box $ at risk this week.\nThe top ASIN alone is roughly a third of the issue-level gap.\nOpen those SKUs first and fix price / competitor offers before the long tail.",

  "Who's the most frequent buy box competitor (last 7 days)?":
    "Across this alert, “HomeEssentials Pro” wins Buy Box most often over the last 7 days.\nThey show up on multiple SKUs in this issue, not just one ASIN.\nTreat them as a portfolio competitor — align pricing playbooks across the set.",

  "How much revenue is at risk from lost buy box this week?":
    "Issue-level $ at risk from Lost Buy Box is concentrated in the top half of the SKU list.\nRecovering Buy Box on the top three SKUs would close most of the weekly gap.\nSequence actions by $ impact, not alphabetically.",

  // ── Promo / Deal rolled-up (shared first chip) ──────────────────────
  "How many SKUs were expected to be on Promo today?":
    "Planning expected 14 SKUs on promo today across this alert set.\nOnly a subset currently show a live badge or deals-page presence.\nExport the miss list and clear syndication blockers before peak hours.",

  "Which SKUs have a live promo with no badge showing?":
    "Several SKUs have a live discounted price but no promo badge on the PDP.\nThat mismatch is what triggers Missing Promo Badge for this issue.\nRe-syndicate badges on the flagged ASINs and re-crawl.",

  "Which SKUs have a price mismatch vs. their planned promo?":
    "A handful of SKUs are live above the planned promo price.\nThose mismatches explain most of the $ gap under this alert.\nPush the planned price or pause the promo until pricing is correct.",

  "Which SKUs are missing from the deals page during an active promo?":
    "Multiple ASINs are on promo in planning but absent from the deals page crawl.\nHome & Kitchen deals is the common miss surface.\nRe-submit deals-page inclusion for the missing SKUs today.",

  "Which SKUs have been missing from deals pages most often this week?":
    "Two SKUs were missing from deals pages on 5+ of the last 7 days.\nThey contribute a large share of this issue’s $ at risk.\nPrioritize permanent deals-page placement for those ASINs.",

  // ── Coupon / Credit rolled-up ───────────────────────────────────────
  "Which SKUs currently show an active coupon on the PDP?":
    "Several SKUs in this alert currently show an active coupon clip on the PDP.\nClip rates vary; a few are driving most of the incremental units.\nKeep high-performing coupons and sunset low-clip ones.",

  "Which SKUs have had a coupon active most of this week?":
    "A small set of SKUs kept a coupon live for 5–7 days this week.\nThat duration may be longer than the planned burst.\nConfirm end dates so margin isn’t eroded longer than needed.",

  "Which brands or categories are seeing the most active coupons?":
    "Coupon activity is densest in the top brand and its core category.\nOther brands in the taxonomy show far fewer live clips.\nUse that concentration to focus promo compliance checks.",

  "Which SKUs currently show an active credit offer on the PDP?":
    "A subset of SKUs show an active credit / savings callout on the PDP today.\nOffer depth ranges from $10–$20 depending on the ASIN.\nValidate each against campaign budget before peak traffic.",

  "How much credit/savings is being offered on these SKUs?":
    "Across the alert, credit offers total meaningful discount depth vs. list price.\nA few SKUs carry the largest $ savings and therefore the biggest margin risk.\nCap or rotate the deepest offers if ROAS softens.",

  "Which brands or categories are seeing the most credit offers?":
    "Credit offers cluster in one brand and two categories under this alert.\nThat concentration makes remediation straightforward.\nStart compliance and budget checks there before expanding.",

  // ── BSR / Rating / Stock rolled-up ──────────────────────────────────
  "Which SKUs have had a Best Seller Rank alert in the last 7 days?":
    "Several SKUs tripped a Best Seller Rank alert in the last 7 days.\nThe sharpest movers sit at the top of the $ at risk sort.\nOpen those SKUs and compare rank vs. their own 7-day baseline.",

  "Which SKUs had the sharpest day-over-day BSR change?":
    "Two ASINs show the sharpest day-over-day BSR declines.\nBoth also show soft conversion or Buy Box pressure.\nFix offer health on those SKUs before broader assortment work.",

  "How does this week's BSR compare to last week?":
    "Category-level BSR for this alert set is weaker than last week overall.\nMost of the damage is concentrated in a few hero SKUs.\nRecover those first to lift the rolled-up signal.",

  "Which SKUs have the steepest rating drop right now?":
    "A small group of SKUs show the steepest rating drops in this alert.\nRecent 1–2 star reviews are the common pattern.\nTriage review themes and respond within 24 hours.",

  "Is this a rating drop or a spike in negative reviews?":
    "For this rolled-up set, negative review spikes are leading the rating drops.\nAverage star change is modest, but volume of low-star reviews is up.\nPrioritize review response and quality checks over broad content rewrites.",

  "Which brands or categories are seeing the most rating drops?":
    "Rating pressure is heaviest in one brand and its core category.\nOther brands under this alert are comparatively stable.\nFocus CX and quality follow-up on that brand first.",

  "Which SKUs have been out of stock the most days this week?":
    "A few SKUs were OOS on most days this week and drive the bulk of $ at risk.\nInbound inventory is late for the worst offenders.\nExpedite POs and pause wasted media on confirmed OOS ASINs.",

  "Is this a replenishment issue or a genuine inventory outage?":
    "Signals point mainly to replenishment delay, not a permanent discontinue.\nOn-hand is low while inbound POs still exist.\nTreat as a short-term outage and communicate ETA to ops.",

  "Which regions are seeing the most stockouts?":
    "Stockouts are densest in Southeast and South-Central regions this week.\nWest Coast availability looks comparatively healthier.\nRebalance FC inventory toward the hot regions.",

  // ── Shipping / SOV / Keyword / Conversion / Media rolled-up ─────────
  "Which SKUs have the largest Prime vs. Standard delivery difference?":
    "A handful of SKUs show the widest Prime vs. Standard delivery gaps.\nThose ASINs also appear high on $ at risk for Shipping Speed.\nFix FC placement / template on the worst gap SKUs first.",

  "Which markets show the slowest delivery speeds?":
    "Slowest delivery markets for this alert: Southeast metros and a few Texas ZIPs.\nNational median is still within Prime norms.\nTarget inventory moves to those markets.",

  "How many markets have delivery data for these SKUs?":
    "Most sampled markets have delivery data; a minority are missing quotes today.\nMissing markets should be treated as unknown coverage.\nRe-crawl those ZIPs before making network decisions.",

  "Which SKUs have the steepest Share of Voice drop right now?":
    "SOV drops concentrate on a few hero SKUs in this alert.\nSponsored Products losses outweigh Sponsored Brands for most of them.\nDefend those ASINs’ top keywords before expanding the campaign set.",

  "Is the drop bigger in Sponsored Products or Sponsored Brands?":
    "Across this issue, Sponsored Products is where most SOV was lost.\nSponsored Brands is flatter week over week.\nRebid and budget toward SP first.",

  "Which competitor is gaining share of voice on brand terms?":
    "One marketplace competitor is gaining the most SOV on your brand terms.\nTheir share rose as yours fell on the same keyword cluster.\nRaise brand-term defense bids and check for trademark policy gaps.",

  "Which SKUs have the steepest keyword rank drop right now?":
    "Keyword rank drops are sharpest on a short list of SKUs in this alert.\nOrganic losses lead; sponsored is secondary for most.\nRefresh content and defend the top converting terms.",

  "Which keywords dropped the most in organic rank?":
    "Top organic losers: category head terms and two high-intent mid-tail keywords.\nThose terms historically contribute a large share of organic units.\nPrioritize content and rating health tied to those queries.",

  "Which top-spend keywords are losing sponsored rank?":
    "A few top-spend keywords lost sponsored rank during peak hours this week.\nImpression share fell even where bids looked competitive yesterday.\nRe-check bid + budget caps on those exact terms.",

  "Which SKUs have the steepest conversion rate drop right now?":
    "Conversion drops are sharpest on the top $ at risk SKUs in this alert.\nTraffic is mostly holding; purchase rate is not.\nInspect Buy Box, price, and reviews on those ASINs first.",

  "Is the conversion drop tied to a drop in glance views?":
    "For this rolled-up set, glance views are largely stable while conversion softens.\nThat usually means PDP / offer issues rather than traffic loss.\nDon’t cut media until offer health is checked.",

  "How does this week's conversion rate compare to last week?":
    "Conversion for this alert set is down vs. last week on a points basis.\nA minority of SKUs explain most of the rolled-up decline.\nFix those SKUs to move the aggregate number.",

  "Which SKUs have the most severe Media Spend misallocation right now?":
    "Misallocation is worst on SKUs where high-importance keywords are underfunded.\nA few ASINs spend heavily on low-ROAS discovery while core terms starve.\nRebalance within those SKUs before adding net-new budget.",

  "Which keywords are most underfunded relative to their importance?":
    "Underfunded keywords cluster on hero converting terms with high Gap impact.\nThey get less spend share than their contribution warrants.\nMove budget from weak discovery terms into that core set.",

  "How does spend compare to last week?":
    "Spend is slightly down week over week across this media-spend alert.\nEfficiency is mixed — some SKUs improved ROAS while losing share.\nRestore spend where Gap to plan is still red and keywords are proven.",

  // ── Taxonomy follow-ups ─────────────────────────────────────────────
  "Which brand or category is driving the biggest revenue gap right now?":
    "One brand and its top category explain most of the current revenue gap.\nTheir SKU list is also where open alerts cluster.\nDrill into that brand first, then the heaviest category underneath.",

  "Which category is driving the biggest revenue gap right now?":
    "A single category is carrying most of this brand’s Gap to plan.\nIssue density (Buy Box, stock, media) is highest there too.\nOpen that category’s SKU list sorted by $ at risk.",

  "Which SKUs are driving the biggest revenue gap in this category?":
    "A short list of SKUs drives most of this category’s revenue gap.\nThey overlap with the loudest open alerts.\nWork those ASINs in $ order — not alphabetical order.",

  "Show my top SKUs with open issues":
    "Your highest-$ SKUs with open issues are listed by Gap impact in Alerts.\nFocus on the first few — they usually cover most of the dollars.\nOpen each SKU’s Alert tab for live diagnosis and next actions.",

  "Summarize all issues on this SKU":
    "This SKU has multiple open issues; Buy Box / availability / media often co-occur.\nThe Alert sub-tab ranks what matters most for $ at risk right now.\nStart with the top issue, then use SKU Insights for trend context.",

  "What changed in the last 24 hours?":
    "In the last 24 hours, the biggest moves were offer/Buy Box or rank signals — not a full assortment reset.\nA few metrics shifted enough to change priority vs. yesterday.\nRe-check the Alert sub-tab KPIs and the newest crawl before acting.",
};

/** Look up a static 2–3 line reply for a chip prompt; null if unknown. */
export function getAllyChipReply(prompt: string): string | null {
  return ALLY_CHIP_REPLIES[prompt] ?? null;
}
