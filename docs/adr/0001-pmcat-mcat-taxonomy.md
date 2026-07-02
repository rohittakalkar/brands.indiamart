# ADR-0001: Rename Industry/Category to PMcat/MCat and re-split the taxonomy

**Status:** Accepted
**Date:** 2026-07-02

## Context

The original taxonomy had two levels: `Industry` (4 broad buckets, e.g. "Industrial Machinery & Power Equipment") and `Category` (9 narrower types, e.g. "Diesel Generators," "Industrial Machinery"). A stakeholder review of the information architecture raised two issues:

1. **Naming.** The reviewer's feedback used IndiaMART's own internal taxonomy terminology — "Parent category" (PMcat) and "Micro-category" (MCat) — not "Industry"/"Category." This was verified against IndiaMART's real, live category pages (e.g. the breadcrumb `Power Generators & Alternators → Diesel Generator → Kirloskar Diesel Generator` uses this exact convention, including a literal "Brand Mcat" UI section), confirming this wasn't just stylistic preference but the actual vocabulary the business uses.

2. **Granularity.** The `machinery` `Category` was a catch-all bundling three functionally unrelated product lines under one entity: pumps, water coolers/chillers, and air compressors. This meant, for example, that Kirloskar's diesel generator line was invisible on any "machinery"-scoped brand listing, because `Brand.category` (the field then used to resolve "which brands serve this category") could only hold one value per brand.

## Decision

- Renamed `Industry` → `PMcat`, `Category` → `MCat` (types, arrays, query functions, and every foreign-key field: `industryId` → `pmcatId`, `categoryId` → `mcatId`).
- Renamed `Product.category` → `Product.mcatId` and `Brand.category` → `Brand.mcatId` for consistency — these fields hold MCat ids, so their names should say so.
- Re-split the 9 `Category`s into 15 `MCat`s across 11 `PMcat`s (up from 4 `Industry`s), separating what had been bundled under `machinery` into `industrial-pumps`, `industrial-valves`, `water-coolers-chillers`, and `air-compressors` — each grouping matched against IndiaMART's real category structure for the equivalent products.
- Fixed `getBrands({ mcatId })` to resolve via the `BrandMCat` join table instead of the single `Brand.mcatId` field, since a brand can genuinely serve multiple MCats (Kirloskar sells both diesel generators and pumps) and the old single-field lookup structurally couldn't represent that.

URL structure was deliberately **not** changed — routes remain `/brands/[brandId]`, `/categories/[categoryId]`, `/brands/[brandId]/[categoryId]`. Only the underlying data model and route *param names as concepts* changed; the URL path segments themselves were kept stable to avoid an unrelated, higher-risk routing migration in the same change.

## Consequences

- (+) Vocabulary in the codebase now matches how the business actually talks about the taxonomy — a new engineer reading "PMcat" and cross-referencing IndiaMART's own site sees the same term.
- (+) The `machinery` catch-all no longer hides distinct product lines from each other on category-scoped brand listings.
- (+) Fixing `getBrands()` to use `BrandMCat` instead of `Brand.mcatId` closed a real, previously-shipped bug (Kirloskar diesel generators missing from that category's brand list).
- (-) This was a large mechanical rename touching ~20 files. It was executed by renaming the core type/array definitions first, then using `tsc --noEmit` compile errors as an exhaustive checklist of every call site needing an update, rather than attempting to enumerate usages manually — this is the reliable way to safely execute a rename of this size in a strictly-typed codebase.
- (-) A related but structurally independent issue surfaced during verification: two `BrandMCat` entries (Voltas's "Water Coolers" and "Chillers & Commercial Cooling," and similarly for Atlas Copco) had been created sharing the same `(brandId, mcatId)` pair, which orphaned one of each pair behind an unreachable URL once routing depended on that pair being unique. This was found by systematically requesting every `(brandId, mcatId)` route after the rename, not by the rename itself — see [DATA_MODEL.md](../DATA_MODEL.md#brandmcat--the-join-entity) for the invariant this establishes going forward.
