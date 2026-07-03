# Phase 2 — Live Implementation vs. the Ideal Buyer Journey Benchmark

Compares the current codebase and running app against every journey and principle in [`BUSINESS_ASSUMPTIONS.md`](BUSINESS_ASSUMPTIONS.md). Per that document's ground rule, the benchmark was fixed *before* this analysis — nothing here retroactively adjusted the ideal to match what's already built.

**Evidence tags**, used on every claim below:
- **[CODE]** — verified by reading the source directly (cited with file/line)
- **[LIVE]** — verified by driving a real browser against a local production build (`next build` + `next start`)
- **[OWNER]** — confirmed directly by you during the interview
- **[BEST PRACTICE]** — a recommendation grounded in B2B marketplace expertise, not yet verified against this codebase because the capability doesn't exist to check

---

## Summary verdict

| Journey / Principle | Verdict |
|---|---|
| 4.1 Exact-Spec Buyer | ✅ Preserved |
| 4.2 Category Explorer | ✅ Preserved (fixed earlier this session) |
| 4.3 Comparison-Driven Buyer (model-vs-model) | ⚠️ Partially preserved — capability exists, prominence doesn't match the benchmark |
| 4.4 Brand-Loyal Buyer | ✅ Preserved |
| 4.5 Direct/Cold-Landing Buyer | ⚠️ Partially preserved — page-level content is fine, lateral navigation is broken |
| 4.6 Secondary intents (problem-driven, researcher, compliance, etc.) | ❌ Mostly unsupported |
| 4.7 Connection mechanism (masked calling) | ❌ Broken — directly contradicts the resolved decision |
| §5 Intent Preservation Principles | ⚠️ 4 of 7 solidly met, 3 partially or not met |

---

## 4.1 The Exact-Spec Buyer

**Verdict: ✅ Preserved.**

- Hero and header search both resolve confidently-matched queries straight to `/products/[id]`, skipping all browsing **[CODE: `src/lib/search.ts`'s `resolveSearch()`]**.
- Token-based, order-independent matching handles realistic multi-word phrasing ("Atlas Copco air compressor 15 HP") rather than requiring an exact literal match **[CODE, fixed earlier this session]**.
- Product page shows full specs, sellers scoped to the exact product only, and Compare Alternatives **[LIVE, verified against `/products/atlascopco-ga11`]**.
- RFQ prefill is built from the product's complete specification table, not a generic sentence **[CODE: `src/lib/rfq.ts`'s `buildRfqRequirement`, fixed earlier this session]**.

No gap against this journey.

---

## 4.2 The Category Explorer

**Verdict: ✅ Preserved** — this is the journey fixed in the earlier mentor-feedback round of this session, and it maps almost exactly onto §4.2's expected behavior.

- Category filter → brand card link carries `?fromCategory=&spec=` forward **[CODE: `CategoryBrandsView.tsx`'s `brandHref()`]**.
- Brand Hub reads that context, shows a "You were exploring..." banner, opens straight to Products, highlights the matching line **[CODE + LIVE, verified against `/brands/kirloskar?fromCategory=diesel-generators&spec=...`]**.
- Brand-MCat page preselects the exact model from `?model=` instead of defaulting to array index 0 **[CODE + LIVE]**.
- Confirmed to generalize beyond the one case originally reviewed (re-tested against Diesel Generators/Kirloskar, not just Air Compressors/Atlas Copco) **[LIVE]**.

**One thing worth flagging relative to the *new* benchmark specifically:** §4.2's "Expected Next Step" says a buyer should be able to narrow by spec, pick a brand, and land on a filtered model range — this works. But §4.3 (below) says the *primary* decision surface once on a brand's model range should be model-vs-model comparison, and that's where the gap actually is — not in 4.2 itself.

---

## 4.3 The Comparison-Driven Buyer (model-vs-model within a brand)

**Verdict: ⚠️ Partially preserved.** The capability exists; its prominence doesn't match what the benchmark calls for.

The benchmark is explicit: *"A model comparison table as the **primary** surface... not a secondary tab."* What's actually built:

- The Brand-MCat page's section order is: Applications → **Select a Model** (card picker) → Specifications of the selected model → **Model Comparison** (table) → Dealers → Reviews → FAQ **[CODE: `grep` of `<h2` headings in `BrandMCatView.tsx`, in document order]**.
- Measured live: the Model Comparison table sits **1,264px below** the Select-a-Model section on a standard viewport — several screens down, not immediately visible **[LIVE, measured via `boundingBox()` on both headings]**.
- The actual primary interaction is a card-based model *picker* (choose one model, see its specs update), not a comparison table (see multiple models' specs side-by-side at once). A buyer has to scroll well past their initial model choice to find the comparison view at all.

**Gap:** the benchmark calls for comparison-first; the build is selection-first, with comparison as a supporting reference further down. For a persona whose defining trait is *"wants to weigh multiple options side-by-side before deciding,"* burying that exact capability below the fold works against the stated design priority.

**Also gap, smaller:** §7.4's resolved decision (within-brand primary, cross-brand secondary) implies cross-brand comparison should still be *reachable*, just secondary — this exists today via `/compare?category=` **[CODE, confirmed]**, so that half of the decision is already satisfied; it's specifically the *within-brand* comparison's prominence that falls short.

---

## 4.4 The Brand-Loyal Buyer

**Verdict: ✅ Preserved.**

- Cold entry to a Brand Hub (no incoming category/spec context) correctly shows no banner and defaults to the Overview tab **[LIVE]** — matching the benchmark's expectation that this journey shouldn't be forced through machinery meant for a different intent.
- §4.4's "Expected Context to Preserve" note — *if this buyer arrived with any category/spec context, it should still be honored even though brand trust is the entry point* — is also satisfied: the same banner/preselection mechanism from 4.2 activates identically regardless of whether the buyer's stated reason for being on the Brand Hub is "I trust this brand" or "I filtered a category" **[CODE, same mechanism as 4.2]**.

No gap against this journey.

---

## 4.5 The Direct/Cold-Landing Buyer (SEO-driven)

**Verdict: ⚠️ Partially preserved.** Per-page content is solid; lateral navigation is broken, and this matters more under this benchmark than it did before, because §OWNER confirmed SEO-deep-landing is the *dominant* traffic pattern, not an edge case.

**What works:**
- generateMetadata now exists on every route, giving cold-landed buyers a real, specific `<title>` matching what they searched for, instead of one static site-wide title **[CODE, fixed earlier this session; confirmed across category/brand/brand-mcat/product/search/compare routes]**.
- All page content (specs, sellers, trust badges, RFQ prefill) renders correctly on a genuinely cold load with zero dependency on prior navigation **[LIVE, re-verified against a fresh browser context landing directly on `/products/atlascopco-ga11`]**.

**What doesn't:**
- **No link from a product page to its own brand.** `product.brandName` renders as plain text in three places; never a `<Link href="/brands/[id]">` **[CODE: `grep` for `brands/\${brand` in `ProductDetailView.tsx` returns zero matches]**. A cold-landed buyer curious "what else does this manufacturer make" has no in-page path there — directly contradicts §4.5's requirement for *"paths both deeper... and sideways (to the brand, to the category, to alternatives)."*
- **The back button relies on `router.back()`** on both Product and Brand pages **[CODE: `ProductDetailView.tsx:75`, `BrandProfileView.tsx:60`]**, which has no reliable target for a buyer with no in-app history — directly contradicts §4.5's requirement that *"back must go somewhere logical and real, not rely on browser history that doesn't exist."*

Both were already identified in this session's earlier code-reading pass (`BUYER_JOURNEYS.md` §3) and confirmed again via live browsing (`BUYER_PERSONA_JOURNEYS.md`, Persona 5) — cited here because this benchmark's traffic-source decision makes them higher-priority than they'd be under a homepage-first traffic assumption.

---

## 4.6 Secondary intents

**Verdict: ❌ Mostly unsupported**, with two exceptions.

| Intent | Status | Evidence |
|---|---|---|
| Problem/application-driven | ❌ No guided discovery exists | **[CODE]** No "what solves this?" flow anywhere in `DiscoverView.tsx` or `CategorySearchView.tsx` — search requires the buyer to already know product-category vocabulary |
| Replacement part | ❌ Not supported | **[CODE]** No "find an equivalent/replacement" flow; a buyer would have to know the exact replacement spec themselves and use ordinary search |
| Researcher (save for later) | ⚠️ Exists, but not durable | **[CODE]** Shortlist works within a session but resets to 3 hardcoded seed items on a genuinely new session — a buyer "coming back later" (exactly this persona's defining behavior) sees misleading data, not their own picks |
| Urgent/local | ⚠️ Partial | **[CODE]** Delivery time and seller location are shown on seller cards, but there's no "sort/filter by fastest" or "nearest to me" capability — the information exists, the buyer-facing control to prioritize by it doesn't |
| Value-conscious | ✅ Supported | **[CODE]** `CategoryBrandsView.tsx` has a working price-bucket filter |
| Premium/quality-first | ⚠️ Partial | **[CODE]** Sorting by rating exists implicitly (brand comparison table is rating-sortable-by-eye) but there's no explicit "show me the best, regardless of price" control |
| Compliance-driven | ❌ Not supported | **[CODE]** `grep` for "certif" across `CategoryBrandsView.tsx`/`BrandMCatView.tsx`/`CompareView.tsx` returns zero matches for any filter; certifications exist as product data (`product.certifications`) but are only ever displayed, never filterable — confirmed live: no certification-related text anywhere on a category page |
| Alternative-seeking | ✅ Supported | **[CODE + LIVE]** Compare Alternatives on the product page, fixed earlier this session to open a genuine comparable-quote request |

---

## 4.7 The connection mechanism

**Verdict: ❌ Broken — directly contradicts the resolved decision.**

The benchmark's resolved decision (§4.7, §7.1) is unambiguous: *"Neither buyer nor seller phone numbers are ever exposed to each other... calls route through IndiaMART's own masked/proxy-number infrastructure."*

What's actually built does the opposite:
- Raw, literal phone numbers are displayed as clickable `tel:` links in **four separate components**: `ProductDetailView.tsx:219`, `BrandProfileView.tsx:388`, `BrandMCatView.tsx:346`, `CompareView.tsx:259` **[CODE]**.
- Confirmed live: opening the Sellers tab on a product page displays `+91 98016 96872` as a direct, clickable phone number **[LIVE]** — exactly the raw exposure the benchmark says should never happen.
- There is no "Connect Directly" or equivalent masked-calling CTA anywhere in the app **[CODE: no matching component/handler exists]**, confirmed live via full-page text search finding zero matches for "Connect Directly," "Connect Now," or "Call via IndiaMART" **[LIVE]**.

**Important context this finding needs:** the raw phone numbers were added *deliberately* earlier in this same session, in direct response to an independent buyer-persona test that flagged *"no seller phone number is ever displayed anywhere"* as a real gap at the time. That fix was correct against the standard being used at that moment. This benchmark supersedes it with a more specific, more realistic requirement (masked connection, not raw exposure) that wasn't yet defined when the earlier fix was made. This is a genuine case of the standard evolving, not a mistake repeating itself — flagged plainly rather than glossed over.

---

## §5 Intent Preservation Principles — one-by-one

| # | Principle | Verdict | Evidence |
|---|---|---|---|
| 1 | Nothing already expressed should be re-asked | ✅ Met for the category→brand→model path | **[CODE]** `?fromCategory=&spec=&model=` chain, fixed earlier this session |
| 2 | Every screen answers "why am I here" | ✅ Met where context exists | **[CODE + LIVE]** The "You were exploring..." banner does exactly this |
| 3 | The connection moment is the accumulation point | ⚠️ Partial | **[CODE]** True for RFQ text (2 of ~12 origins use the full-spec builder; the rest still use generic templated text — see `BUYER_JOURNEYS.md` §6) and false for the connection *mechanism* itself (§4.7 above) |
| 4 | Comparison state deserves the same durability as navigation state | ❌ Not met | **[CODE]** `CompareView.tsx` has zero `router.push`/`useSearchParams` calls — no comparison customization (added sellers, switched category) ever reaches the URL; only the *initial* server-resolved scope is shareable, confirmed both by code inspection and live (`compareUrlStaysStatic: true` after an Add Seller attempt) |
| 5 | Trust signals discovered earlier should reinforce at the connection moment | ✅ Met | **[CODE]** Manufacturer/OEM badge (the benchmark's #1 trust signal) is consistently rendered first, across all four brand/product-bearing views, and carries through to the RFQ modal via `brandName` |
| 6 | A cold landing is not a lesser journey | ⚠️ Partial | See §4.5 above — most of the journey holds, two specific navigation gaps don't |
| 7 | Recovery must always be possible without loss | ⚠️ Partial | **[CODE]** Shortlist's reset-to-seed-defaults behavior is the clearest violation — it doesn't degrade to an *honest* empty state, it silently substitutes different, misleading data. Quote Basket and Recently Viewed *do* degrade honestly (empty, not misleading) |

---

## Consolidated gap list, ranked by how directly each contradicts a resolved decision

1. **Raw phone-number exposure contradicts the masked-calling decision (§4.7)** — the highest-priority gap under this benchmark specifically, since it's not just "missing," it's the opposite of what was just decided. Touches 4 components.
2. **Model comparison isn't the primary surface (§4.3)** — the resolved comparison-priority decision (within-brand model comparison first) isn't reflected in the page's actual visual hierarchy.
3. **No lightweight "Connect Directly" path exists at all (§4.7)** — only one conversion mechanism (the RFQ form) exists; the benchmark calls for two.
4. **Comparisons aren't shareable beyond their initial scope (§5.4, resolved decision §7.3)** — a buyer who customizes a comparison (adds sellers, switches category) can't share that exact state with a colleague, undermining the multi-stakeholder use case the benchmark specifically called out.
5. **No certification filtering (§4.6, resolved decision §7.2)** — certification data exists per-product but is never a filterable/comparable axis, despite the benchmark confirming certifications genuinely vary by category and matter to a real (if narrow) segment.
6. **Product pages have no link back to their brand; back-button reliability on cold landings (§4.5)** — already known from earlier this session, elevated in priority here because SEO-deep-landing is now confirmed as the dominant traffic pattern, not a secondary case.
7. **Shortlist's misleading reset behavior (§5.7, Researcher persona in §4.6)** — resets to plausible-looking but wrong seed data rather than an honest empty state.
8. **No guided/problem-based discovery path (§4.6)** — a real, named persona in the benchmark with zero current support.
9. **Only 2 of ~12 "Get Quotes" origins use the full-spec RFQ text builder (§5.3)** — already known from earlier this session; still open.

---

## Resolution (implemented 2026-07-03)

All 9 items fixed and verified against a local production build (`next build` + `next start`), plus the full existing 48-case buyer-journey suite (48/48 passing, zero regressions).

1/3. **New `ConnectButton` component** (`src/components/ConnectButton.tsx`) + `getMaskedConnectNumber()` (`src/lib/connect.ts`) replace the raw `tel:` links in all 4 components. One tap reveals a masked/proxy number (deterministic per supplier, formatted distinctly from a personal mobile number) with a "Routed via IndiaMART — the seller's number stays private" caption — no identity-capture gate, matching the resolved decision that masking itself prevents spam. Verified live: zero raw personal-format phone numbers in the DOM; masked number displays correctly on tap.
2. **Model Comparison table moved** to sit immediately after "Select a Model," ahead of the single-model spec detail — confirmed live it's now the very next section with nothing in between (the remaining ~900px gap is the model-picker grid's own height, not intervening content).
4. **Compare view now syncs to the URL** — `CompareView.tsx` writes `?category=&sellers=` on every add/remove/category-change via `router.replace`; `compare/page.tsx` resolves an incoming `?sellers=` param with priority over the shorthand scope params. Added a "Share" button (copies the current URL). Verified live: loading a scoped compare immediately produces a URL with the full `sellers=` list.
5. **Certification filter added** to `CategoryBrandsView.tsx`, driven by each category's brands' real `certifications` arrays (no invented universal list) — filters both the Top Models rail and the Brand Cards/Comparison sections, with an honest empty state when no brand holds the selected certification.
6. **Product pages link to their brand** (header icon, header text, and the core-info brand label) instead of showing plain text. Both Product and Brand Hub back buttons now use real `<Link>`s (to the brand, and to `/brands` respectively) instead of `router.back()`.
7. **Shortlist starts genuinely empty** — removed the hardcoded seed IDs (one of which, `'machinery'`, wasn't even a valid category id) from `ShortlistProvider.tsx`.
8. **New "Not Sure What You Need?" section** on the homepage (`DiscoverView.tsx`) — 10 plain-language problem statements mapped to real categories, resolved against the live catalog so a stale mapping can never link to a nonexistent category.
9. **Full-spec RFQ prefill extended** to `CategorySearchView`'s per-product CTA, `ShortlistedView`'s product cards, and `ProductDetailView`'s per-seller CTA (now also names the specific seller). Brand-level and category-level generic CTAs (which have no single product to enumerate) were deliberately left as-is rather than fabricating false precision.

One thing worth naming plainly: item #1 directly reverses a change made earlier in this same session, when an independent buyer-persona test flagged "no seller phone number is ever displayed" and raw `tel:` links were added in response. That fix was correct against the standard in force at the time; this benchmark's masked-calling decision supersedes it. Documented here rather than treated as if it never happened.
