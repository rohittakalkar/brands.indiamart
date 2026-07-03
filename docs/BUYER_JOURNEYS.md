# Complete Buyer Journey Map

Every journey below is grounded directly in the current codebase — exact routes, props, CTAs, and prefill text, not hypothetical flows. Where a journey has a known gap, it's flagged inline (⚠️) rather than smoothed over, consistent with how the [Atlas Copco intent-continuity fix](mentor_feedback/atlas-copco-15hp-intent-continuity.md) was scoped and verified. Nothing in this document has been implemented yet — it's a map, for review before any further fix work.

## Legend

- **Screen** = a real route (`src/app/**/page.tsx`)
- ✅ = context/intent is preserved across this hop today
- ⚠️ = a real, confirmed gap (cites the file/line where it originates)
- 🧭 = the buyer's likely goal at this step, not a UI label

---

## 1. Global chrome (present on every journey)

| Element | Renders on | Links |
|---|---|---|
| `DesktopNav` | Desktop only (`md:flex`) | `/categories`, `/brands`, `/compare`, `/shortlist`, `/leads`, `/quote-basket`, `/profile`, logo→`/`. Has its own search input → `router.push('/search?q=...')`. "Get Quotes" button → blank `openBuyLeadForm({})`. |
| `BottomNav` | Mobile only (`md:hidden`) | `/`, `/categories`, `/compare` (center pill), `/shortlist`, `/brands`, `/leads`. **No search input.** |
| Both | Hidden on `/leads/success` only | Badge counts (shortlist/leads/basket) are live from client Context, except `leadsCount` which is fetched once from the server on mount. |

Two independent search entry points exist (DesktopNav's header search, DiscoverView's hero search) — both call the same `resolveSearch()`/`/search?q=` path, so they behave identically once submitted.

---

## 2. Entry Point A — Cold homepage visit (`/`)

Buyer arrives with no prior context: direct URL, bookmark, or organic non-search traffic.

### A1. Category-first path 🧭 "I know the product type, not the brand"
`/` → tap a category tile → `/categories/[categoryId]` → filter by spec → tap a brand card → `/brands/[brandId]` → `/brands/[brandId]/[categoryId]` → Get Quotes

✅ **Fully fixed this session.** Spec filter carries forward via `?fromCategory=&spec=`; Brand Hub shows a "You were exploring..." banner and opens straight to Products; Brand-MCat preselects the exact model via `?model=`; RFQ text is built from the full spec table. See the [Atlas Copco doc](mentor_feedback/atlas-copco-15hp-intent-continuity.md) for the complete before/after and verification.

### A2. Brand-first path 🧭 "I already trust this brand"
`/` → Popular Brands rail → `/brands/[brandId]` → Products tab (manual tap — arrives with **no** category context, so `activeSubTab` defaults to `'overview'`, no banner) → a product line → `/brands/[brandId]/[categoryId]` (no `?model=`, correctly falls back to first product) → select a model manually → Get Quotes.

This is the *cold* counterpart to A1 — same screens, but since there's no incoming category/spec, none of the continuity banner/preselection logic activates. That's correct behavior (nothing to preserve), not a bug.

### A3. Search-driven path 🧭 "I know the exact model"
`/` hero search or DesktopNav search → `resolveSearch(q)`:
- Single confident product match → redirect straight to `/products/[id]`, skipping all browsing.
- Single confident brand match → redirect to `/brands/[id]`.
- Single confident category match → redirect to `/categories/[id]`.
- Ambiguous/no match → `/search?q=...` renders `SearchResultsView` (grouped products/brands/categories/brandMCats, whichever arrays are non-empty).

✅ Token-based multi-word matching (fixed earlier this session) means realistic phrasing like "Atlas Copco air compressor 15 HP" resolves directly — verified no regression during the Atlas Copco fix.

### A4. Featured Model path 🧭 impulse/browse
`/` → Featured Models rail → `/products/[id]` directly. Same destination as A3's product-match case, but arrived at by browsing rather than searching — see §4 (Product Detail) for what's available from there.

### A5. Homepage primary CTA 🧭 "just get me quotes, I'll describe what I need"
`/` → "Get Quotes From Verified Sellers" chip → `openBuyLeadForm({})` — blank modal, buyer types everything from scratch. No product/brand context exists to lose here.

### A6. Recently Viewed 🧭 "let me get back to what I was looking at"
`/` → Recently Viewed rail (client-memory only, `RecentlyViewedProvider`, cap 8 entries) → back into `/products/[id]` or `/brands/[id]`.
⚠️ **This rail is empty on every fresh session/hard reload** — it's `useState([])` with no persistence, so it only works within one continuous browser session. A buyer who closes the tab and returns sees "Nothing viewed yet."

### A7. Category × Brand FOMO rail 🧭 discovery
`/` → the hero's category chips (added this session, real per-category brand-density stats) → `/categories/[id]`, same destination and continuation as A1.

---

## 3. Entry Point B — Direct / deep-link landing

The case explicitly called out: a buyer arrives via a search engine result, a shared link (WhatsApp/email), or a QR code/ad — landing **directly** on an inner page with zero in-app history and zero client-side context (shortlist/basket/recently-viewed are all at their cold-start defaults).

### B1. Direct landing on Product Detail (`/products/[productId]`) — the case named explicitly
Everything that depends on the URL/route itself works correctly on a cold load:
- ✅ Full specs, sellers scoped to *this exact product* (`getSuppliers({productId})`), Compare Alternatives (real named competitors), shortlist/add-to-basket, RFQ prefilled with the complete spec table (`buildRfqRequirement`) — all render correctly with zero prior navigation.
- ✅ "Compare" CTA → `/compare?productId=X` — correctly scoped even from a cold start, shareable as its own link.

What's genuinely missing for this specific entry mode:
- ⚠️ **No link from the product back to its own brand.** `product.brandName` is rendered as plain text in three places (`ProductDetailView.tsx:80,121`) — never a `<Link href="/brands/[brandId]">`. A buyer who lands on a GA 11 VSD+ page from Google and wants to see "what else does Atlas Copco make" has no in-page path there at all.
- ⚠️ **The header back-button uses `router.back()`** (`ProductDetailView.tsx:75`), not a real `href`. On a direct landing there's no in-app history — `router.back()` either does nothing or navigates the buyer *out of the app* to whatever the browser history had before (e.g. back to the Google results page), which is surprising and loses the buyer entirely.

### B2. Direct landing on Brand Hub (`/brands/[brandId]`)
- ✅ Full brand profile, trust badges, product lines, sellers, reviews (now correctly scoped to just this brand) all render correctly cold.
- Since there's no `?fromCategory=`, `contextCategory` is `undefined` — no banner renders, `activeSubTab` defaults to `'overview'`. This is correct/expected (nothing to preserve), not a bug — but worth noting this journey never benefits from the continuity work done for A1, only the category-filtered path does.
- ⚠️ Same `router.back()` issue as B1 (`BrandProfileView.tsx:60`) — a direct landing's back button can navigate out of the app.

### B3. Direct landing on Category Brands (`/categories/[categoryId]`)
- ✅ Cleanest of the direct-landing cases: the header back-button is a real `<Link href="/categories">` (not `router.back()`), so it's safe on a cold landing. Filters, brand comparison table, and outbound brand links (now carrying `?fromCategory=&spec=`) all work identically to a warm visit, since the context they generate is built fresh from this page's own state regardless of how the buyer arrived.

### B4. Direct landing on Brand-MCat (`/brands/[brandId]/[categoryId]`)
- ✅ No `?model=` param present → correctly falls back to `products[0]?.id`, exactly the graceful-degradation path the continuity fix was designed to preserve for cold entries. Back-button is a real `<Link href="/brands/[brandId]">`, safe on cold landing.
- Genuinely no way to know *which* model a buyer meant if they arrive here with a bare URL and no `?model=` — this is expected, not a gap; the fix's job was only to preserve context when it *exists*, not invent it.

### B5. Direct landing on a shared Compare link (`/compare?productId=`/`?brandId=`/`?category=`)
✅ Fully self-contained and shareable — all three scoping modes are resolved server-side from the URL alone, no client history required.

### B6. Direct landing on a shared Search link (`/search?q=...`)
✅ Self-contained — resolution runs server-side from the URL param.

**Net assessment for Entry Point B:** three of six direct-landing destinations (Category, Brand-MCat, Compare, Search) degrade gracefully with zero fixes needed. The two that don't — Product Detail and Brand Hub — share the same two root causes: a text-only brand reference with no link, and a `router.back()` button with nothing to go back to.

---

## 4. Entry Point C — Personal tools / return visit

🧭 "I saved something earlier" or "I want to check on my quote requests"

`/profile` is the hub: stat tiles and a "Manage" list both link to `/shortlist`, `/leads`, `/quote-basket`. From `/profile`, Recently Viewed also resurfaces the same client-memory rail as A6.

- **`/shortlist`** — three independently-searchable sections (shortlisted products/brands/categories), each item linking back to its own detail page, each with its own remove (trash) and its own quote/inquiry CTA (see §6 table).
- **`/quote-basket`** — line-item quantity editing, remove, and a single "Request Quotes for All N Items" action that **bypasses the BuyLeadFormModal entirely** — it calls `submitLead()` directly with a combined requirement string enumerating every item, then redirects straight to `/leads/success`.
- **`/leads`** — read-only list of every submitted quote request (`getLeads()`, server-persisted, `force-dynamic`). No filters, no outbound links — a pure receipt/tracking screen.

⚠️ **The defining gap for this whole entry point:** Shortlist, Quote Basket, and Recently Viewed are **all client-memory-only** (`useState`, no localStorage, no server persistence). A buyer who shortlists three brands, closes the tab, and comes back later will find:
- Quote Basket: empty (not what they added).
- Recently Viewed: empty ("Nothing viewed yet").
- Shortlist: **not empty, but wrong** — it resets to three hardcoded seed IDs (`kirloskar`, `voltas-water-cooler`, `machinery`) rather than either the buyer's real picks or a true empty state. This is more misleading than an honest empty state would be, since it looks like saved data but isn't.

Only `/leads` genuinely survives a reload, because it's the one screen backed by the server (`lib/data`'s `leadsStore`) rather than client Context — though in production on Vercel this has its own already-documented caveat (serverless function isolation, see `docs/PRODUCT.md`).

---

## 5. Cross-cutting hub: Compare (`/compare`)

Reachable scoped from four places, and unscoped from two:

| Origin | Link | Resulting scope |
|---|---|---|
| Category Brands page | `/compare?category=[id]` | All sellers in that category |
| Brand Hub | `/compare?brandId=[id]` | That brand's sellers, pinned to whichever MCat its first supplier sells |
| Product Detail | `/compare?productId=[id]` | Just that exact product's sellers |
| A shared/bookmarked link | any of the above | Same as its origin — fully shareable |
| DesktopNav / BottomNav | `/compare` (no params) | Empty — buyer picks a category via the in-view picker first |

Once inside, "Add Seller" only offers sellers from the *same* resolved category (one per brand, already-added brands excluded); "Get Quotes From All Sellers" opens the shared BuyLeadFormModal with all currently-compared brand names combined into one requirement.

⚠️ Switching category via the in-view picker (the no-scope entry case) is **pure client state** — it never updates the URL. If a buyer picks "Air Compressors" in the unscoped `/compare` view and then reloads or shares that URL, the category they picked is lost and they land back on the picker. Contrast with `?category=air-compressors` links, which are fully durable.

⚠️ Also unused: `DirectoryView.tsx` (the `/brands` all-brands directory) declares `initialCategory`/`initialSearchQuery` props specifically for deep-linking into a pre-filtered brand list, but `src/app/brands/page.tsx` never passes them — no current journey deep-links into a filtered `/brands` view, even though the component was clearly built to support one.

---

## 6. Cross-cutting: every "Get Quotes" conversion point

The actual business goal every journey converges on. Two distinct submission mechanisms exist:

**Mechanism 1 — opens `BuyLeadFormModal` (buyer can review/edit before sending):**

| Origin component | Prefill quality |
|---|---|
| `DiscoverView` primary CTA | Blank — no prefill at all |
| `DesktopNav` "Get Quotes" button | Blank — no prefill at all |
| `CategorySearchView` per-product CTA | Generic: "interested in procuring [product] from standard manufacturers" |
| `CategoryBrandsView` sticky "Get Quotes" | Category-level only: "Looking for verified brands and sellers in [category]" |
| `BrandProfileView` "Inquire All" | Brand-level: references `brand.topProducts[0]`, generic catalog request |
| `BrandMCatView` "Get Quotes for [model]" | ✅ **Full spec table** via `buildRfqRequirement` (this session's fix) |
| `ProductDetailView` "Get Quote" | ✅ **Full spec table** via `buildRfqRequirement` (this session's fix) |
| `ProductDetailView` Compare Alternatives card | Names the specific competitor product being compared against |
| `ProductDetailView` per-seller "Get Quote" | References the specific seller by name |
| `ShortlistedView` product/brand/category cards | Generic templated text per section |
| `CompareView` "Get Quotes From All Sellers" | Names all compared brands together |

**Mechanism 2 — submits directly, no modal, straight to `/leads/success`:**

| Origin | Behavior |
|---|---|
| `QuoteBasketView` "Request Quotes for All N Items" | Combines every basket line into one requirement string, calls `submitLead()` directly, clears the basket, redirects |

The mentor-feedback fix only touched the two rows already marked ✅ above — every other origin still uses a generic, non-spec-driven prefill. That's a natural next-scope candidate if the goal is "every RFQ is as fully-specified as the Atlas Copco one now is," but it wasn't part of this round.

---

## 7. State persistence model (applies to every journey above)

| State | Backing | Survives hard reload / new tab? |
|---|---|---|
| Shortlist (`ShortlistProvider`) | `useState`, in-memory | ❌ resets to 3 hardcoded seed IDs |
| Quote Basket (`QuoteBasketProvider`) | `useState`, in-memory | ❌ resets to empty |
| Recently Viewed (`RecentlyViewedProvider`) | `useState`, in-memory, cap 8 | ❌ resets to empty |
| Leads / quote requests (`getLeads()`) | Server (`lib/data`'s `leadsStore`) | ✅ in dev / a persistent server. ⚠️ Unreliable specifically on Vercel production due to serverless function isolation (already documented in `docs/PRODUCT.md`) |
| URL-carried context (`?fromCategory=&spec=`, `?model=`, `?productId=` etc.) | The URL itself | ✅ always — this is exactly why the continuity fix used URL params rather than client Context |

---

## 8. Summary: confirmed gaps, ranked by how many journeys they touch

1. **Client-memory-only Shortlist/Basket/Recently-Viewed** (§4) — touches every return-visit journey; the shortlist case is worse than a plain gap since it shows *misleading* seed data instead of an honest empty state.
2. **No brand link from Product Detail** (§3, B1) — touches every direct-product-landing journey (the exact case named in this task) and every A3/A4 journey that lands on a product first.
3. **`router.back()` on Product Detail and Brand Hub headers** (§3, B1/B2) — touches the same direct-landing journeys; low effort to fix (swap for a real `<Link>` to the logical parent, same pattern already used correctly on Category and Brand-MCat headers).
4. **Only 2 of ~12 "Get Quotes" origins use the full-spec RFQ prefill** (§6) — touches every journey that converts via a category/brand/shortlist/compare CTA rather than the product or brand-mcat page specifically.
5. **`DirectoryView`'s unused deep-link props** (§5) — currently touches no live journey (dead code), but blocks a "filtered brand list" journey that doesn't exist yet.
6. **Compare's in-view category picker doesn't update the URL** (§5) — touches only the unscoped `/compare` entry, lowest reach of the six.

This is a map and gap list, not a fix plan — happy to turn any subset of §8 into the same before/after + implementation-plan treatment used for the Atlas Copco journey once you tell me which to prioritize.
