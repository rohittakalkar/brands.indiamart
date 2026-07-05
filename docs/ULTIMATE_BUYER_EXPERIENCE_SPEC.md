# The Ultimate Buyer-First Experience — UX Specification

**Stage 1 of 2: written specification.** Stage 2 (visual wireframes) follows once this is reviewed and approved — per your direction, don't build wireframes against a layout you might want changed first.

**Foundation:** this extends [`BUSINESS_ASSUMPTIONS.md`](BUSINESS_ASSUMPTIONS.md) rather than re-deriving it. Every persona, intent ranking, trust hierarchy, and resolved decision from that document is treated as binding here. Where this spec makes a new call not covered there, it's marked **[NEW]**.

**Primary Objective, restated as a design constraint:** 90% of buyers should reach Product, Brand-MCat, or Category — the three pages this document treats as the conversion core — in the fewest possible steps. Every other page in this spec (Home, Search, Brand Hub, Compare, Seller Listing pattern, RFQ Flow, Shortlist) exists to route buyers toward those three quickly, or to support a conversion once there. **Brand Hub is deliberately not one of the three** — per your direction, it's designed as a fast, confidence-building pass-through toward Brand-MCat, not a destination buyers are meant to linger on.

---

## Shared Pattern Library

Defined once, referenced by every page below — repeating these per-page would violate this spec's own Principle 11 (avoid redundant sections).

**Breadcrumb pattern:** `Home > [Category] > [Brand] > [Model]`. Every segment is a real link. Always reflects the *deepest currently-resolved context* — a buyer on a Product page sees all four levels even if they arrived via search, not just the levels they clicked through. Mobile: collapses to `‹ [Parent]` (one level back) plus a `Home` icon, to save first-fold space; full breadcrumb reachable by tapping the collapsed control.

**CTA hierarchy pattern:** Exactly one **Primary CTA** per page (solid, `cta` orange, e.g. "Connect with Seller") — never two competing primaries. **Secondary CTAs** (outline/ghost, e.g. "Compare," "Save") support the primary without competing for the same visual weight. **Tertiary actions** (plain text links, e.g. "Download Datasheet") are informational, not conversion-focused.

**Trust badge order pattern** (per `BUSINESS_ASSUMPTIONS.md`'s resolved trust hierarchy): 1) Manufacturer/OEM authenticity, 2) Verified Supplier (IndiaMART), 3) Authorized Dealer, 4) Certified Product. Always in this order, always the first visual element after the product/brand identity — never buried.

**Connection pattern** (per the resolved dual-path decision): "Connect via IndiaMART" (masked, one-tap) and "Get Quote" (RFQ form) always appear together, never one without the other. Neither ever displays a raw personal phone number.

**Intent-carry pattern**: category/spec/model context travels forward as URL query parameters (already implemented this session for Category→Brand→Brand-MCat). Every page that receives incoming context surfaces it explicitly (a banner, a pre-filled selection, a highlighted breadcrumb segment) rather than silently using it.

---

## 1. Home

### Buyer intent served
Entry point for buyers with no fixed page in mind yet — Category Explorer (cold), Problem/Application-Driven, Researcher, and the small share of Exact-Spec buyers who search from here rather than a search engine. Per the confirmed traffic-source decision, **most real buyers skip this page entirely** (they land deep via SEO) — Home's job is to convert the minority who do arrive here as fast as everywhere else does.

### Mobile first fold (no scroll)
1. Compact logo + basket/profile icons (44px header)
2. Headline stating the confidence-layer value prop in one line
3. Search bar — the single highest-priority element, large tap target, placeholder text showing a real example query (not "Search...")
4. 3 real, computed stat pills (branded categories / trusted brands / standard categories) — social proof, not decoration

### Desktop first fold (delta from mobile)
Same content, wider layout allows the category×brand FOMO rail (already built this session) to sit within the first fold alongside the search bar, rather than requiring a scroll — desktop's extra width is spent on *more of the same conversion-relevant content*, not on marketing space.

### Information hierarchy
1. Search (the fastest path to Product/Brand-MCat/Category)
2. "Not Sure What You Need?" guided discovery (for buyers without search vocabulary yet)
3. Browse Categories (direct entry to the Category page)
4. Popular Brands (direct entry to Brand Hub → pass-through to Brand-MCat)
5. Featured Models (direct entry to Product page)
6. Recently Viewed (return-visit continuity, session-scoped)
7. Buying Guides (lowest priority — informational, not conversion-focused)

### CTA hierarchy
Primary: Search submission. Secondary: "Get Quotes From Verified Sellers" (blank RFQ, for buyers who'd rather describe their need than browse). Tertiary: category/brand/product tile taps (navigation, not a "CTA" in the conversion sense).

### Breadcrumb
None — Home is the root. No breadcrumb needed or shown.

### Intent preservation
Home is almost always the *start* of a session, not a receiving page — the one exception is a buyer who taps "Back to Homepage" from the RFQ success screen; in that case Recently Viewed should already reflect what they just did, so the session doesn't feel reset.

### Related content strategy
Category×Brand FOMO rail, Popular Brands, Featured Models — all real, data-driven (not editorial picks), each a direct path toward one of the three core destination pages.

### Conversion optimization opportunities
The search bar's placeholder should rotate through 2-3 real example queries (e.g. "Kirloskar 62.5 kVA generator," "15 HP air compressor") — buyers often don't know how specific they're allowed to be; showing a real, specific example query teaches the search box's capability instantly, reducing the fallback-to-browsing rate.

### Trust-building elements
The 3 stat pills (branded categories / trusted brands / standard categories) are themselves a trust signal — they establish scale and credibility before the buyer has clicked anything, which matters because Home is often a buyer's *first* impression of the whole platform (unlike deep-landed buyers who arrive already trusting whatever referred them).

### Scroll hierarchy
First fold: search + stats. Second: guided discovery + category browse. Third: popular brands + featured models. Fourth (lowest priority, can be cut on a length-constrained mobile build without losing the core objective): buying guides.

### Expected user journey
Home → (search, most common) → Product/Brand/Category directly, OR Home → Browse Categories → Category page → (continues into the already-fixed Category→Brand→Brand-MCat funnel).

### Expected conversion impact
Home's own conversion rate matters less than its *routing* speed — success here is measured by how few Home-originated sessions take more than 2 clicks to reach one of the three core pages, not by Home's own CTA click rate.

### Trade-offs considered
Considered making Home itself a full product-discovery surface (infinite-scroll catalog, filters, etc.) — rejected, because that would compete with Category page's job and add scroll depth to a page whose real value is *speed of routing*, not depth of content. Home should feel like an airport departures board, not a duty-free shop.

---

## 2. Search Results

### Buyer intent served
Exact-Spec Buyer (the highest-value case — should almost never actually render this page, redirecting instead), and the residual fallback for ambiguous/multi-match queries (Category Explorer whose query wasn't specific enough, Alternative-Seeking buyers).

### Mobile first fold
When a query resolves confidently (the common case): **no Search Results page renders at all** — the buyer lands directly on Product, Brand, or Category. This page's first fold only matters for the ambiguous case:
1. The literal query, quoted, with an implicit "here's what we found for..." framing
2. Grouped result counts (N products, N brands, N categories) so the buyer instantly sees whether to expect a product-level or category-level answer
3. First 2-3 product results (most specific, most likely to satisfy Exact-Spec intent even in a fallback)

### Desktop first fold
Same grouping, wider layout shows more results per group without scrolling (e.g. 4 products across instead of 2).

### Information hierarchy
Products first (most specific match to fallback into), then brands, then categories, then brand-mcat lines — ordered from most-specific to least-specific, mirroring how a buyer's intent likely narrows.

### CTA hierarchy
No page-level primary CTA — every result card *is* the CTA (tapping it navigates onward). This is intentional: a fallback page's job is routing, not converting on its own.

### Breadcrumb
`Home > Search: "[query]"` — lets a buyer revise their search without losing where they are.

### Intent preservation
The exact query text must remain visible and editable (not just used-and-discarded) — if the fallback grouping still isn't right, the buyer should be able to refine without retyping from scratch.

### Related content strategy
None beyond the grouped results themselves — this page shouldn't recommend unrelated content when the buyer's stated intent (the query) hasn't been resolved yet.

### Conversion optimization opportunities
**[NEW]** When zero results exist for a category-shaped query, offer the "Not Sure What You Need?" guided-discovery cards as a graceful fallback rather than a bare empty state — turns a dead end into another routing path toward Category.

### Trust-building elements
None specific to this page — trust is established on the destination page, not the routing page.

### Scroll hierarchy
Products → Brands → Categories → Brand-MCat lines, each a short row, no group taking more than one screen height.

### Expected user journey
Search Results should be a *rare* page in practice — most sessions touching it are query-refinement loops (buyer revises the query 1-2 times) that then exit via a confident redirect.

### Expected conversion impact
Success is measured by minimizing time spent *on* this page — a buyer stuck refining searches for more than ~15 seconds is a search-resolution quality problem, not a Search Results *design* problem, and should be tracked as a signal to improve the underlying token-matching, not to add more content to this page.

### Trade-offs considered
Considered always showing a Search Results page (even for confident single matches) with the matched result highlighted, to give buyers a chance to reconsider — rejected, because it adds one click to the highest-value, fastest-converting persona (Exact-Spec Buyer) for the sake of a much smaller edge case (buyer wants to double back), which they can already do via the breadcrumb/back navigation on the destination page.

---

## 3. Category Page

*(One of the three core destination pages — already substantially rebuilt this session; this section formalizes the standard and notes what's already met vs. still open.)*

### Buyer intent served
Category Explorer (primary), Value-Conscious, Premium/Quality-First, Compliance-Driven (via the certification filter added this session), and the landing point for "Not Sure What You Need?" guided discovery.

### Mobile first fold
1. Breadcrumb (`Home > [Category]`)
2. Category name + real stat line ("N verified brands · N models available")
3. Filter access (Brand / Price / Certification) — visible, not hidden behind an extra tap, since filtering *is* the primary activity on this page
4. First 2-3 brand cards (each showing manufacturer-OEM badge first, seller-availability count)

### Desktop first fold
Filters as a persistent left rail (not a collapsible drawer) since desktop width allows it without sacrificing brand-card visibility — mobile keeps filters as an expandable inline section to preserve first-fold space for actual brand results.

### Information hierarchy
1. Filters (the tool for narrowing toward the right brand/model)
2. Brand cards (the actual comparison surface for this persona)
3. Brand comparison table (structured, side-by-side — already exists)
4. Top model per brand (a preview into what Brand-MCat holds, encouraging the next click)
5. Buying guide + FAQ (supporting, below the fold, already correctly deprioritized)

### CTA hierarchy
Primary: "Compare Brands" (already the sticky bottom CTA). Secondary: "Get Quotes" (category-level, generic — for buyers who don't want to browse further). Tertiary: individual brand card taps.

### Breadcrumb
`Home > [Category]` — one level, since Category is reached directly from Home/search, not nested under anything else.

### Intent preservation
✅ Already correct: the active spec filter carries forward onto the brand card's outbound link (`?fromCategory=&spec=`), continuing into Brand Hub's banner and Brand-MCat's preselection.

### Related content strategy
"Top Model From Each Brand" rail previews Brand-MCat content without requiring a full navigation — lets a buyer sanity-check "does this brand even make what I need" before committing to the click.

### Conversion optimization opportunities
The certification filter (added this session) should be positioned *after* brand and price in the filter order for most categories, but categories where compliance is a common blocker (e.g. switchgear, industrial valves) could reasonably lead with it — **[NEW, open question]**: worth a follow-up on whether filter order should vary by category, or stay fixed for consistency.

### Trust-building elements
Manufacturer/OEM badge first on every brand card (already correct); seller-availability count as a secondary confidence signal ("N Authorized Sellers Available").

### Scroll hierarchy
Filters+brand cards (first fold) → brand comparison table → top models → buying guide/FAQ (last, informational).

### Expected user journey
Category → filter by spec → tap a brand card → Brand Hub (fast pass-through) → Brand-MCat (preselected) → connect/RFQ. This is the fully-instrumented, already-fixed core funnel.

### Expected conversion impact
This page's brand-card click-through rate is the single best proxy for whether category-level information (specs, applications, price bands) is actually helping buyers narrow down, versus buyers bouncing to search instead.

### Trade-offs considered
Considered merging "Top Model From Each Brand" directly into the brand cards (no separate rail) — rejected, because brand cards need to stay scannable for brand-level comparison, while the model rail serves a different, more specific question ("what's the actual flagship option"); conflating them would slow down the brand-comparison scan.

---

## 4. Brand Hub

### Buyer intent served
Brand-Loyal Buyer, and the pass-through leg of Category Explorer's funnel (per this round's resolved direction: Brand Hub is a confidence check, not a destination).

### Mobile first fold
1. Breadcrumb (`Home > [Category] > [Brand]`, when arriving with category context; `Home > [Brand]` when cold)
2. Brand name + logo + manufacturer-OEM/verified badges (trust, immediately)
3. **[NEW, per this round's decision]** The dominant first-fold element is the CTA "Explore [Brand]'s [Category] Range →" — not a long brand story. If a category context exists, this leads directly to the correct Brand-MCat page.
4. The "You were exploring..." banner (already built this session), when incoming context exists

### Desktop first fold
Same priority order; wider layout allows brand credentials (established year, manufacturing scale) to sit beside the CTA rather than requiring a scroll, reinforcing trust without slowing the primary path.

### Information hierarchy
1. Explore-range CTA (the primary path onward)
2. Trust credentials (brief — established year, certifications, verified badge)
3. Product lines list (already exists, "You were here" highlighting already built)
4. Sellers/reviews/full company story — **[NEW]** demoted further below the fold than today, since this content serves the smaller "wants the full story" segment of Brand-Loyal buyers, not the majority pass-through case

### CTA hierarchy
Primary: "Explore [Brand]'s [Category] Range" (or, with no category context, "Explore All Products"). Secondary: "Compare Sellers" (already exists), shortlist/heart icon. Tertiary: website link, catalogue download.

### Breadcrumb
`Home > [Category] > [Brand]` when context exists; `Home > [Brand]` when cold — this is itself a visible signal of *why* the buyer is seeing this particular brand, reinforcing the "You were exploring..." banner rather than duplicating it uselessly.

### Intent preservation
✅ Already correct: banner + Products-tab auto-open + highlighted matching product line, all built this session. **[NEW]** the primary CTA copy itself should now dynamically reflect context too — "Continue to GA 11 VSD+" when a specific model is known (already exists as a secondary banner link) vs. "Explore Air Compressors" when only category is known vs. "Explore All Products" when arriving cold.

### Related content strategy
Product lines list is the only "related content" this page needs — anything else (similar brands, brand rankings) would compete with the pass-through objective.

### Conversion optimization opportunities
**[NEW]** Given the fast-pass-through decision, consider collapsing the Overview tab's long-form content (long description, full stat grid) into a single expandable "About [Brand]" block rather than a whole tab — reduces the visual weight of the thing buyers are meant to move past quickly, without deleting the content entirely for the buyers who do want it.

### Trust-building elements
Manufacturer/OEM + Verified Supplier badges lead (already correct); established year and manufacturing scale as brief supporting text, not a full "Company Highlights" grid competing for first-fold space.

### Scroll hierarchy
CTA + trust badges (first fold) → product lines → (below fold) sellers/reviews/full company story.

### Expected user journey
Brand Hub visit duration should be *short* — a buyer reading this page for more than a few seconds before either tapping through or bouncing suggests the pass-through design isn't working and the page is accidentally becoming a dead end.

### Expected conversion impact
Time-on-page should *decrease* relative to today's implementation if this redesign succeeds — a counterintuitive but correct metric for a page whose job is to move buyers along, not retain them.

### Trade-offs considered
Considered removing Brand Hub as a distinct route entirely (folding it into Brand-MCat directly) — rejected, because Brand-Loyal buyers arriving cold (no category chosen yet) genuinely need one screen to pick *which* of the brand's categories they want, and merging would force a category choice before the buyer has any brand-level trust established.

---

## 5. Brand-MCat Page

*(One of the three core destination pages — the actual conversion centre.)*

### Buyer intent served
Comparison-Driven Buyer (primary, per this round's resolved priority: model-vs-model within a brand), Category Explorer arriving with preserved context (already built), Brand-Loyal Buyer arriving via pass-through.

### Mobile first fold
1. Breadcrumb (`Home > [Category] > [Brand] > [Line]`)
2. Brand-MCat name + manufacturer-OEM/verified badges
3. **The model comparison table** (already promoted to sit immediately after model selection this session) — this is the single highest-priority piece of content on the page, per the resolved comparison-priority decision
4. The preselected/highlighted model (from `?model=` context, when present)

### Desktop first fold
Model comparison table and selected-model detail can sit side-by-side (table left, spec detail right) rather than stacked — desktop width is spent making the *comparison* visible alongside the *decision*, not on unrelated content.

### Information hierarchy
1. Model comparison table (primary decision surface, per this round's resolved priority)
2. Selected model's full specifications
3. Verified dealers (scoped to the selected model)
4. Get Quotes / Connect (conversion)
5. Reviews / FAQ (supporting, below fold)

### CTA hierarchy
Primary: "Get Quotes for [selected model]" (already spec-enriched this session). Secondary: "Connect via IndiaMART" (masked, already built), shortlist. Tertiary: catalogue download, dealer location filter.

### Breadcrumb
`Home > [Category] > [Brand] > [Line]` — the deepest breadcrumb on the site, and deliberately so: this is the page where a buyer most needs to see the full trail of decisions that led here (it's also the best recovery path if something above was wrong — e.g. "actually I want a different brand" is one breadcrumb tap away).

### Intent preservation
✅ Already correct: `?model=` preselection, spec-enriched RFQ text, dealer list scoped to the selected model. **[NEW]** when a buyer switches models via the comparison table, the URL should update too (mirroring the pattern already built for Compare's shareable state) so a buyer's landed-on model is itself a durable, shareable link — currently this page's model selection is local state only, unlike Compare's.

### Related content strategy
Compare Alternatives (cross-brand equivalents, already exists on Product page — **[NEW]** consider surfacing a lighter version here too, e.g. "Not quite right? Compare [Category] across brands →" linking to the scoped Compare Brands flow) so a buyer who compares within this brand and still isn't satisfied has an obvious next step rather than a dead end.

### Conversion optimization opportunities
Dealer list already scopes to the selected model (a real, working intent-preservation win) — **[NEW]** the "no dealer for this model" empty state should suggest the closest available model with a dealer, not just offer "show all models' dealers" as the only recovery.

### Trust-building elements
Manufacturer/OEM + Verified Supplier badges at the brand level; Authorized Dealer + verification badges per dealer card — the full trust hierarchy is visible on this one page, appropriately, since it's the page closest to the actual connection.

### Scroll hierarchy
Comparison table + selected model spec (first fold) → dealers → reviews/FAQ (last).

### Expected user journey
Category (or Brand Hub) → Brand-MCat, model already selected if context existed → buyer reviews the comparison table (confirms or changes selection) → Connect/RFQ.

### Expected conversion impact
This page's Connect/RFQ click-through rate is the most important single conversion metric in the whole spec, since it's explicitly named as one of the three target destinations — every other page's design should be justified by how well it feeds this one.

### Trade-offs considered
Considered making the comparison table the buyer's *only* way to select a model (removing the card picker entirely) — rejected, because the card picker's richer visual (image, shortlist heart, "View Full Details" link) serves a browsing use case the dense table can't, and the table already syncs selection with the cards bidirectionally (row click = card selection), so both serve their purpose without duplicating effort.

---

## 6. Product Page

*(One of the three core destination pages — the highest-intent landing page given confirmed SEO-deep-landing traffic.)*

### Buyer intent served
Exact-Spec Buyer (primary — this is very often their literal landing page from a search engine), Replacement-Part Buyer, Alternative-Seeking Buyer (via Compare Alternatives).

### Mobile first fold
1. Breadcrumb (`Home > [Category] > [Brand] > [Model]`) — **[NEW]** even more critical here than elsewhere, since a cold-landed buyer's *only* orientation cue is this breadcrumb plus the page content itself
2. Product name + model number + **brand name as a real link** (already fixed this session)
3. Trust badges (manufacturer-OEM first, already correct)
4. Key spec (the one headline number a buyer searched for, e.g. "11 kW (15 HP), VSD") — **[NEW]** should render above the fold even before the full spec table, since it's very often the literal phrase the buyer searched
5. Primary CTA + Connect button, both visible without scrolling

### Desktop first fold
Product image + core info + trust badges + CTA all visible together (image left, info right) — desktop width means zero compromise between showing the product and showing the CTA, unlike mobile's necessarily stacked layout.

### Information hierarchy
1. Headline spec + trust badges (confirms "is this the right page")
2. Primary CTA + Connect (conversion, immediately reachable)
3. Full specification table
4. Sellers (scoped to this exact product, already correct)
5. Compare Alternatives (cross-brand, already exists)
6. Highlights / use cases (supporting)

### CTA hierarchy
Primary: "Get Quote" (already spec-enriched via `buildRfqRequirement`). Secondary: "Connect via IndiaMART" per seller (already built), "Compare" (already scoped to `?productId=`), shortlist, add-to-basket. Tertiary: share.

### Breadcrumb
`Home > [Category] > [Brand] > [Model]` — and, per fix #6 this session, the brand segment and the back button both now link to a real destination instead of relying on browser history that a cold-landed buyer doesn't have.

### Intent preservation
✅ Already correct: full-spec RFQ prefill, product-scoped sellers, brand link. **[NEW]** the headline spec (item 4 above) is new — currently the full spec table exists but nothing calls out the *one* value most likely to match the buyer's exact search phrase as a standalone, prominent element.

### Related content strategy
Compare Alternatives (already exists, already fixed to open a genuine comparable-quote request this session) — clearly labeled as *different companies*, not the same brand's other models (that's Brand-MCat's job).

### Conversion optimization opportunities
**[NEW]** Since this is the SEO cornerstone page (confirmed traffic-source priority), the meta description and on-page copy should both restate the headline spec in natural language, reinforcing to a buyer arriving from a search results snippet that they landed in the right place before they've even scrolled.

### Trust-building elements
Full trust hierarchy present (manufacturer-OEM, verified supplier, authorized dealer per seller, certified product where applicable) — this page carries the most trust-signal density of any page, appropriately, since it may be a buyer's very first touch with the platform.

### Scroll hierarchy
Headline spec + trust + CTA (first fold) → full specs → sellers → compare alternatives → highlights (last).

### Expected user journey
Cold search landing → confirm via headline spec + trust badges → either Connect immediately (Exact-Spec, high intent) or scroll to full specs/sellers first (still deciding) → Get Quote or Connect.

### Expected conversion impact
Given confirmed SEO-dominant traffic, this page's bounce rate and time-to-first-CTA-click are the two most important metrics on the entire site — more so than Home's, since far more real sessions touch this page first.

### Trade-offs considered
Considered a sticky "Get Quote" bar pinned to the bottom of the viewport at all times (common e-commerce pattern) — worth prototyping in Stage 2 rather than deciding definitively here, since it directly serves the "primary CTA visible throughout the journey" principle but risks visually competing with the bottom nav on mobile; flagged as an open question for the wireframe stage.

---

## 7. Compare

### Buyer intent served
Comparison-Driven Buyer (cross-brand leg — within-brand comparison is Brand-MCat's job per the resolved priority), Value-Conscious and Premium/Quality-First buyers weighing options directly.

### Mobile first fold
1. Header with supplier count + scope label (already exists)
2. Category picker, when unscoped (already correct — never preload cross-category noise)
3. First 1-2 compared supplier cards (horizontally scrollable, already exists)
4. "Share" + "Add Seller" actions (already built this session) visible without scrolling

### Desktop first fold
All currently-compared suppliers visible side-by-side without horizontal scroll, up to the 5-seller cap — desktop width directly serves comparison's core need (seeing everything at once).

### Information hierarchy
1. Category scope (must be resolved before anything else is meaningful)
2. Compared supplier cards (rating, response time, delivery, contact)
3. Comparison insights (best-rated / fastest / most-experienced callouts, already exist)
4. Spec-by-spec table (when suppliers resolve to real products)

### CTA hierarchy
Primary: "Get Quotes From All Sellers" (already exists). Secondary: "Add Seller," "Share" (already built this session). Tertiary: "View Profile" per supplier (already exists).

### Breadcrumb
`Home > [Category] > Compare` when scoped by category; `Home > [Brand] > Compare` when scoped by brand; `Home > [Product] > Compare` when scoped by product — **[NEW]** Compare currently has no breadcrumb at all; adding one both orients the buyer and gives a real "back to where I was comparing from" path, which today only exists as `router.back()`.

### Intent preservation
✅ Already correct: `?productId=`/`?brandId=`/`?category=` entry scoping, and (fixed this session) the comparison's live customization now syncs to `?sellers=` so it's durably shareable.

### Related content strategy
None beyond the comparison itself — same reasoning as Search Results: a page mid-decision shouldn't distract with unrelated recommendations.

### Conversion optimization opportunities
**[NEW]** The category-scoped entry currently preloads every seller in the category (confirmed 19 for Industrial Pumps in this session's verification) with no curation — should default to the top 5 by rating with a clear "+ N more available, tap Add Seller to browse" rather than dumping all 19 into the comparison at once, which works against the comparison-clarity goal this whole page exists for.

### Trust-building elements
Manufacturer/OEM + Verified/Authorized badges per compared card (already exists); comparison insights ("best rated," "fastest response") are themselves a trust-building device — they do the buyer's synthesis work for them.

### Scroll hierarchy
Compared cards (first fold) → insights summary → spec table (when available) → (bottom, sticky) primary CTA.

### Expected user journey
Product/Brand/Category → scoped Compare → add/remove sellers → Get Quotes From All, OR → Share the link with a colleague (new capability this session) for a multi-stakeholder decision.

### Expected conversion impact
"Get Quotes From All Sellers" click-through should correlate with comparison size (2-3 sellers) more than with the unfiltered 19-seller case — validating the curation fix above would directly test this.

### Trade-offs considered
Considered letting a buyer compare across categories (e.g. a generator against a compressor) for pure "what should I even buy" exploration — rejected, explicitly, per the existing design rationale already in the codebase: cross-category comparison produces meaningless apples-to-oranges tables and undermines the trust the comparison mechanism is meant to build.

---

## 8. Seller Listing (pattern, not a standalone page) — **[NEW / trade-off flagged]**

**This spec deliberately does not introduce a standalone `/sellers` route.** Sellers are always shown *scoped* — to a product (Product page), a model (Brand-MCat), or a comparison (Compare) — because an unscoped seller directory would either dump every seller across every category (meaningless) or require its own filtering system that duplicates Category/Compare's job. Instead, this section specifies the **seller card pattern** used consistently across those three host pages.

### Buyer intent served
Verified/Authorized-Seller-Needed (the implicit intent present in nearly every journey per `BUSINESS_ASSUMPTIONS.md` §3), Urgent/Local Buyer (delivery time + location).

### Card content (mobile and desktop identical — this is a card component, not a page)
1. Seller/dealer name
2. Location
3. Trust badges: Verified Supplier, then Authorized Dealer (with "since [year]")
4. Rating, response time, delivery time (three-column compact grid, already exists)
5. Connect via IndiaMART (masked, already built) + Get Quote

### Information hierarchy
Trust badges before performance stats before contact — a buyer needs to know a seller is legitimate *before* they care how fast the seller responds.

### CTA hierarchy
Primary (per card): "Get Quote From This Seller." Secondary: "Connect via IndiaMART."

### Intent preservation
The RFQ triggered from a seller card names that specific seller in the requirement text (already built this session), so the seller knows they were chosen specifically, not blasted a generic inquiry.

### Conversion optimization opportunities
**[NEW]** Sort order should default to rating (desc), with an explicit "Sort by: Fastest Response / Nearest" control for the Urgent/Local persona — currently sellers render in data order with no buyer-facing sort control at all.

### Trust-building elements
This card *is* a trust-building element in its entirety — see Information Hierarchy above.

### Trade-offs considered
Considered a richer seller "profile" page (reviews, full history, photos) — rejected for this platform's scope: these are IndiaMART-verified authorized dealers of standardized branded products, not independent marketplace sellers competing on reputation the way an Amazon Marketplace or eBay seller would — the manufacturer/brand relationship already carries most of the trust weight, so a deep seller-profile page would be solving a problem this catalog doesn't really have.

---

## 9. RFQ Flow (BuyLead modal + Connect + Success)

### Buyer intent served
The convergence point of every other intent — "I am ready to submit an RFQ / connect with a seller," per `BUSINESS_ASSUMPTIONS.md` §3's highest-business-value intent.

### Mobile first fold (of the modal)
1. Context-aware title ("Review & Send Requirement" when prefilled, vs. "Get Quotes From Sellers" when blank — already exists)
2. Product/brand name (pre-filled where known, editable)
3. Quantity + location (already exists, two-column)
4. Requirement text — **already spec-enriched** for Product and Brand-MCat origins this session

### Desktop adaptation
Same modal, centered rather than bottom-sheet — mobile's bottom-sheet pattern suits thumb reach; desktop has no equivalent constraint, so a centered dialog is more conventional and doesn't need the slide-up affordance.

### Information hierarchy
1. What's being requested (product/brand, pre-filled)
2. Quantity + location (required, quick to confirm rather than type from scratch when defaults are sensible)
3. Full requirement text (the highest-value field — this is what makes the resulting connection *qualified*)
4. Trust assurance ("IndiaMART Brand Guarantee," already exists)

### CTA hierarchy
Primary: "Send Requirement & Get Quotes." No secondary CTA inside the modal beyond close — this is a focused, single-purpose flow by design.

### Breadcrumb
None — a modal overlay isn't a navigable page; breadcrumb context is inherited from whichever page opened it.

### Intent preservation
✅ Already correct for the two highest-value origins (Product, Brand-MCat) and three more extended this session (CategorySearchView, ShortlistedView, per-seller). **[NEW, still open per the existing gap analysis]** the remaining brand-level and category-level generic CTAs still can't enumerate a single product's specs (correctly, since there isn't one) — but could still improve by naming whichever spec filter was active when the buyer clicked through, even without a full spec table.

### Related content strategy
None — a conversion flow shouldn't introduce browsing distractions.

### Conversion optimization opportunities
**[NEW]** The masked "Connect via IndiaMART" path (built this session) currently lives only on seller cards, not as an option *within* the RFQ modal itself — a buyer who opens the form and decides they'd rather just call should have that option without closing the modal first.

### Trust-building elements
"IndiaMART Brand Guarantee" reassurance block (already exists); the requirement text preview itself is a quiet trust-builder — a buyer can see exactly what will be sent, reducing the "will I get spammed" hesitation common before any form submission.

### Scroll hierarchy
Everything above should fit one mobile screen without scrolling where possible — this is the final conversion step, and every additional scroll here is pure friction at the moment of highest intent.

### Expected user journey
Any page's primary CTA → modal opens, pre-filled per that page's context → buyer confirms/edits → submit → Success screen.

### Expected conversion impact
Form-abandonment rate (modal opened, not submitted) is the single most actionable metric in this entire spec — every other page's design ultimately exists to get a buyer to this modal with enough confidence and context that they complete it.

### Trade-offs considered
Considered a multi-step wizard (product → quantity → requirement → review) instead of one scrollable form — rejected, since the form is already short enough (4 fields) that a wizard would add clicks without reducing cognitive load, and pre-filled context already does most of the work a wizard's step-by-step guidance would otherwise provide.

---

## 10. Shortlist

### Buyer intent served
Researcher (primary — "I am only researching," per `BUSINESS_ASSUMPTIONS.md` §3), and the return-visit leg of any persona who saved something to revisit.

### Mobile first fold
1. Three section counts (Products / Manufacturers / Categories) so a buyer instantly sees what they've saved without scrolling into each section
2. First shortlisted product card (image, name, price, "Get Custom Quote" — already spec-enriched this session)

### Desktop first fold
Same three sections, side-by-side columns where mobile stacks them — desktop width serves overview-at-a-glance better than mobile's necessarily sequential layout.

### Information hierarchy
1. Shortlisted products (most conversion-proximate — these already have a direct RFQ path)
2. Shortlisted manufacturers (one step further from conversion — still need a model chosen)
3. Shortlisted categories (furthest from conversion — still need brand and model)

### CTA hierarchy
Primary (per product card): "Get Custom Quote" (already spec-enriched). Secondary (per brand card): "Send Bulk Inquiry." Tertiary: remove (trash icon), navigate to the full page.

### Breadcrumb
`Home > Shortlist` — one level, reached from the nav/profile, not nested under anything else.

### Intent preservation
✅ Product-level RFQs are now spec-enriched (this session). **[NEW, honest limitation, already documented]** the shortlist itself is session-scoped only (no real persistence) — per the resolved fix this session, it now starts honestly empty rather than showing misleading seed data, but a true "save across visits" capability would require real persistence this prototype doesn't have. This should be stated plainly in-product (e.g. a small note: "Saved items are kept for this browsing session") rather than silently surprising a returning buyer.

### Related content strategy
Empty-state CTAs ("Browse Catalog Directory") for each of the three sections independently — a buyer with zero shortlisted products but some shortlisted brands shouldn't see one generic empty state covering everything.

### Conversion optimization opportunities
**[NEW]** Since B2B purchases are frequently multi-stakeholder (per the resolved shareable-comparison decision), the Shortlist itself is a natural second candidate for a share link — a buyer building a shortlist for their manager's review is a very plausible real workflow this page doesn't yet support.

### Trust-building elements
Same trust badges as their host pages (Verified Supplier, manufacturer-OEM) carried through onto the shortlist cards — a buyer shouldn't lose the confidence signals they saw when they originally saved the item.

### Scroll hierarchy
Section counts + first product (first fold) → remaining products → manufacturers → categories (in conversion-proximity order, as above).

### Expected user journey
Save from any page (heart icon) → later, Profile → Shortlist → review saved items → convert one or more via their pre-filled RFQ paths.

### Expected conversion impact
Shortlist-to-RFQ conversion rate is a good proxy for whether "save for later" is genuinely serving the Researcher persona's real workflow, versus being a feature buyers use once and forget.

### Trade-offs considered
Considered auto-expiring old shortlist items to keep the list "fresh" — rejected, since with no real persistence in the first place, artificial expiry would only add complexity without solving the actual gap (durability), and would risk feeling punitive to a buyer who *did* return within the same session.

---

## Cross-page summary: does this hit the Primary Objective?

| Page | Role toward "90% reach Product/Brand-MCat/Category fast" |
|---|---|
| Home | Routes via search (fastest) or guided discovery/browse (fallback) |
| Search Results | Ideally invisible (confident redirect); routes ambiguous cases |
| **Category** | **Core destination** |
| Brand Hub | Deliberately fast pass-through, not a destination |
| **Brand-MCat** | **Core destination** — now the primary comparison surface too |
| **Product** | **Core destination** — the SEO-confirmed most common cold landing |
| Compare | Supports decision-making from any of the three core pages, doesn't compete with them |
| Seller Listing (pattern) | Embedded in the three core pages, not a separate hop |
| RFQ Flow | The conversion event every core page leads to |
| Shortlist | Return-visit support, outside the primary fast-path |

Every non-core page in this spec either feeds one of the three core pages directly (Home, Search, Brand Hub) or supports a decision already happening on one of them (Compare, Seller Listing, RFQ Flow) — none compete with the core pages for a buyer's attention.

## Items marked **[NEW]** — approved, all 9

1. ✅ Product page's "headline spec" as a standalone first-fold element, separate from the full spec table.
2. ✅ Brand-MCat's model selection syncing to the URL (matching Compare's pattern) for shareability.
3. ✅ Brand Hub's Overview content collapsing into a single expandable block rather than a full tab, to reinforce the fast-pass-through design.
4. ✅ Compare's category-scoped entry defaulting to top-5-by-rating instead of preloading all sellers unfiltered.
5. ✅ Seller card pattern gaining an explicit sort control (rating / fastest response / nearest).
6. ✅ "Connect via IndiaMART" becoming reachable from *inside* the RFQ modal, not only from seller cards.
7. ✅ Shortlist gaining a share-link capability, mirroring Compare's.
8. ✅ An explicit in-product note that Shortlist is session-scoped, not persisted.
9. ✅ Sticky bottom "Get Quote" bar on Product page — resolved to **include** (no longer open); will render it in Stage 2 and can be dropped there if it visually conflicts with the mobile bottom nav.

All 9 confirmed 2026-07-03. Proceeding to Stage 2 (visual wireframes).

---
---

# Stage 1.5 — Scroll-Aware Navigation & Adaptive Search (Addendum)

Layers a cross-cutting scroll-behavior system on top of the page specs above. Written per your direction — addendum first, then Stage 2's wireframe gets a live scroll simulation once this is approved. Formalizes and supersedes Stage 1's item #9 (the previously-"open" sticky Get Quote bar on Product) as one instance of the general sticky-CTA rule below, rather than a one-off.

## Grounding: a real gap this addendum has to solve first

Before specifying *behavior*, one thing needs establishing: **on mobile, search currently only exists on the Home page.** `BottomNav.tsx` has zero search affordance, and none of Category, Brand Hub, Brand-MCat, or Product carry any search input — confirmed by direct inspection, not assumed. `DesktopNav`'s header search exists but is hidden on mobile (`hidden md:flex`). So a mobile buyer who leaves Home currently has no way to search again short of navigating back. The master prompt's "search should remain highly accessible throughout product exploration" isn't a behavior to *animate* yet — it's a control that doesn't exist yet on 9 of the app's 10 mobile pages. This addendum specifies both: where it goes, and how it behaves.

**[NEW]** Resolution: a persistent, icon-collapsed search entry point joins the mobile chrome globally (not just Home) — collapsed to a single tap-target icon by default on every page except Home (which keeps its full hero search), expanding per the adaptive rules below.

---

## Global scroll-behavior system

*(Defined once — every page in §1–§10 above inherits this unless a page-specific exception is noted in the table further down.)*

### Direction detection and threshold
Raw per-pixel scroll events are noisy — a state change on every pixel would flicker. Rule: track cumulative scroll delta since the last state flip; only flip hidden/revealed after **24px** of continuous same-direction movement. This is large enough to ignore momentum jitter and small enough to feel immediate relative to a real scroll gesture.

### Bottom Navigation
- **Scroll down** (past threshold): translateY(100%), fully hidden — maximizes viewport for content, per the master prompt's "scrolling down = evaluating, minimize persistent UI."
- **Scroll up** (past threshold): translateY(0), fully revealed — "scrolling up = wants to redirect," so navigation must be immediately reachable.
- **At true top of page** (scrollY near 0): always revealed, regardless of prior state. A buyer who has not scrolled yet has shown no "evaluating" intent to respect.
- **At true bottom of page**: always revealed and *stays* revealed even if the buyer continues an upward micro-scroll-bounce (iOS rubber-banding) — prevents flicker at the exact point where a buyer most needs the nav (nothing left to read, time to go somewhere else).

### Adaptive Search
- **Collapsed state** (default on every page except Home): a single icon in the compact mobile header, roughly 36x36px tap target.
- **Scroll down**: expands to a full input field, inline in the header — "scrolling down = evaluating, keep refinement accessible," per the master prompt.
- **Scroll up**: collapses back to icon-only — "scrolling up = navigation intent," and an expanded input competes for the same header space the buyer needs for wayfinding.
- **Exception, absolute priority over the above**: never auto-collapse while the input has focus or contains an uncommitted query. A buyer mid-type must never have the field yanked away from them because they paused to think and the scroll listener fired.

### Sticky components: the general rule
An element stays sticky (survives both scroll directions, never hides) **only if removing it would block the page's one Primary CTA** (per the Stage 1 CTA-hierarchy pattern) **or a filter/sort control the buyer needs mid-browse.** Concretely: "Get Quote" / "Connect via IndiaMART" / "Compare Brands" / "Get Quotes From All Sellers" (whichever is that page's tagged Primary CTA in the sections above) plus, on Category, the active filter chip row. Nothing decorative or informational is ever sticky — matches the master prompt's explicit "avoid sticky promotional banners."

### Animation specification
| Property | Hide (scroll down) | Reveal (scroll up) |
|---|---|---|
| Transform | translateY(100%) for nav; width/scale collapse for search | translateY(0) / expand |
| Duration | 200ms | 160ms |
| Easing | ease-in (accelerates away — content should feel like it is taking over) | ease-out (decelerates into place — control should feel like it is being handed back promptly) |
| Reduced motion | Both become an instant (0ms) state swap, no transform animation — respects prefers-reduced-motion, consistent with the rest of this codebase's existing pattern (already applied to the Stage 2 artifact) |

Reveal is intentionally faster than hide (160ms vs 200ms) — asymmetric on purpose: giving control back should never feel like it is lagging behind the buyer's request for it, while hiding chrome can afford to feel slightly more relaxed since it is not blocking anything.

### Edge cases (global)
| Case | Behavior |
|---|---|
| Fast/flick scroll | Same 24px threshold applies per-frame-batch, not per-event — a single large flick still only triggers one state flip, not a rapid hide-show-hide flicker |
| Reaching true top | Nav and search chrome forced to revealed state (see above) |
| Reaching true bottom | Nav forced to revealed state; search stays whatever the last scroll-direction state was (bottom-of-page is not a "wants to redirect" signal the way scroll-up is) |
| Search actively focused or typing | All scroll-driven collapse suspended for search (not for Bottom Nav — a buyer can still scroll-navigate away while search is focused, that is a valid intent too) |
| Filter/sort sheet open (Category) | Scroll-behavior on the underlying page suspends entirely — the sheet has the buyer's attention, nothing should animate underneath it |
| RFQ modal / Add-Seller sheet open | Same as above — the host page's scroll listeners pause while any modal/sheet has focus, consistent with how these already work as focused, single-purpose flows (RFQ Flow section above) |
| Rapid direction reversal (buyer scrolls down then immediately up) | The 24px cumulative-delta counter resets on any direction change — prevents a hide animation from starting only to immediately reverse mid-transition, which reads as jittery rather than intentional |

---

## Per-page specification

Six of the ten pages carry an obvious Primary CTA identified in the sections above already — this table maps that CTA (and any page-specific exception) onto the global system rather than re-deriving one from scratch. "Product Listing," "Brand Store," "Manufacturer," and "Supplier" from the master prompt's page list are the same surfaces as Category, Brand Hub, and the Seller Listing pattern respectively in this app's actual IA — mapped explicitly, not duplicated as new pages.

| Page | Sticky (survives all scroll) | Hides on scroll-down | Reveals on scroll-up | Page-specific note |
|---|---|---|---|---|
| **Home** | Nothing — Home has no Primary CTA in the sticky sense (search is the whole first fold already) | Bottom Nav | Bottom Nav | Keeps its full hero search always expanded — it is not the collapsed-icon pattern the other 9 pages use, since Home *is* the search page |
| **Search Results** | Nothing | Bottom Nav, search (already expanded — collapses on scroll-up like elsewhere) | Bottom Nav | The query text itself is part of the header, not the collapsible search field — stays visible so a buyer never loses track of what they searched |
| **Category** *(core)* | "Compare Brands" primary CTA, active filter chip row | Bottom Nav, adaptive search | Bottom Nav, adaptive search | Filter/sort sheet, when open, freezes all scroll-behavior (global edge case) |
| **Brand Hub** | "Explore [Brand]'s Range" primary CTA | Bottom Nav, adaptive search | Bottom Nav, adaptive search | Given this page is a deliberate fast pass-through, the sticky CTA matters *more* here than on a page buyers linger on — it should be reachable the instant a buyer decides to move on |
| **Brand-MCat** *(core)* | "Get Quotes for [model]" primary CTA | Bottom Nav, adaptive search | Bottom Nav, adaptive search | When the model comparison table's own row-selection is mid-interaction, scroll-behavior is not suspended — this is a lightweight interaction, not a modal |
| **Product** *(core)* | "Get Quote" primary CTA — resolves Stage 1's item 9, now a formal rule instance, not a one-off | Bottom Nav, adaptive search | Bottom Nav, adaptive search | On a long spec table, the sticky CTA bar shows a condensed one-line context ("GA 11 VSD+, Rs 2,20,000 onwards") so the buyer does not lose track of which product the sticky button refers to after scrolling past the header |
| **Compare** | "Get Quotes From All Sellers" primary CTA | Bottom Nav, adaptive search | Bottom Nav, adaptive search | Add-Seller sheet, when open, freezes scroll-behavior (global edge case) |
| **Seller Listing pattern** | Inherits whichever host page it is embedded in (Product/Brand-MCat/Compare) — not an independent scroll context | not applicable | not applicable | No standalone behavior, consistent with the earlier "not a route" decision |
| **RFQ Flow** | Entire modal is exempt — see global edge case (modal suspends host page scroll-behavior); inside the modal, "Send Requirement" is sticky to the modal's own bottom edge (already effectively true today) | not applicable (modal, not a scrolling page in the same sense) | not applicable | — |
| **Shortlist** | Nothing — no single dominant conversion action (three sections, each with their own per-item CTA) | Bottom Nav, adaptive search | Bottom Nav, adaptive search | — |

## Conversion rationale, answered once for the whole system

Per the master prompt's own "Conversion First" checklist:
- **Reduces scrolling?** Yes — hidden chrome on scroll-down directly returns viewport height to content.
- **Helps buyers find products faster?** Yes — the new persistent (collapsed) search closes the confirmed gap where search was previously unreachable past Home.
- **Preserves shopping intent?** Yes — sticky CTAs are scoped to exactly the one Primary CTA already defined per page in Stage 1, never a generic or promotional element.
- **Increases enquiry generation?** Directly targeted — the sticky CTA rule exists specifically so the RFQ/Connect action is never more than one tap away regardless of scroll position.
- **Reduces cognitive load?** Yes — one consistent hide/reveal rule across all 10 pages means a buyer only has to learn the pattern once.
- **Maximizes usable content area?** Yes, by design, on every scroll-down.

## Open item — resolved

**Whether the sticky Product-page CTA conflicts with the Bottom Nav when both are visible at once:** resolved, no conflict, confirmed two ways.

1. **In the real app:** each core page's CTA footer is a `shrink-0` element inside the page's own `flex flex-col` root, rendered as the last flow element above the scrollable region — not `fixed`. The page content sits inside `PageContentFrame`'s `pb-20` (80px), which reserves clearance for the Bottom Nav's 56px height plus margin. The CTA footer therefore always renders above that reserved zone regardless of whether the Bottom Nav is currently hidden or revealed — they occupy different layers by construction, not by scroll-position luck.
2. **In the Stage 2 wireframe's live scroll simulation:** the simulated CTA (`.sim-cta`) is explicitly positioned `bottom: 40px` — directly above the 40px-tall simulated nav bar, non-overlapping by the same construction. Scrolling to true bottom in the artifact (forcing both elements visible per the edge-case rule) confirms this visually.

Implemented and deployed as part of the scroll-aware navigation build (`ScrollChromeProvider`, `MobileSearchBar`, updated `BottomNav`) — this addendum is no longer just a spec, it's running in the app.
