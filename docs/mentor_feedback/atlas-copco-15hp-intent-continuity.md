# Mentor Feedback: Atlas Copco "15 HP Air Compressor" Journey

**Source:** Mentor review (GPT-5.5 High), 2026-07-03
**Score:** 70/100
**Status:** Implemented and verified 2026-07-03. See "Resolution" at the bottom of this document.

## Mentor scorecard

| Area | Score |
|---|---|
| Architecture and design | 17/20 |
| Navigation and intent continuity | 12/20 |
| Product/specification relevance | 19/25 |
| Trust, comparison and RFQ | 15/20 |
| SEO and technical quality | 7/15 |
| **Total** | **70/100** |

**Mentor's summary:** *"The Atlas Copco 15 HP journey is now functionally valid. Category filtering correctly identifies GA 11 VSD+, search directly reaches the correct model, and the Brand-MCat page updates specifications, dealer and quote CTA after selection. The primary remaining gap is intent continuity: 15 HP selection is lost on the Brand Hub and the Brand-MCat defaults to a 40 HP model. Preserve category + brand + power across all three screens and preselect GA 11 VSD+. Also fix duplicate H1s, generic page titles, irrelevant pump reviews and RFQ specification prefill."*

---

## Root cause map

Every finding below was verified directly against the current code — nothing here is guessed.

| # | Mentor finding | File | Root cause |
|---|---|---|---|
| 1 | Clicking a brand from the filtered category page loses the 15 HP filter | [`CategoryBrandsView.tsx:258-260`](../../src/components/CategoryBrandsView.tsx#L258) | Brand card is a plain `href={\`/brands/${brand.id}\`}` — the active `selectedSpecValue` filter state lives only in local `useState`, never written to the URL, so nothing survives navigation |
| 2 | "15 HP Air Compressor" context disappears on Brand Hub; buyer must manually open Products | [`BrandProfileView.tsx:28`](../../src/components/BrandProfileView.tsx#L28) | `activeSubTab` defaults to `'overview'` unconditionally; the component never reads the URL, so it has no way to know the buyer arrived with a specific category+spec intent |
| 3 | GA 11 not highlighted as the previously-selected product on Brand Hub | *(same as #2)* | No incoming context to highlight against — the page has no concept of "which product/spec the buyer was just looking at" |
| 4 | Brand-MCat page defaults to GA 30 VSD+ (40 HP) instead of GA 11 VSD+ (15 HP) | [`BrandMCatView.tsx:39`](../../src/components/BrandMCatView.tsx#L39) | `useState<string \| undefined>(products[0]?.id)` — always preselects array index 0. `atlas-copco-compressor` (GA 30 VSD+, 40 HP) is a manually-authored entry near the top of `PRODUCTS` in `data.ts`; `atlascopco-ga11` (GA 11 VSD+, 15 HP) is a generated entry spliced in later via `...GENERATED_PRODUCTS`, so it never lands at index 0. No `searchParams` are read anywhere in this component or its route file |
| 5 | Duplicate H1s | [`CategoryBrandsView.tsx:136`](../../src/components/CategoryBrandsView.tsx#L136) + [`:148`](../../src/components/CategoryBrandsView.tsx#L148); [`BrandMCatView.tsx:94`](../../src/components/BrandMCatView.tsx#L94) + [`:107`](../../src/components/BrandMCatView.tsx#L107) | Both pages render an `<h1>` in the compact sticky header **and** a second `<h1>` in the hero banner below it, with near-duplicate text |
| 6 | Generic page titles | All of `src/app/**/page.tsx` | Zero routes in the app define `generateMetadata`. Every single page — category, brand, brand-mcat, product — inherits the one static title from `src/app/layout.tsx`: *"Brands — Discover the Right Branded Industrial Product \| IndiaMART"* |
| 7 | Irrelevant pump reviews on non-pump brand pages | [`data.ts:1072-1091`](../../src/lib/data.ts#L1072) (`REVIEWS`); [`types.ts:132`](../../src/types.ts#L132) (`Review`); passed unfiltered in [`brands/[brandId]/page.tsx:17`](../../src/app/brands/%5BbrandId%5D/page.tsx#L17) and [`brands/[brandId]/[categoryId]/page.tsx:28`](../../src/app/brands/%5BbrandId%5D/%5BcategoryId%5D/page.tsx#L28) | `Review` has **no `brandId` or `productId` field at all**. `REVIEWS` is one hardcoded 2-item global array (`rev-1` literally says *"Excellent quality centrifugal pumps..."*), and every brand/brand-mcat page is passed the exact same `REVIEWS` array unfiltered. Atlas Copco (air compressors) shows a pump review because there is no other review to show |
| 8 | RFQ doesn't auto-include 15 HP/11 kW, pressure, FAD, VSD | [`BrandMCatView.tsx:70-78`](../../src/components/BrandMCatView.tsx#L70) (`handleGetQuotes`) | Generic sentence only: *"Please share the technical datasheet, exact pricing, and delivery timeline"* — never touches `selectedProduct.specifications`. By contrast `ProductDetailView.tsx:44-48`'s `handleSendLead` already does pull from `product.specifications`, but only `.slice(0, 3)` in object-insertion order, which isn't guaranteed to include pressure/FAD/VSD ahead of other keys |

**One thing that makes fixing #8 straightforward:** the exact data the mentor wants already exists. `atlascopco-ga11`'s `specifications` (built in `generatedCatalog.ts:369-370` from `keySpecLabel`/`keySpecValue` + `extraSpecs`) is:

```
{ "Motor Power": "11 kW (15 HP), VSD", "Working Pressure": "4 - 13 bar(e)", "Capacity FAD": "9.7 - 33.9 l/s", "Drive Type": "VSD" }
```

Every field the mentor listed — 15 HP/11 kW, required pressure, FAD, VSD — is already sitting in `product.specifications`. Quantity and location are already separate structured fields in the RFQ modal (`BuyLeadFormModal.tsx`) with sensible defaults; the gap is purely that the free-text `requirement` field isn't assembled from the full spec table.

---

## BEFORE — today's actual journey

**Screen 1 — Category Brands (`/categories/air-compressors`):**
Buyer taps the "15 HP" spec chip. `selectedSpecValue` filters the page correctly — Atlas Copco surfaces, "Top Model From Each Brand" updates to GA 11 VSD+, price shows ₹2,20,000 onwards. Buyer taps the Atlas Copco brand card. This is a plain link to `/brands/atlascopco` — the filter state was never in the URL, so it's gone the instant the page unmounts.

**Screen 2 — Brand Hub (`/brands/atlascopco`):**
Fresh page load, `activeSubTab` starts at `'overview'`. Nothing on screen references air compressors, 15 HP, or GA 11 VSD+ — the buyer's last five seconds of intent are invisible. To continue, the buyer must notice and tap the "Products" sub-tab themselves, then find Air Compressors among Atlas Copco's product lines, with no visual cue that GA 11 VSD+ specifically was what they were just comparing.

**Screen 3 — Brand-MCat (`/brands/atlascopco/air-compressors`):**
`selectedModelId` initializes to `products[0]?.id`, which resolves to `atlas-copco-compressor` (GA 30 VSD+, 40 HP) — the manually-authored entry that happens to sit earlier in the `PRODUCTS` array than the generated GA 11 VSD+ entry. The buyer lands on a 40 HP compressor, must recognize this is wrong, scroll/scan the model list, and manually click GA 11 VSD+ themselves. Once they do, the page correctly updates specs, dealer, pricing, and the "Get Quotes for GA 11 VSD+" CTA — but only after the buyer redid work the app already knew.

**RFQ, once submitted:** carries `productName: "GA 11 VSD+ (GA 11 VSD+)"` and `brandName: "Atlas Copco India"` correctly, but the `requirement` text is a generic sentence with no 15 HP/11 kW, pressure, FAD, or VSD detail — the supplier receiving the lead has to ask for basic specs the buyer already implicitly gave.

**Also visible throughout:** two `<h1>` tags stacked on both the Category and Brand-MCat pages; every page's browser tab reads the same generic site title regardless of category/brand/model; the reviews section on the Atlas Copco pages shows a review praising "excellent quality centrifugal pumps."

---

## AFTER — target journey

**Screen 1 — Category Brands (`/categories/air-compressors`):**
Buyer taps "15 HP." Same correct filtering as today. Brand card links now carry the active filter forward as a URL query param, e.g. `/brands/atlascopco?fromCategory=air-compressors&spec=11%20kW%20(15%20HP)%2C%20VSD`. No visible change to this screen's UI — the fix is entirely in what the outgoing link carries.

**Screen 2 — Brand Hub (`/brands/atlascopco?fromCategory=air-compressors&spec=...`):**
Page reads the incoming query params server-side. A new contextual banner renders directly under the brand header, above the Overview tab:

> **You were exploring Atlas Copco 15 HP Air Compressors**
> [Continue with GA 11 VSD+ →]

Tapping "Continue" deep-links straight to the Brand-MCat page with the model preselected (`/brands/atlascopco/air-compressors?model=atlascopco-ga11`), skipping the manual Products-tab hunt entirely. If the buyer ignores the banner and browses normally, nothing else changes — this is additive, not a forced redirect.

**Screen 3 — Brand-MCat (`/brands/atlascopco/air-compressors?model=atlascopco-ga11`):**
`selectedModelId` initializes from the `model` query param when present (falling back to `products[0]?.id` exactly as today when a buyer arrives with no prior context, e.g. via direct search or a category page with no active filter). GA 11 VSD+ is selected immediately on load — specs, dealer, pricing, and the "Get Quotes for GA 11 VSD+" CTA are all correct on first paint, no manual reselection needed.

**RFQ:** `handleGetQuotes` (Brand-MCat) and `handleSendLead` (Product page) both build the `requirement` text from a shared helper that walks the product's *entire* `specifications` table, not a positional slice, so every RFQ reads like:

> *"Interested in the GA 11 VSD+ (Model: GA 11 VSD+). Key specifications: Motor Power: 11 kW (15 HP), VSD; Working Pressure: 4 - 13 bar(e); Capacity FAD: 9.7 - 33.9 l/s; Drive Type: VSD. Please share exact pricing and delivery timeline for the above."*

Quantity and delivery location remain their own structured fields in the modal (already present, already required) — no change needed there beyond confirming they're always populated before submit, which they already are.

**Also fixed:**
- One `<h1>` per page (the sticky header keeps a plain `<h2>`/`<span>`, only the hero banner keeps the `<h1>`) on Category and Brand-MCat pages.
- Real per-page `<title>` via `generateMetadata` on category, brand, brand-mcat, and product routes — e.g. *"Atlas Copco Air Compressors — Compare Models & Verified Dealers \| IndiaMART Brands"* instead of the one generic site-wide title everywhere.
- `Review` gains `brandId`/`productId`; `REVIEWS` gets real per-brand entries (including at least one air-compressor-specific review for Atlas Copco); brand and brand-mcat pages filter to only the relevant reviews instead of showing the same two reviews everywhere.

---

## Technical design: how context actually flows

The single mechanism that fixes intent continuity #1-#4 (the 12/20 → target score) is **carrying category + spec + model forward as URL query parameters** across the three screens, read server-side where possible:

```
/categories/air-compressors                                  (buyer filters to 15 HP)
   │  brand card link now appends: ?fromCategory=air-compressors&spec=11%20kW%20(15%20HP)%2C%20VSD
   ▼
/brands/atlascopco?fromCategory=air-compressors&spec=...      (context banner reads these)
   │  "Continue with GA 11 VSD+" resolves spec → matching product → appends: ?model=atlascopco-ga11
   ▼
/brands/atlascopco/air-compressors?model=atlascopco-ga11      (selectedModelId initializes from this)
```

This is deliberately **URL state, not client Context** — unlike `ShortlistProvider`/`QuoteBasketProvider` (in-memory only, intentionally session-scoped), intent continuity needs to survive a real page navigation (including a hard refresh or a shared link), which only the URL reliably does in this architecture. It also costs nothing in new infrastructure and matches how `/compare?category=`/`?productId=` already works in this codebase today.

Resolving `spec` → the matching product (for the Brand Hub's "Continue with GA 11 VSD+" link) reuses the same `keySpecValue` matching already used by `CategoryBrandsView`'s filter — no new matching logic, just exposing it as a small data-layer helper (e.g. `findProductBySpec(brandId, mcatId, specValue)`) so both the category and brand pages can call it consistently.

---

## Proposed implementation plan (not yet started)

1. **`src/lib/data.ts`** — add `findProductBySpec(brandId, mcatId, specValue)`; add `brandId`/`productId` to `Review`; add a handful of real per-brand reviews (at least covering Atlas Copco/air compressors, and ideally every brand so no page falls back to an empty state); add a shared `buildRfqRequirement(product)` helper that walks the full `specifications` table.
2. **`src/types.ts`** — add `brandId?: string; productId?: string` to `Review`.
3. **`src/components/CategoryBrandsView.tsx`** — thread `?fromCategory=&spec=` onto brand card `href`s when a spec filter is active; collapse to a single `<h1>` (hero keeps it, header becomes non-heading text or `<h2>`).
4. **`src/app/brands/[brandId]/page.tsx`** — read `searchParams`, resolve `fromCategory`/`spec` via `findProductBySpec`, pass results into `BrandProfileView`; filter `REVIEWS` by `brand.id` instead of passing the full array; add `generateMetadata`.
5. **`src/components/BrandProfileView.tsx`** — accept the resolved context prop; render the "You were exploring..." banner + "Continue with [model] →" link (to `/brands/[brandId]/[categoryId]?model=...`) when present.
6. **`src/app/brands/[brandId]/[categoryId]/page.tsx`** — read `searchParams.model`, pass through; filter `REVIEWS` by `brand.id`; add `generateMetadata`.
7. **`src/components/BrandMCatView.tsx`** — accept `initialModelId` prop, use it in `useState` initializer with `products[0]?.id` as the fallback; collapse to a single `<h1>`; replace `handleGetQuotes`'s generic sentence with `buildRfqRequirement(selectedProduct)`.
8. **`src/components/ProductDetailView.tsx`** — swap `handleSendLead`'s `.slice(0, 3)` for the same shared `buildRfqRequirement` helper, so product-page RFQs get the same full-spec treatment.
9. **`src/app/products/[productId]/page.tsx`** — add `generateMetadata`.
10. Sanity-sweep the rest of `src/app/**/page.tsx` for the same missing-`generateMetadata` gap (categories index, brands index, search, compare) so the SEO fix isn't limited to just these three routes.

## Validation plan (mirrors the mentor's format so re-scoring is directly comparable)

- **Screen 1:** filter to 15 HP → brand card link inspected for `fromCategory`/`spec` params.
- **Screen 2:** land with those params → banner renders naming Atlas Copco 15 HP Air Compressors and GA 11 VSD+ → "Continue" link carries `?model=atlascopco-ga11`.
- **Screen 3:** land with `?model=atlascopco-ga11` → GA 11 VSD+ is the selected model on first paint (not GA 30 VSD+) → specs/dealer/price/CTA all correct without a manual click.
- **Search:** "Atlas Copco air compressor 15 HP" still resolves directly to the product page (already passing — must not regress).
- **RFQ:** requirement text for GA 11 VSD+ contains all four of 11 kW/15 HP, working pressure, FAD, VSD.
- **SEO:** `document.title` differs per category/brand/brand-mcat/product page; exactly one `<h1>` per page (Category, Brand-MCat).
- **Reviews:** Atlas Copco brand/brand-mcat pages show zero reviews containing the word "pump."

## Open questions before implementation

1. Any objection to URL query params (vs. some other mechanism) carrying context between screens? This matches the existing `/compare?category=`/`?productId=` pattern already in the codebase.
2. Should the "You were exploring..." banner also appear when a buyer arrives at a Brand Hub via search or direct link (no incoming context)? Current plan: no — it only renders when `fromCategory`/`spec` params are present, so it's purely additive to the filtered-category-to-brand path.
3. New review content: should I write additional realistic per-brand reviews for all 8 brands now, or only enough to unblock Atlas Copco for this specific journey (with the rest left as a known follow-up)?
4. Metadata copy style — any house style for `<title>` tags (e.g. keep the `| IndiaMART` suffix pattern, target length for SEO)?

---

## Resolution (implemented 2026-07-03)

All 10 implementation steps above were completed as planned. Decisions made on the open questions, since the user said to proceed directly:

1. URL query params, as proposed — `?fromCategory=&spec=` on Category→Brand, `?model=` on Brand→Brand-MCat.
2. Banner is additive only — renders exclusively when `fromCategory` is present; a search/direct-link visit to a Brand Hub is unaffected.
3. Wrote real reviews for all 8 brands (16 total, replacing the old 2-item global array), not just Atlas Copco, so the review-contamination bug is fixed everywhere, not patched only for this one journey.
4. Kept the existing `| IndiaMART` / `| IndiaMART Brands` suffix convention already used in the root layout's title.

**One deviation from the plan worth flagging:** `buildRfqRequirement` was drafted as a `lib/data.ts` export, but `data.ts` has `import 'server-only'` at the top and the helper needs to be called from client components (`ProductDetailView`, `BrandMCatView`). Moved it to a new `src/lib/rfq.ts` with no `server-only` import instead — same logic, correct module boundary. Caught by the production build failing fast, not discovered later.

### Verification (mirrors the mentor's three-screen format)

Ran against a local production build (`next build` + `next start`), via a real Chromium browser:

- **Screen 1:** `/categories/air-compressors`, filter to `11 kW (15 HP), VSD` → Atlas Copco brand card `href` is `/brands/atlascopco?fromCategory=air-compressors&spec=11+kW+%2815+HP%29%2C+VSD`. One `<h1>` on the page (was 2).
- **Screen 2:** Lands with those params → banner renders "You were exploring Atlas Copco 11 kW (15 HP), VSD Air Compressors" → Products tab is already active (no manual tap needed) → the Air Compressors product-line card shows a "You were here" badge → "Continue with GA 11 VSD+" link present, `href` = `/brands/atlascopco/air-compressors?model=atlascopco-ga11`. Page title is brand-specific, not the generic site title.
- **Screen 3:** Lands with `?model=atlascopco-ga11` → **GA 11 VSD+ is the selected model on first paint** (confirmed NOT GA 30 VSD+) → page text contains "15 HP". One `<h1>` on the page (was 2). Page title is brand-mcat-specific.
- **Search:** "Atlas Copco air compressor 15 HP" still resolves directly to `/products/atlascopco-ga11` — confirmed no regression.
- **RFQ:** requirement text for GA 11 VSD+: *"Interested in the Atlas Copco GA 11 VSD+ Air Compressor (Model: GA 11 VSD+). Key specifications: Motor Power: 11 kW (15 HP), VSD; Working Pressure: 4 - 13 bar(e); Capacity FAD: 9.7 - 33.9 l/s; Drive Type: VSD. Please share exact pricing and delivery timeline for the above."* — contains all four items the mentor asked for.
- **Reviews:** Atlas Copco's Trust & Credentials tab shows exactly its own 2 reviews (Harpreet Singh, Meera Joshi) — zero pump-related contamination. The one "pump" string match found elsewhere on the page was the brand's own legitimate "vacuum pumps" product-line description text, not a leaked review.
- **Regression:** full existing 48-case buyer-journey suite (`tests/buyer-journeys.spec.cjs`) — 48/48 passing. One test (`CF-09`) needed updating because it asserted an exact `href="/brands/kirloskar"` with no query string, which is no longer true by design now that brand links carry `fromCategory`; updated to a prefix match.

`npm run typecheck` and `npm run build` both clean throughout.
