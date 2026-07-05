import { Product, Brand, MCat, BrandMCat } from '../types';

// Client-safe counterpart to lib/search.ts's matching logic — deliberately not imported
// from there, since that module carries `import 'server-only'` (it reaches into the raw
// data.ts arrays directly). This one operates only on catalog arrays already passed in as
// props from a Server Component, so it can run live, per-keystroke, in the browser without
// a network round-trip per character.

function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function matchesAllTokens(text: string, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  const lower = text.toLowerCase();
  return tokens.every(t => lower.includes(t));
}

export interface CatalogSuggestion {
  type: 'product' | 'brand' | 'brandMCat' | 'category';
  id: string;
  label: string;
  sublabel: string;
  href: string;
  image?: string;
  logo?: string;
}

export interface Catalog {
  products: Product[];
  brands: Brand[];
  categories: MCat[];
  brandMCats: BrandMCat[];
}

// Ordered by specificity (most-specific buyer intent first) — a product match is a
// stronger, more actionable signal than a bare category match, so it should lead the list.
export function getCatalogSuggestions(query: string, catalog: Catalog, limit = 8): CatalogSuggestion[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const tokens = tokenize(q);

  const productMatches = catalog.products.filter(p => {
    const text = `${p.name} ${p.brandName} ${p.modelNumber} ${p.keySpecValue}`;
    return text.toLowerCase().includes(q) || matchesAllTokens(text, tokens);
  });

  const brandMatches = catalog.brands.filter(b => b.name.toLowerCase().includes(q));

  const brandMCatMatches = catalog.brandMCats.filter(m =>
    m.name.toLowerCase().includes(q) || matchesAllTokens(`${m.name} ${m.applications.join(' ')}`, tokens)
  );

  const categoryMatches = catalog.categories.filter(c => c.name.toLowerCase().includes(q));

  const suggestions: CatalogSuggestion[] = [
    ...productMatches.slice(0, 4).map((p): CatalogSuggestion => ({
      type: 'product', id: p.id, label: p.name, sublabel: `${p.brandName} · ${p.keySpecLabel}: ${p.keySpecValue}`,
      href: `/products/${p.id}`, image: p.image
    })),
    ...brandMatches.slice(0, 3).map((b): CatalogSuggestion => ({
      type: 'brand', id: b.id, label: b.name, sublabel: b.businessType, href: `/brands/${b.id}`, logo: b.logo
    })),
    ...brandMCatMatches.slice(0, 3).map((m): CatalogSuggestion => ({
      type: 'brandMCat', id: m.id, label: m.name, sublabel: m.tagline, href: `/brands/${m.brandId}/${m.mcatId}`
    })),
    ...categoryMatches.slice(0, 2).map((c): CatalogSuggestion => ({
      type: 'category', id: c.id, label: c.name, sublabel: 'Category', href: `/categories/${c.id}`
    }))
  ];

  return suggestions.slice(0, limit);
}
