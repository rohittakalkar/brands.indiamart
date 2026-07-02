# Product Documentation

## What this is

IndiaMART Brands is a **buyer confidence layer** for branded industrial products — a marketplace vertical where a B2B buyer can go from "I need a 62.5 kVA diesel generator" to "here are three verified sellers, let me request quotes" without leaving a single, coherent information architecture.

It exists because plain product search on a large B2B directory doesn't answer the questions a buyer actually has before purchase:
- *Which brands even make this?*
- *Is this seller actually authorized to sell this brand, or just relisting it?*
- *What's the exact model, not just the product category?*
- *Who else near me sells this exact model, and how do they compare?*

## Who it's for

**Primary user: the B2B buyer**, typically a procurement or plant engineer sourcing industrial equipment (pumps, generators, motors, tools, automation hardware, electrical equipment) for their own company's use — not a consumer.

Three buyer entry points, all converging on the same conversion action (request quotes):

| Journey | Path |
|---|---|
| **Category-first** | "I need a diesel generator, don't know which brand" → Category Brands page → pick a brand → Brand-MCat page → pick a model → Sellers → Get Quotes |
| **Brand-first** | "I trust Kirloskar" → Brand Hub → Explore Products by Category → Brand-MCat page → pick a model → Sellers → Get Quotes |
| **Exact-search** | "Kirloskar 62.5 kVA Generator" (already knows the exact model) → Product page → Sellers → Get Quotes |

## Information architecture

The core design principle: **brand, category, and product are separate entities that intersect** — a brand is never treated as a category, and a category page never assumes only one brand serves it.

```
PMcat (Parent category)          e.g. "Power Generation Equipment"
  └─ MCat (Micro-category)       e.g. "Diesel Generators"
       └─ Brand                  e.g. "Kirloskar"
            └─ Brand-MCat        e.g. "Kirloskar Diesel Generators"
                 └─ Product      e.g. "Kirloskar Green 62.5 kVA Diesel Generator"
                      └─ Sellers  verified/authorized dealers of that exact model
```

"PMcat" and "MCat" follow the naming convention used internally at IndiaMART for its real category taxonomy (Parent-category / Micro-category) — this was a deliberate rename from the earlier, more generic "Industry"/"Category" naming, done specifically so the codebase's vocabulary matches how the business already talks about its taxonomy. See [ADR-0001](adr/0001-pmcat-mcat-taxonomy.md) for the full rationale.

A brand is not confined to a single MCat — Kirloskar, for example, has separate Brand-MCat lines under both "Diesel Generators" and "Industrial Pumps." The taxonomy models this as a many-to-many relationship (via the `BrandMCat` join entity), not a single `brand.category` field, specifically to avoid brands getting orphaned from categories they actually serve.

## Page inventory

| Page | Route | Purpose | Primary action |
|---|---|---|---|
| Homepage | `/` | Discovery surface, not a taxonomy drill-down — one search bar, lightweight browse tiles | Search / Get Quotes |
| Category Brands page | `/categories/[mcatId]` | "I know the product type, not the brand" — compare all brands serving this MCat | **Compare Brands** |
| Brand Hub | `/brands/[brandId]` | "I know the brand" — company profile, verification, all product lines, dealer network, service centers, catalogue | **Explore Products by Category** |
| Brand-MCat page (conversion centre) | `/brands/[brandId]/[mcatId]` | All of one brand's models within one MCat — inline model picker, live spec panel, dealers filtered to the selected model | **Get Quotes for [selected model]** |
| Product detail | `/products/[productId]` | One exact model — full specs, sellers of *that model only*, compare alternatives (competing brands) | Get Quotes |
| Compare | `/compare` | Side-by-side comparison, always scoped to one category — never compares unrelated products | Get Quotes From All Sellers |
| Search results | `/search?q=` | Fallback when a query doesn't resolve confidently to one product/brand/category | — |
| Shortlist | `/shortlist` | Saved brands/products/categories (session-only, no persistence) | — |
| Quote Basket | `/quote-basket` | Multi-item quote request staging area | — |
| Buyer Profile | `/profile` | Buyer's own info, recently viewed, saved items | — |

Each page's **primary call-to-action deliberately differs by page type** — the Category Brands page pushes toward comparing brands, the Brand Hub pushes toward exploring that brand's catalogue, and the Brand-MCat page (the actual conversion centre) pushes toward requesting a quote for a specific selected model. This is intentional: forcing one universal "Get Quotes" button on every page regardless of what the buyer is actually trying to do at that point in their journey flattens the funnel instead of guiding it.

## Trust system

Every verification claim on the site names **who verified it, what was verified, and when** — the product never claims a blanket "100% Verified." Four distinct badge types (`src/components/TrustBadge.tsx`):

| Badge | Meaning |
|---|---|
| `verified-supplier` | Business identity verified by IndiaMART |
| `authorized-dealer` | Authorized to sell this specific brand's products |
| `manufacturer-oem` | Original Equipment Manufacturer |
| `certified-product` | Meets certified quality/safety standards |

## Buyer-facing language

The UI never surfaces the internal term "BuyLead" to a buyer — copy uses "Get Quotes," "Send Requirement," "Request Quotes," or "Check Availability" instead. (Internal type/component names like the `BuyLead` interface and `BuyLeadFormModal` component keep the internal name — only user-visible copy follows this rule.)

## Design system

| Token | Value |
|---|---|
| Primary | `#0B1F3A` (navy) |
| Secondary | `#12305C` |
| CTA (call-to-action) | `#FF6A1A` (orange) |
| Background | `#F8F9FB` |
| Accent green | `#1B8A5C` |
| Accent purple | `#6D5EF4` |
| Accent blue | `#2E6BE0` |
| Heading font | Sora |
| Body font | Inter |
| Numeric/mono font | IBM Plex Mono |

Defined in `src/index.css` via Tailwind v4's `@theme` block; fonts are self-hosted via `next/font/google` (not loaded from a render-blocking external `<link>`).

## Catalog scope

- **11 PMcats**, **15 MCats**, **8 brands** (Kirloskar, KSB, Crompton, Bosch, Siemens, Havells, Voltas, Atlas Copco)
- **16 Brand-MCat lines** across those 8 brands
- **112 products**, each with real, verified product photography (not placeholder images)
- **114 supplier/dealer listings**, each scoped to the exact product(s) they sell — never a blanket "this brand's dealer for everything"
- **16 service center listings** (2 per brand) — installation, AMC, spares, warranty support, distinct from the sales dealer network
- Every product's "Compare Alternatives" section lists **real, named competing brands** (e.g. Cummins/Mahindra Powerol for diesel generators, Grundfos/Flowserve for pumps) — cross-checked against real IndiaMART category listings, not invented names

## Scope & limitations

This is a prototype demonstrating the information architecture and buyer experience — it is explicitly **not** a production system:

- No authentication, no real user accounts — the "Buyer Profile" is static
- No database — `BuyLead` (quote request) submissions live in an in-memory array and reset on server restart
- Product catalogues (`Brand.catalogueUrl`) and service-center contact details are illustrative pseudo-data, not real files or real phone lines
- The AI Assistant component (`src/components/AIAssistant.tsx`) exists and is functional but is not linked from any page
- Search resolution (`src/lib/search.ts`) uses simple keyword matching, not a real search index
