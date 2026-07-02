# Data Model

All entities are defined in [`src/types.ts`](../src/types.ts) and populated in [`src/lib/data.ts`](../src/lib/data.ts) (12 hand-authored products) plus [`src/lib/generatedCatalog.ts`](../src/lib/generatedCatalog.ts) (100 programmatically generated products). There is no database — every array below is a plain in-memory TypeScript constant, present for the lifetime of the server process.

## Entity relationship overview

```
PMcat ──1:N── MCat ──1:N── BrandMCat ──N:1── Brand
                              │
                              1:N
                              │
                            Product ──1:N── Supplier
                              │
                              1:N
                              │
                     AlternativeProduct

Brand ──1:N── ServiceCenter
```

A `Brand` relates to `MCat`s **only** through `BrandMCat` (many-to-many in practice — one brand can have multiple `BrandMCat` rows across different MCats). `Brand.mcatId` is a single "primary" MCat used only for display/grouping convenience — it is **not** used to determine which categories a brand appears under; that's resolved via `BrandMCat` (see `getBrands({ mcatId })` below).

---

## `PMcat` — Parent category

The top-level taxonomy grouping (11 total). Narrower than a generic "industry" bucket — each PMcat groups only closely related MCats (e.g. "Pumps & Fluid Handling" contains both "Industrial Pumps" and "Industrial Valves," not unrelated equipment).

```ts
interface PMcat {
  id: string;      // e.g. 'power-generation-equipment'
  name: string;    // e.g. 'Power Generation Equipment'
  icon: string;    // lucide-react icon name, rendered via CategoryIcon.tsx
}
```

## `MCat` — Micro-category

The narrowest product-type classification (15 total) — e.g. "Diesel Generators," "Industrial Pumps." This is the level a buyer actually searches by ("I need a diesel generator").

```ts
interface MCat {
  id: string;       // e.g. 'diesel-generators' — used as the [categoryId] route param
  name: string;
  icon: string;
  pmcatId: string;  // FK → PMcat.id
}
```

## `Brand`

```ts
interface Brand {
  id: string;
  name: string;
  logo: string;                  // image URL (Wikimedia Commons Special:FilePath, or similar)
  description: string;
  longDescription?: string;
  mcatId: string;                 // "primary" MCat for display only — see note above
  subCategories: string[];        // free-text product line labels shown on the brand card
  rating: number;
  reviewsCount: number;
  buyersConnected: number;
  establishedYear: number;
  businessType: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  website?: string;
  headquarters: string;
  employees: string;
  annualTurnover?: string;
  verified: boolean;
  verifiedSince?: number;
  isOEM: boolean;
  certifications: string[];
  manufacturingUnits: number;
  countriesServed: number;
  topProducts: string[];
  features?: string[];
  catalogueUrl?: string;          // pseudo — see note below
  catalogueSizeMb?: number;
  catalogueUpdated?: string;
}
```

**`catalogueUrl` is pseudo data.** It points to a plausible-looking path (`/catalogues/kirloskar-product-catalogue.pdf`) with realistic file-size/date metadata for UI purposes, but no real file exists at that path. This is intentional prototype fidelity, not a broken link that needs fixing — see [PRODUCT.md § Scope & limitations](PRODUCT.md#scope--limitations).

## `BrandMCat` — the join entity

The intersection of one `Brand` and one `MCat` — e.g. "Kirloskar Diesel Generators." This is what the Brand-MCat page (`/brands/[brandId]/[categoryId]`) renders.

```ts
interface BrandMCat {
  id: string;              // e.g. 'kirloskar-diesel-generators'
  brandId: string;         // FK → Brand.id
  mcatId: string;          // FK → MCat.id
  name: string;
  tagline: string;
  description: string;
  applications: string[];  // real-world use cases, shown as chips on the Brand-MCat page
}
```

**Invariant: at most one `BrandMCat` per `(brandId, mcatId)` pair.** The route `/brands/[brandId]/[categoryId]` resolves via `getBrandMCats({ brandId, mcatId })[0]` — if two `BrandMCat` rows ever shared the same pair, the second would be silently unreachable behind the first's URL. This exact bug occurred once (Voltas had separate "Water Coolers" and "Chillers & Commercial Cooling" `BrandMCat`s both mapped to `water-coolers-chillers`, orphaning 8 products) and was fixed by merging the colliding entries. When adding a new `BrandMCat`, check this invariant first.

## `Product`

```ts
interface Product {
  id: string;
  name: string;
  brandId: string;                     // FK → Brand.id
  brandName: string;                    // denormalized for display convenience
  mcatId: string;                       // FK → MCat.id
  brandMCatId?: string;                 // FK → BrandMCat.id
  image: string;                        // verified product photo URL
  modelNumber: string;
  keySpecLabel: string;                 // e.g. "Prime Power", "Rated Power", "Nominal Size"
  keySpecValue: string;                 // e.g. "62.5 kVA / 50 kW"
  priceRange: string;                   // free text, e.g. "₹8,50,000 - ₹9,80,000"
  moq: string;                          // minimum order quantity, free text
  deliveryTime: string;
  warranty: string;
  specifications: Record<string, string>;  // full spec table, keySpecLabel is usually duplicated in here too
  description: string;
  features: string[];
  useCases?: string[];
  certifications?: string[];
  certifiedBy?: string;
  certifiedYear?: number;
}
```

`keySpecLabel`/`keySpecValue` is the one canonical "headline" spec used for compact display (product cards, comparison table columns, filter chips) — distinct from the full `specifications` map. `keySpecLabel` is consistent across all products within one `MCat` (all diesel generators use "Prime Power," all pumps use "Rated Power," etc.), which is what allows the Category Brands page's spec-value filter to work generically across every MCat without per-category special-casing.

## `Supplier`

A seller of one specific product — **never** a blanket "authorized for everything this brand makes."

```ts
interface Supplier {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  productId?: string;         // FK → Product.id — the exact model this supplier sells
  location: string;           // "City, State"
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  verified: boolean;           // → TrustBadge type="verified-supplier"
  isAuthorizedDealer: boolean; // → TrustBadge type="authorized-dealer"
  authorizedSince?: number;
  responseTime: string;
  deliveryTimeRange: string;
  priceEstimate: string;
}
```

## `AlternativeProduct`

A named, real competing product from a **different** brand, shown in a product's "Compare Alternatives" section. This is intentionally a separate, lightweight entity rather than a real cross-brand `Product` row — alternatives don't need full detail pages, they exist purely to show the buyer "here's what else solves this problem."

```ts
interface AlternativeProduct {
  id: string;
  productId: string;      // FK → Product.id — which product this is an alternative to
  brandName: string;       // e.g. "Cummins" — a competitor, never one of the 8 catalog brands
  modelNumber: string;
  mcatId: string;
  priceRange: string;
  keySpecLabel: string;
  keySpecValue: string;
}
```

## `ServiceCenter`

Post-sale support infrastructure — distinct from the sales/dealer network (`Supplier`). Two per brand.

```ts
interface ServiceCenter {
  id: string;
  brandId: string;
  name: string;
  location: string;
  servicesOffered: string[];   // e.g. "Installation & Commissioning", "AMC & Preventive Maintenance"
  contactPhone: string;
  workingHours: string;
}
```

## `BuyLead` — a quote request

The only entity with real (if in-memory) write behavior — created via `POST /api/leads`.

```ts
interface BuyLead {
  id: string;
  productName: string;
  brandName?: string;
  quantity: string;
  location: string;
  requirement: string;
  timestamp: string;
  status: 'pending' | 'connected' | 'completed';
}
```

## `Review`

```ts
interface Review {
  id: string;
  userName: string;
  userRole: string;
  companyName: string;
  rating: number;
  comment: string;
  date: string;
}
```

Reviews are not scoped per-brand or per-product in the current data model — the same `REVIEWS` array is shown across brand/product pages. This is a known simplification, not a bug.

---

## Query helpers (`src/lib/data.ts`)

All are synchronous, server-only functions — no `await`, no network call.

| Function | Filter params | Returns |
|---|---|---|
| `getPMcats()` | — | `PMcat[]` (all 11) |
| `getPMcatById(id)` | — | `PMcat \| undefined` |
| `getMcats()` | — | `MCat[]` (all 15) |
| `getMcatById(id)` | — | `MCat \| undefined` |
| `getBrands(filter?)` | `{ mcatId? }` | `Brand[]` — when `mcatId` given, resolved via `BrandMCat`, **not** `Brand.mcatId` |
| `getBrandById(id)` | — | `Brand \| undefined` |
| `getBrandMCats(filter?)` | `{ brandId?, mcatId? }` | `BrandMCat[]` |
| `getBrandMCatById(id)` | — | `BrandMCat \| undefined` |
| `getProducts(filter?)` | `{ mcatId?, brandId?, brandMCatId? }` | `Product[]` |
| `getProductById(id)` | — | `Product \| undefined` |
| `getSuppliers(filter?)` | `{ brandId?, productId? }` | `Supplier[]` |
| `getAlternativeProducts(productId)` | — | `AlternativeProduct[]` |
| `getServiceCenters(filter?)` | `{ brandId? }` | `ServiceCenter[]` |
| `getLeads()` | — | `BuyLead[]` (in-memory store) |
| `addLead(data)` | — | `BuyLead` — assigns `id`/`timestamp`/`status: 'pending'` |

**Important:** `getBrands({ mcatId })` resolves via the `BrandMCat` join table, not the `Brand.mcatId` field. This is deliberate — a brand can serve multiple MCats, and using the single `mcatId` field for category-scoped brand lookups was a real bug found and fixed during development (Kirloskar's diesel generator line was invisible on the Diesel Generators category page because `Brand.mcatId` pointed elsewhere). If you add a new query function that needs "which brands serve category X," resolve it through `BrandMCat`, not `Brand.mcatId`.

## Catalog size

| Entity | Count |
|---|---|
| PMcat | 11 |
| MCat | 15 |
| Brand | 8 |
| BrandMCat | 16 |
| Product | 112 (12 hand-authored + 100 generated) |
| Supplier | 114 |
| ServiceCenter | 16 (2 per brand) |
