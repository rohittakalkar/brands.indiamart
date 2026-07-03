# Business Assumptions — Ideal Buyer Journey Benchmark

**Status:** Drafted from first principles (buyer psychology, B2B marketplace expertise, and the product-discovery interview below) — **not derived from the current codebase.** This is the benchmark. Phase 2 (comparing the live implementation against it) begins only after this document is approved.

**Methodology note:** Every buyer intent, journey, and principle below was defined before any code, route, or component was consulted. Where the current implementation happens to already do the right thing, that's confirmed independently in Phase 2 — it isn't assumed correct here just because it's already built.

---

## 1. Product Vision

**"Brands by IndiaMART" is a confidence layer on top of core IndiaMART search** — not a separate marketplace competing with it, and not a lead-gen funnel optimized purely for maximum RFQ volume.

Where a generic IndiaMART search result surfaces inconsistent, seller-authored listings of uncertain provenance, this product's distinct value is:
1. **Standardization** — every listing follows the same rigorous template (verified specs, consistent trust badges, consistent comparison structure), because these are genuine branded/manufacturer-backed products, not arbitrary seller-generated listings.
2. **Comparability** — a buyer can compare *models within a brand*, *brands within a category*, and *sellers within a model* with confidence that the underlying data is accurate and apples-to-apples, not marketing copy.
3. **Verified connection** — the journey's endpoint is a buyer reaching a genuinely authorized seller of a genuinely authentic product, with enough shared context (from comparison and RFQ) that the resulting conversation is qualified from the first message, not a cold inquiry.

The product is not measured by "did we minimize form friction" (a pure lead-gen lens) but by **"did the buyer leave more confident and better-informed than a generic marketplace search would have left them, and did that confidence convert into a real connection?"**

---

## 2. Buyer Personas

Presented without a priority ranking — per the interview, every segment below deserves equally rigorous design; trade-offs are resolved case-by-case rather than by a fixed hierarchy.

| Persona | Defining trait | Core question they're asking |
|---|---|---|
| **The Exact-Spec Buyer** | Already knows the precise model or spec (often has a datasheet or an old invoice in hand) | "Where do I find this exact thing, and who sells it near me?" |
| **The Category Explorer** | Knows the product type, has no brand preference yet | "What are my options, and which brand should I trust?" |
| **The Brand-Loyal Buyer** | Trusts a specific manufacturer from past experience or company policy | "Show me everything this brand offers for my need." |
| **The Comparison-Driven Buyer** | Wants to weigh multiple options side-by-side before deciding — per this review, this persona's core comparison instinct is *model-vs-model within a brand* first, brand-vs-brand and seller-vs-seller second | "Which exact configuration is right, and how do the options differ?" |
| **The Problem/Application-Driven Buyer** | Describes a problem or use case, not a product category ("I need to keep my factory floor cool," not "I need a chiller") | "What product category even solves my problem?" |
| **The Replacement-Part Buyer** | An existing machine/part failed; needs an equivalent, fast | "What's the exact or closest-equivalent replacement, and how fast can I get it?" |
| **The Researcher** | Not buying today — gathering information for a future decision, a boss, or a committee | "I need to come back to this later with what I've learned." |
| **The Urgent/Local Buyer** | Time-pressured; delivery speed and seller proximity outweigh brand preference | "Who can get this to me fastest, nearby?" |
| **The Value-Conscious Buyer** | Price-sensitive; wants the most defensible option at the lowest cost | "What's the cheapest option that still meets my spec?" |
| **The Premium/Quality-First Buyer** | Willing to pay more for the most capable/reliable option | "What's the best available, regardless of price?" |
| **The Compliance-Driven Buyer** | Needs specific certifications for a tender, audit, or regulation (ISI, CE, ISO, etc.) | "Does this meet the certification my project/client requires?" |

---

## 3. Buyer Intent Catalogue

Ranked by real-world frequency, business value, conversion potential, and strategic importance (1 = highest). This ranking describes each intent's natural properties — it does **not** imply lower-ranked intents deserve weaker design, per the "no segment priority" decision above.

| Rank | Intent | Frequency | Business value | Conversion potential | Notes |
|---|---|---|---|---|---|
| 1 | I know only the category/application, not the brand | Very high | High | Medium (needs nurturing through comparison) | The largest-volume entry intent in most industrial marketplaces |
| 2 | I know the exact product/model | Medium-high | Very high | Very high | Smaller volume, fastest and most reliable to convert |
| 3 | I want to compare models within a brand | High (once a brand is chosen) | High | High | Central per this review's stated comparison priority |
| 4 | I want to compare brands | Medium-high | High | Medium | The category-first buyer's natural second step |
| 5 | I need a verified/authorized seller, not just any seller | High (implicit in nearly every journey) | Very high | High | This is the trust layer underlying every other intent |
| 6 | I need an authentic/genuine product (anti-counterfeit concern) | Medium-high | Very high | High | Named as the #1 trust signal in this review |
| 7 | I know only the brand, want to see their range | Medium | Medium-high | Medium | Brand-loyal buyers |
| 8 | I need a replacement/equivalent part | Medium | High | High | Urgency-driven, high willingness to convert quickly |
| 9 | I need fast/local delivery | Medium | Medium | Medium-high | Often a filter on top of another intent, not standalone |
| 10 | I want technical specifications/documentation | High (implicit) | Medium | Low-medium | Confidence-building, not itself a conversion event |
| 11 | I want certifications for compliance | Low-medium | High (for the buyers who have it) | High (for that segment) | Narrow but high-stakes when present |
| 12 | I want the cheapest option | Medium | Low-medium | Medium | Price-sensitive segment; risk of racing to the bottom if over-indexed |
| 13 | I want the premium/best option | Low-medium | High | Medium-high | Smaller segment, higher order value |
| 14 | I am only researching (not ready to buy) | Medium-high | Low (short-term) / High (long-term) | Very low (short-term) | Needs a "save for later" path, not a hard conversion push |
| 15 | I want an equivalent from a different brand (alternative-seeking) | Low-medium | Medium | Medium | Comparison shopping across brands for one spec |
| 16 | I am ready to submit an RFQ / connect with a seller | High (terminal intent) | Very high | N/A (this *is* the conversion) | The convergence point of nearly every other intent |

---

## 4. Ideal Buyer Journeys

Full depth for the five highest-priority intents; a lighter table follows for the remainder.

### 4.1 The Exact-Spec Buyer

| Stage | Detail |
|---|---|
| **Buyer Intent** | "I know exactly what I need — a specific model or an unambiguous spec." |
| **Buyer Question** | "Where is this exact thing, and who do I talk to?" |
| **Information Needed** | Confirmation this is the right item; who sells it; how fast; what it costs |
| **Expected Content** | Full spec sheet, price range, delivery time, authorized sellers of *this exact item only* |
| **Expected CTA** | "Connect with a Verified Seller of [exact model]" |
| **Expected Next Step** | Either connect immediately, or a one-click comparison against 2-3 close alternatives (in case the buyer's "exact" spec has better-fit options they didn't know existed) |
| **Expected Context to Preserve** | The exact model/spec must be visible and referenced at every subsequent step — never re-asked |
| **Expected Conversion Goal** | Fastest possible qualified connection — this buyer should convert in the fewest steps of any persona |

### 4.2 The Category Explorer

| Stage | Detail |
|---|---|
| **Buyer Intent** | "I need this type of product, no brand preference yet." |
| **Buyer Question** | "What are my options, and which is trustworthy?" |
| **Information Needed** | The full landscape of available brands for this category; how they differ; which have verified sellers nearby |
| **Expected Content** | Brand comparison (ratings, credentials, price tiers), the category's common specs/use-cases to help the buyer articulate their own need |
| **Expected CTA** | "Compare Brands" as the primary action; a narrower spec filter as a secondary refinement |
| **Expected Next Step** | Narrow by spec → pick a brand → land on that brand's exact model range for this category, **already filtered to the spec just chosen** |
| **Expected Context to Preserve** | Category + any spec filter applied must carry into the brand and model-selection stages — this is the single most failure-prone hand-off in the entire journey, because it requires state to survive two consecutive screen transitions |
| **Expected Conversion Goal** | A confident brand+model decision, then connection — this buyer takes the most steps of any persona, so every step must clearly earn its place |

### 4.3 The Comparison-Driven Buyer (model-vs-model within a brand)

| Stage | Detail |
|---|---|
| **Buyer Intent** | "I've chosen a brand (or arrived at one); now which exact configuration is right?" |
| **Buyer Question** | "How do these models actually differ, and which fits my requirement?" |
| **Information Needed** | Side-by-side specs across the brand's model range for this category — power, capacity, price, delivery — with differences highlighted, not just listed |
| **Expected Content** | A model comparison table as the **primary** surface (per this review's explicit priority), not a secondary tab; brand-vs-brand and seller-vs-seller comparisons available but visually secondary |
| **Expected CTA** | "Compare These Models" prominently, "Compare Sellers of [chosen model]" as a clearly secondary action once a model is picked |
| **Expected Next Step** | Model chosen → seller list scoped to *that exact model* → connection |
| **Expected Context to Preserve** | Whichever model the buyer is actively comparing/hovering/selecting must be what every subsequent CTA (Get Quote, Connect, spec detail) refers to |
| **Expected Conversion Goal** | A model decision the buyer feels *confident* about, not just fast — this persona's success is measured by decision quality, not speed |

### 4.4 The Brand-Loyal Buyer

| Stage | Detail |
|---|---|
| **Buyer Intent** | "I already trust this brand — show me their range for my need." |
| **Buyer Question** | "Does this brand make something for my situation, and where?" |
| **Information Needed** | Full brand credential depth (history, certifications, manufacturing scale) reinforcing the trust already present, plus the specific product line matching their need |
| **Expected Content** | Brand story/credentials up front (reinforcing, not re-selling, since trust already exists), then product lines, then the specific model comparison (4.3) once a line is chosen |
| **Expected CTA** | "Explore [Brand]'s [Category] Range" |
| **Expected Next Step** | Product line → model comparison (4.3) → connection |
| **Expected Context to Preserve** | If this buyer arrived with any category/spec context (e.g., from a search), it should still be honored even though brand trust is the entry point — brand-first and category-first are not mutually exclusive intents |
| **Expected Conversion Goal** | Reinforce existing trust into a specific, qualified connection — this buyer is a warm lead the moment they arrive; the journey should not accidentally cool them down with friction |

### 4.5 The Direct/Cold-Landing Buyer (SEO-driven)

| Stage | Detail |
|---|---|
| **Buyer Intent** | Any of the above — but arriving with **zero in-app history**, straight from a search engine, onto a specific product, brand, or category page |
| **Buyer Question** | "Is this the right page for what I searched, and can I trust what I'm seeing?" |
| **Information Needed** | Everything a warm visitor would need, self-contained on this one page — this buyer cannot rely on anything "established earlier" because nothing was |
| **Expected Content** | Full context on the landing page itself: what this is, why it's trustworthy, and clear paths both deeper (to comparison/connection) and *sideways* (to the brand, to the category, to alternatives) — since a cold-landed buyer often wants to verify by exploring adjacent pages before committing |
| **Expected CTA** | Whatever matches the page (product → connect/compare; category → compare brands; brand → explore range) |
| **Expected Next Step** | Must not assume any prior navigation exists — "back" must go somewhere logical and real, not rely on browser history that doesn't exist for this buyer |
| **Expected Context to Preserve** | Nothing *incoming* (there's no prior context), but everything discovered on this page (which product/brand/spec) must carry forward into whatever the buyer does next, exactly like a warm visitor |
| **Expected Conversion Goal** | Given SEO-deep-landing is the dominant traffic pattern for this product, this journey's quality is not a secondary concern — it deserves the same design rigor as the homepage funnel, not less |

### 4.6 Remaining intents (lighter treatment)

| Intent | Expected content emphasis | Expected CTA | Context to preserve |
|---|---|---|---|
| Problem/application-driven | Guided category discovery ("what solves this?"), not a search box expecting product vocabulary the buyer doesn't have | "Find the right category" | The stated problem, so category suggestions stay relevant |
| Replacement part | Fast equivalent-matching, minimal browsing | "Find a Replacement" | Original spec, if the buyer provides it (e.g. old model number) |
| Researcher (not ready to buy) | Save/shortlist paths that genuinely persist | "Save for Later" | Everything shortlisted, durably, across sessions |
| Urgent/local | Delivery time and seller location surfaced early and prominently | "Fastest Available Near [Location]" | Location, once given, across the rest of the session |
| Value-conscious | Price sorted/filterable prominently, without hiding quality signals | "Compare by Price" | Price sensitivity, reflected in default sort order |
| Premium/quality-first | Leading with capability/certifications, not price | "Compare by Capability" | — |
| Compliance-driven | Certifications surfaced as a first-class filter, not buried in a spec table | "Filter by Certification" | The required certification, carried into RFQ/connection |
| Alternative-seeking | Cross-brand equivalent suggestions, clearly labeled as *different* companies | "See Comparable Alternatives" | The original product being compared against |

### 4.7 The connection mechanism (resolved)

Two conversion paths exist, and **neither ever exposes either party's real phone number** — this is a resolved design decision, not an open question. Calls route through IndiaMART's own masked/proxy-number infrastructure in both directions: the seller is reached via a proxy ("PNS"-style) number, and the buyer is connected via their own masked/segmented number — the two parties can talk without either one learning the other's actual phone number.

| Path | Mechanism |
|---|---|
| **"Get Quote" (RFQ)** | Buyer submits a detailed requirement (as today); connection happens via the masked-calling system once a seller responds — this path already captures full buyer detail through the form itself |
| **"Connect Directly" (new, lighter path)** | One tap from a seller card initiates a masked call/connection immediately — no separate identity-capture step is needed *for spam-prevention purposes*, since number-masking itself is what prevents raw contact-detail harvesting, not a form gate |

**Design implication:** CTA copy should never imply a raw number is being shown (e.g. never "View Phone Number") — it should reflect a mediated connection (e.g. "Connect Now," "Call via IndiaMART"). This is a real infrastructure pattern already used by IndiaMART today, not a hypothetical.

---

## 5. Intent Preservation Principles

These are the general rules every screen transition in this product must satisfy — independent of how the current code does or doesn't meet them.

1. **Nothing already expressed should ever be re-asked.** If a buyer has searched, filtered, selected a category, chosen a brand, picked a model, or typed a spec anywhere, that information must be available (visibly or invisibly) on every subsequent screen without the buyer repeating it.
2. **Every screen should answer "why am I here" in terms of what the buyer just did**, not just describe itself generically. A brand page reached from a filtered category search is a different experience than the same brand page reached cold — the former must acknowledge the path that led there.
3. **The connection/RFQ moment is the accumulation point.** By the time a buyer reaches "connect with a seller," the resulting message/requirement should read as if the buyer wrote it themselves after fully explaining their situation — because functionally, they already did, one step at a time.
4. **Comparison state deserves the same durability as navigation state.** If a buyer builds a comparison (of models, brands, or sellers), that comparison should be shareable, bookmarkable, and resumable — not lost the moment they navigate away.
5. **Trust signals discovered earlier should reinforce, not vanish, at the connection moment.** If a buyer was convinced by an authenticity badge on a product page, that same reassurance should still be visible when they take the final connecting action — confidence built early shouldn't have to be rebuilt at the finish line.
6. **A cold landing is not a lesser journey.** Since organic search traffic dominates, a buyer arriving with zero history deserves the same completeness and continuity *going forward* as a buyer who browsed in from the homepage — the only difference is what context exists *before* they arrived (none), not after.
7. **Recovery must always be possible without loss.** If a buyer's context can't be perfectly carried forward (e.g., they open the site in a new tab, or return after closing it), the recovery path should degrade gracefully to an honest, clearly-labeled starting point — never to something that *looks* like their prior state but silently isn't.

---

## 6. KPIs & Funnel

**Funnel stages**, aligned to the north-star of verified supplier connection:

1. **Landing** — SEO/search/direct arrival on any page
2. **Discovery** — category, brand, or product exploration
3. **Comparison** — model-vs-model (primary), brand-vs-brand, seller-vs-seller (secondary)
4. **Confidence validation** — trust signals (manufacturer authenticity foremost) consulted
5. **Connection** — RFQ submission *and/or* one-tap "Connect Directly" (both are valid conversion events; both route through masked/proxy calling — see §4.7 — never a raw phone-number exchange)
6. *(off-platform, unmeasurable on this product)* — deal closure

**KPIs per stage** (framed as what *should* be measured in a live system with real analytics — this prototype has none today, consistent with its documented scope):

| Stage | KPI |
|---|---|
| Landing | Landing-page relevance to search intent (proxy: bounce rate by entry page type) |
| Discovery | % of sessions that reach a comparison view |
| Comparison | Average models/brands/sellers compared per session; comparison completion rate (started vs. finished) |
| Confidence | Trust-badge/certification visibility engagement (proxy: hover/tap rate, if instrumented) |
| Connection | Combined connection rate (RFQ + direct contact) as % of product-page sessions; connection *quality* (spec-completeness of the resulting requirement) |
| Structural | % of journeys where context was lost and had to be re-entered (this is the direct, measurable proxy for "intent preservation" itself) |

**Acknowledged structural limitation:** because deal closure happens off-platform (a phone call, an email, a site visit), true ROI/conversion-to-sale can never be fully measured on-platform — the funnel's last measurable event is "connection," not "sale." This is inherent to the chosen business model, not a gap to be engineered around.

---

## 7. Resolved Decisions (formerly Open Questions)

All five were resolved directly rather than left as assumptions:

1. **Contact-reveal identity gate:** Neither buyer nor seller phone numbers are ever exposed to each other. Both the RFQ path and the new "Connect Directly" path route through IndiaMART's masked/proxy-calling infrastructure (seller-side proxy numbers, buyer-side masked/segmented numbers) — see §4.7. No separate identity-capture gate is needed for spam prevention, since masking itself provides that protection at the infrastructure level.
2. **Certifications:** No single framework — relevant certifications vary genuinely by category (e.g. pressure-equipment standards for compressors, electrical safety marks for switchgear/PLCs, BIS/ISI where applicable). A "Filter by Certification" capability should surface whichever certification is actually relevant per category, not a single universal badge.
3. **Shareable comparisons:** Yes — a buyer's comparison (or shortlist) should be shareable via a durable link, so a colleague or manager can view the identical comparison without rebuilding it. This directly serves the multi-stakeholder reality of B2B procurement decisions.
4. **Cross-brand vs. within-brand model comparison:** Within-brand model-vs-model stays the primary comparison surface (confirmed). Cross-brand comparison (e.g. Kirloskar's 15 HP option vs. Atlas Copco's 15 HP option) remains available, but through the separate, secondary Compare Brands/Sellers flow — not merged into the primary model table.
5. **Geography/language scope:** India-only, English-only — confirmed, consistent with the "curated-brand showcase, no near-term expansion" future vision.

---

## 8. Assumptions

Remaining assumptions not covered by the resolved decisions above — please correct any that are wrong:

1. **No on-platform payment:** consistent with "curated-brand showcase, no near-term transactional pivot" — the journey ends at connection, not checkout.
2. **"Seller," "dealer," and "authorized dealer" are treated as the same underlying concept** (a business authorized to sell a given brand's products) unless a future review distinguishes them further.
3. **Every persona in §2 is assumed to be a real, present segment today**, not a future-state aspiration — this review's "no priority" answer implies all are currently relevant, not that some are speculative.
4. **The "confidence layer" positioning is assumed to apply uniformly across all categories** in the catalog (pumps, generators, compressors, motors, PLCs, switchgear, water coolers, power tools) — no category is assumed to need a fundamentally different journey shape, though content depth may reasonably vary.
5. **Multi-seller RFQ broadcast** (one requirement sent to several sellers simultaneously, as in some global B2B marketplace patterns) is **not** assumed to be in scope — the resolved connection mechanism (§4.7) is a single, mediated buyer↔seller connection, consistent with IndiaMART's own pattern rather than a broadcast-to-many model.
6. **Share links for comparisons (§7.3) are assumed to be view-only** for the recipient (a colleague can see the comparison, not necessarily edit/add to it) unless a future review specifies collaborative editing is needed.

---

## Next step

This document is the benchmark. It intentionally makes no reference to routes, components, or existing pages. Once approved (with any corrections to §7/§8), Phase 2 will compare the live implementation against every journey in §4 and every principle in §5, explicitly distinguishing, for each finding: verified from code, verified from localhost, confirmed by you, or recommended based on B2B marketplace best practice.
