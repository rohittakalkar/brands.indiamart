# Architecture

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript, strict mode |
| UI | React 19, Tailwind CSS v4 |
| Animation | `motion` (Framer Motion's successor package) |
| Icons | `lucide-react` |
| Fonts | Self-hosted via `next/font/google` (Sora, Inter, IBM Plex Mono) |
| Hosting | Vercel |
| Data | In-memory TypeScript arrays (no database) |

There is no external database, no ORM, and no auth provider. This is a deliberate prototype constraint, not an oversight — see [PRODUCT.md § Scope & limitations](PRODUCT.md#scope--limitations).

## Rendering strategy: thin Server Component page → fat Client Component view

Every route follows the same consistent pattern:

```tsx
// src/app/brands/[brandId]/page.tsx  (Server Component)
import BrandProfileView from '@/components/BrandProfileView';
import { getBrandById, getProducts, getSuppliers } from '@/lib/data';

export default async function Page({ params }) {
  const { brandId } = await params;
  const brand = getBrandById(brandId);
  if (!brand) notFound();

  return (
    <BrandProfileView
      brand={brand}
      brandProducts={getProducts({ brandId: brand.id })}
      brandSuppliers={getSuppliers({ brandId: brand.id })}
    />
  );
}
```

- **`page.tsx` files are Server Components.** They resolve route params, call `src/lib/data.ts` functions directly (no network round-trip — it's an in-process function call), and pass plain data down as props.
- **`components/*View.tsx` files are Client Components** (`'use client'`) that receive that data as props and own all interactivity — tabs, filters, modals, local state.

### Why Server Components call `lib/data.ts` directly instead of fetching their own API routes

Self-fetching your own API during server-side rendering is a known anti-pattern: it adds a real network round-trip, requires base-URL plumbing that has no equivalent in a Server Component context, and double-serializes data that's already in-process. The API routes under `src/app/api/*` exist for genuine client-side use (see below) — Server Components bypass them for initial render, which is standard Next.js practice, not a shortcut.

## Server-only data access vs. client-side services

Two parallel access paths exist for the same data, and they are not interchangeable:

| | `src/lib/data.ts` | `src/services/*.ts` |
|---|---|---|
| Guarded by | `import 'server-only'` (line 1) | — |
| Callable from | Server Components only | Client Components only |
| Mechanism | Direct in-process function call | `fetch('/api/...')` |
| Used for | Initial page render | Anything happening after mount — modal submissions, client-side search, the AI Assistant |

The `server-only` import at the top of `src/lib/data.ts` is not just documentation — it's enforced. If any Client Component imports from `lib/data.ts` directly, the build fails. This is intentional: it makes the server/client data boundary a compile-time guarantee instead of a convention someone can accidentally violate.

## State management

No global state library (Redux, Zustand, etc.) — client-side state that needs to persist across route navigations lives in React Context providers, all mounted once in the root layout (`src/app/layout.tsx`):

```tsx
<ShortlistProvider>
  <RecentlyViewedProvider>
    <QuoteBasketProvider>
      <BuyLeadModalProvider>
        <AppShell>{children}</AppShell>
      </BuyLeadModalProvider>
    </QuoteBasketProvider>
  </RecentlyViewedProvider>
</ShortlistProvider>
```

| Provider | Owns |
|---|---|
| `ShortlistProvider` | Saved brand/product/category IDs |
| `RecentlyViewedProvider` | Last-N viewed products/brands, for the homepage "Recently Viewed" tile |
| `QuoteBasketProvider` | Multi-item quote request staging (`/quote-basket`) |
| `BuyLeadModalProvider` | Global control of the `BuyLeadFormModal` — any component can call `useBuyLeadModal().open({...})` to trigger a quote request from anywhere in the tree |

**All of this state is in-memory and session-only.** There is no `localStorage`/cookie persistence and no backing database — a hard refresh clears the shortlist, quote basket, and recently-viewed list. This matches the prototype's overall fidelity level; it is not a bug.

## The Compare feature's category-scoping

`CompareView.tsx` is worth calling out specifically because its scoping logic is a deliberate fix, not incidental: comparisons are always resolved to a single category (`comparisonCategory`, derived from either an explicit `?category=` param, the category of an already-selected product, or a category the buyer picks from an empty-state chooser). The "Add Seller" flow only ever offers sellers of products within that same category. This exists because an earlier version allowed adding *any* brand to a comparison regardless of category (e.g. comparing a diesel generator dealer against a power-tool dealer), which produced comparisons with no buyer value. See `src/components/CompareView.tsx` for the implementation.

## Directory reference

```
src/
  app/
    api/                          # REST API routes — see docs/API.md
    page.tsx                      # Homepage
    categories/[categoryId]/      # Category Brands page (categoryId = MCat id)
    brands/[brandId]/             # Brand Hub page
    brands/[brandId]/[categoryId]/  # Brand-MCat page (categoryId = MCat id)
    products/[productId]/         # Product detail page
    compare/                      # Compare page
    search/                       # Search results / resolution
    shortlist/, quote-basket/, profile/, leads/

  components/
    *View.tsx                     # Route-level Client Components (one per page)
    *Provider.tsx                 # Context providers for cross-route client state
    BrandLogo.tsx, CategoryIcon.tsx, TrustBadge.tsx   # Small reusable presentational components
    AppShell.tsx, DesktopNav.tsx, BottomNav.tsx        # Layout chrome

  lib/
    data.ts                       # server-only: all entity arrays + query helper functions
    generatedCatalog.ts           # server-only: programmatically generates 100 of the 112 products
    search.ts                     # server-only: free-text search query resolution

  services/                       # Client-side fetch() wrappers around /api/* routes

  types.ts                        # All shared entity TypeScript interfaces
```

## Why `generatedCatalog.ts` exists as a separate file from `data.ts`

`src/lib/data.ts` hand-authors 12 "flagship" products with full editorial detail (long descriptions, curated feature lists). `src/lib/generatedCatalog.ts` programmatically generates the remaining 100 products from compact per-family "seed" data plus shared templates (`FAMILY_META`) for description/features/certifications text — this keeps the bulk catalog maintainable (retagging all products in one product family to a new category is a one-line change to a lookup table, not 100 individual edits) at some cost to per-product editorial uniqueness. `data.ts` imports and spreads `GENERATED_PRODUCTS`, `GENERATED_SUPPLIERS`, `GENERATED_ALTERNATIVES`, and `GENERATED_BRAND_MCATS` into its own exported arrays, so from every other file's perspective there is one unified `PRODUCTS` array — the split is an internal authoring convenience, not a data-layer boundary.

## Known operational gotchas

- **Windows dev-server cache staleness**: `.next` build cache occasionally goes stale after large structural changes (renamed exports, deleted files) and produces `Cannot find module './XXX.js'` errors. Fix: stop the dev server, `rm -rf .next`, restart. This is a recurring Windows/webpack-cache issue, not a code bug.
- **Vercel build config**: the Vercel project's dashboard settings were originally configured for the pre-migration Vite app (`vite build`, output directory `dist`). `vercel.json` now pins the correct Next.js build/output settings explicitly so deployments don't silently depend on dashboard state matching the repo.
