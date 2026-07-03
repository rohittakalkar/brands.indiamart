# Buyer Journey Test Plan

Test cases derived from the buyer journeys described in [`PRODUCT.md`](PRODUCT.md), written from the perspective of what a buyer actually does on the site — not from implementation details. Each case has an expected result written *before* execution, independent of what the code is known to do, including cases expected to legitimately fail or degrade gracefully (empty catalog, no sellers, unknown search term).

Automated where the interaction is real browser behavior (clicking, typing, selecting, submitting) — see [`tests/buyer-journeys.spec.ts`](../tests/buyer-journeys.spec.ts). Results are recorded in the **Result** column after execution; see the run log at the bottom of this file for the latest pass/fail summary.

Legend: **P** = Positive (happy path) · **N** = Negative (invalid input) · **E** = Edge case (boundary/empty state)

---

## 1. Homepage & Discovery

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| HP-01 | P | Homepage loads | Visit `/` | Search bar, category tiles, popular brands, and featured models all render |
| HP-02 | P | Search resolves to an exact product | Type a known model name into search, submit | Navigates directly to that product's detail page |
| HP-03 | P | Search resolves to a brand | Type a known brand name, submit | Navigates directly to that brand's hub page |
| HP-04 | P | Search resolves to a category | Type a known MCat name, submit | Navigates to that category's brands page |
| HP-05 | N | Search with no match | Type a nonsense string, submit | Lands on search results / fallback view, not an error page |
| HP-06 | N | Search with empty input | Submit the search form with nothing typed | No navigation, or a no-op — does not crash or navigate to a broken URL |
| HP-07 | P | Category tile navigation | Click a category tile on the homepage | Navigates to that category's brands page |
| HP-08 | P | Popular brand navigation | Click a brand in the "Popular Brands" row | Navigates to that brand's hub page |
| HP-09 | P | Featured model navigation | Click a product in "Featured Models" | Navigates to that product's detail page |
| HP-10 | P | Primary CTA opens quote modal | Click "Get quotes from verified sellers" | The quote request modal opens |

## 2. Category-first journey (buyer knows the product type, not the brand)

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| CF-01 | P | Category page loads with brands | Visit a populated category (e.g. Diesel Generators) | All brands serving this category are listed, each showing a rating and trust badges |
| CF-02 | P | Seller availability is visible | On a category page | Each brand card shows an "N Authorized Sellers Available" indicator when sellers exist |
| CF-03 | P | Brand filter narrows results | Click a brand chip in the filter panel | The "Top Model From Each Brand" list narrows to that brand only |
| CF-04 | P | Price filter narrows results | Click a price-bucket chip | Models outside that price band are excluded from the list |
| CF-05 | P | Spec-value filter narrows results | Click a capacity/spec chip | Only models matching that exact spec value remain |
| CF-06 | P | Clearing filters restores full list | Apply a filter, then click "Clear Filters" | The full unfiltered model list returns |
| CF-07 | E | Filters combine to zero results | Pick a brand + price band that don't co-occur | Empty state message with an offer to clear filters, not a blank silent list |
| CF-08 | P | Primary CTA is "Compare Brands" | On any populated category page | The sticky bottom CTA reads "Compare Brands" and links into the Compare page scoped to this category |
| CF-09 | P | Brand card navigates to Brand Hub | Click a brand card | Navigates to that brand's hub page |
| CF-10 | E | Category with no brands | Visit a category with zero catalog brands (e.g. Building & Construction) | A clear "no branded catalog yet" message renders — the page does not error or show a blank section |

## 3. Brand-first journey (buyer already trusts a brand)

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| BF-01 | P | Brand hub loads | Visit a brand's hub page | Company profile, rating, and trust badges render in the Overview tab |
| BF-02 | P | Primary CTA switches to Products | Click "Explore Products by Category" | The Products tab becomes active, without a full page navigation |
| BF-03 | P | All product lines are listed | On the Products tab | Every Brand-MCat line for this brand appears, each linking to its own Brand-MCat page |
| BF-04 | P | Dealer network and service network are distinct | Open the Sellers tab | "Dealer Network" and "Service Network" appear as clearly separate sections, not merged |
| BF-05 | P | Catalogue download is present | On the Overview tab, for a brand with a catalogue | A catalogue card with file size and last-updated date is shown |
| BF-06 | P | Shortlisting a brand persists in-session | Click the heart/save icon on a brand page, then visit `/shortlist` | The brand appears in the shortlist |
| BF-07 | N | Unknown brand ID | Visit `/brands/not-a-real-brand` | Renders a 404, not a crash or blank page |
| BF-08 | P | Secondary Get Quotes stays reachable | On a brand hub page | A secondary "Get Quotes" action exists alongside the primary CTA |

## 4. Brand-MCat page — the conversion centre

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| BM-01 | P | Page loads with a model pre-selected | Visit a Brand-MCat page with multiple models | The first/most prominent model is selected by default; its full spec panel is visible |
| BM-02 | P | Selecting a different model updates the page | Click a different model card | The spec panel, price, and delivery/warranty info update to match the newly selected model, without a full page reload |
| BM-03 | P | Get Quotes button reflects the selection | Select model B, look at the sticky CTA | The button text names model B's exact model number, not a generic line-wide label |
| BM-04 | P | Model comparison table selection syncs | Click a row in the Model Comparison table | That row's model becomes the selected model (same effect as clicking its card) |
| BM-05 | P | Dealers are scoped to the selected model | Select a model with a known dealer | Only dealers of that exact model are listed, not the whole line's dealers |
| BM-06 | E | No dealer for the selected model | Select a model with no matching dealer | A message appears with an option to "show dealers for all models in this line" |
| BM-07 | P | Location filter narrows dealers | Pick a location from the dealer location dropdown | The dealer list narrows to that location only |
| BM-08 | P | Get Quotes opens a pre-filled request | Click the sticky "Get Quotes for [model]" button | The quote modal opens with the requirement text already referencing the selected model |
| BM-09 | N | Unknown brand+category combination | Visit `/brands/kirloskar/not-a-real-category` | Renders a 404, not a crash |
| BM-10 | E | Two product lines sharing a category resolve independently | Visit a brand+category pair known to have multiple underlying product lines (e.g. Voltas water coolers & chillers) | All models from every line under that pairing appear on the one page — none are missing |

## 5. Exact-search journey (buyer already knows the exact model)

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| ES-01 | P | Exact model search lands on the product page | Search the full model name from the homepage | Navigates straight to `/products/[id]`, skipping category/brand browsing entirely |
| ES-02 | P | Product page shows model-scoped sellers only | On a product page | Every seller listed sells this exact product — never a different model from the same brand |
| ES-03 | P | Compare Alternatives shows real competitors | On a product page, scroll to Compare Alternatives | Named competing brands appear (different companies than the catalog's own 8 brands) with comparable specs |
| ES-04 | N | Unknown product ID | Visit `/products/not-a-real-product` | Renders a 404, not a crash |
| ES-05 | P | Product page Get Quotes | Click Get Quotes on a product page | Quote modal opens referencing this exact product |

## 6. Compare

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| CM-01 | E | Unscoped entry shows a category picker | Navigate to `/compare` with no query params | A "pick a category" chooser is shown — the page does not preload a mix of unrelated products |
| CM-02 | P | Category-scoped compare | Visit `/compare?category=<mcatId>` for a populated MCat | Sellers/products from that category only are shown |
| CM-03 | P | Product-scoped compare | Visit `/compare?productId=<id>` | The comparison is pre-loaded with that exact product's own seller(s) |
| CM-04 | P | Adding a seller stays within the active category | From a scoped compare view, add another seller | Only sellers from the same category are offered as add candidates |
| CM-05 | P | Removing a seller updates the comparison | Remove one of the compared sellers | The comparison table and summary insights recompute without the removed seller |
| CM-06 | P | Comparison insights are computed correctly | With 2+ sellers compared | "Best rated," "fastest response," and "most experienced" callouts name the sellers that actually hold those values |
| CM-07 | P | Get Quotes From All Sellers | Click the primary CTA with sellers selected | Quote modal opens referencing all currently compared sellers |

## 7. Shortlist & Quote Basket

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| SL-01 | P | Save and view a product | Shortlist a product from its detail page, visit `/shortlist` | The product appears in the shortlist |
| SL-02 | P | Remove from shortlist | Un-shortlist an item | It disappears from `/shortlist` |
| QB-01 | P | Add to quote basket | Add a product to the quote basket | It appears on `/quote-basket` |
| QB-02 | E | Empty quote basket | Visit `/quote-basket` with nothing added | A clear empty state is shown, not a blank page |

## 8. Quote request submission (the conversion event)

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| QR-01 | P | Valid submission succeeds | Submit the quote form with all required fields filled | Request succeeds; buyer is taken to a success confirmation |
| QR-02 | N | Missing required field | Submit with `requirement` left blank | A validation error is shown; no request is created |
| QR-03 | P | Submitted lead is retrievable | After a successful submission, check the leads list | The new lead appears with a generated ID and `pending` status |

## 9. Cross-cutting / structural

| ID | Type | Case | Steps | Expected Result |
|---|---|---|---|---|
| XC-01 | P | Deep-link direct load | Open a product/brand/category URL directly (not via in-app navigation) | The page renders fully server-side — no dependency on client-side navigation history |
| XC-02 | N | Every entity type 404s cleanly on a bad ID | Hit invalid IDs for brand, product, and brand+category routes | All return a proper not-found page, none throw a 500 |
| XC-03 | E | Mobile viewport | Load the homepage at a narrow (390px) viewport | Bottom navigation is visible; layout doesn't overflow horizontally |

---

## Run log

**Latest run:** 2026-07-03, against a local production build (`next build` + `next start`) after the buyer-persona fix round (see "Fix round" note below) and a fix to the `BF-06` test script itself, via [`tests/buyer-journeys.spec.cjs`](../tests/buyer-journeys.spec.cjs) (real Chromium browser, not HTTP-only checks).

**Result: 48/48 automated cases passed.** Two cases (`HP-05`, `BF-06`) failed in an earlier run of this round and were investigated — both were test-script artifacts, not product defects (see below); `BF-06`'s script was corrected accordingly. 12 additional cases from this plan (`CF-04`, `CF-05`, `CF-07`, `BM-04`, `BM-06`, `BM-08`, `CM-04`, `CM-06`, `SL-02`, `QB-01`) are not yet automated and require manual/browser verification; they were not marked pass or fail.

### Fix round (2026-07-03)

An independent, context-free agent tested the live site as two realistic buyer personas (no access to this repo's docs or source) and surfaced issues this test suite's own bias (derived from `PRODUCT.md`, which describes this app's own implementation) had missed. Fixed as a result:

- **Compare Alternatives cards were inert** (`ProductDetailView.tsx`) — now open a quote request pre-filled to request a comparable quote against the named competitor.
- **Multi-word search queries returned zero results** (`src/lib/search.ts`) — e.g. "80 kva generator" never matched the literal product name string. Added order-independent token matching (`matchesAllTokens`/`matchesMostTokens`) as a fallback layer in both `resolveSearch` and `getGroupedSearchResults`.
- **Mobile bottom-nav padding was exactly nav-height** (`src/app/layout.tsx`) — the scroll container's bottom padding (`pb-14`, 56px) exactly matched the fixed nav's height with zero clearance. Increased to `pb-20` (80px); verified visually via mobile-viewport screenshot.
- **Generated dealer records visibly duplicated** (`src/lib/generatedCatalog.ts`) — the 10-city cycle (`idx % CITIES.length`) repeated the exact same city+name combo every 10 suppliers within one brand's own list (confirmed: same city, `experienceYears` exactly 10 apart). Expanded to 20 cities and added an independently-cycling dealer-type suffix (`Authorized Dealer`/`Corporate Dealer`/etc.) so repeats, when they occur, read as distinct businesses.
- **No seller phone number was ever displayed anywhere** — added `contactPhone` to the `Supplier` type, backfilled all 14 manually-authored suppliers and the generated ones, and rendered it (as a `tel:` link) on the product, brand, brand-category, and compare views.
- **Quote request persistence on Vercel** — root-caused to page routes and API routes being bundled as separate serverless functions with independent module instantiation, so the in-memory `leadsStore` isn't reliably shared between a `POST /api/leads` and a later `GET` on `/leads`. Decision: documented as a known limitation in `PRODUCT.md` rather than adding new infrastructure (user's explicit choice over provisioning a real database).

### Investigation notes on the two remaining "failures"

- **`HP-05`** (search-with-no-match renders a page with a title): failed once in the full sequential run with "page did not render a title." Isolated, independent reproduction (3/3 runs, fresh browser page each time) passed cleanly every time — the root layout's static `<title>` metadata was present immediately after navigation in every isolated run. Attributed to a transient timing read in the shared-page sequential script, not a rendering defect.
- **`BF-06`** (shortlisting a brand persists to `/shortlist`): failed consistently (3/3) when reproduced with the test script's exact method — and the precise cause is now understood, not just suspected. The script's second step uses `page.goto('/shortlist')`, a **hard page reload**. This app's shortlist state lives in `ShortlistProvider`, an in-memory-only React Context with no persistence (by design — see `PRODUCT.md`'s scope/limitations). A hard reload destroys all client-side state, exactly as a real user hitting browser refresh would, and the page falls back to its seeded default (`kirloskar` pre-shortlisted) — which is exactly what was observed. Reproduced instead with an in-app `<Link>` click (soft, client-side navigation, matching how a real buyer moves between screens) and the shortlisted brand appeared correctly, immediately, 100% of the time. **Conclusion: not a product bug — the test script exercised a navigation mode (hard reload) that discards state the product never claims to persist across reloads.** The test script should be updated to use in-app navigation for any case that depends on client-only state surviving between steps.
