import 'server-only';
import { BRANDS, PRODUCTS, MCATS, BRAND_MCATS } from './data';
import { Brand, Product, MCat, BrandMCat } from '../types';

// Splits a query into individual words for order-independent, multi-word matching —
// a literal `text.includes(fullQuery)` check fails for realistic buyer phrasing like
// "80 kva generator" against a product named "Kirloskar Green 62.5 kVA Diesel Generator",
// since the exact phrase never appears verbatim even though every concept matches.
function tokenize(s: string): string[] {
  return s.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

// True if every query token appears somewhere in the combined text (order-independent).
function matchesAllTokens(text: string, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  const lower = text.toLowerCase();
  return tokens.every(t => lower.includes(t));
}

// True if at least half the query tokens (min 1) appear — used as a looser fallback
// so a query with one irrelevant/misspelled word doesn't produce zero results outright.
function matchesMostTokens(text: string, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  const lower = text.toLowerCase();
  const hits = tokens.filter(t => lower.includes(t)).length;
  return hits >= Math.ceil(tokens.length / 2);
}

export type SearchResolution =
  | { type: 'product'; product: Product }
  | { type: 'brand'; brand: Brand }
  | { type: 'category'; categoryId: string }
  | { type: 'fallback'; query: string };

export function resolveSearch(query: string): SearchResolution {
  const q = query.toLowerCase().trim();

  // 1. Check for exact/partial Brand Match
  const matchedBrand = BRANDS.find(b =>
    b.name.toLowerCase().includes(q) ||
    b.id.toLowerCase() === q ||
    (b.logo && b.logo.toLowerCase() === q)
  );

  // 2. Check for Brand + Product combinations (e.g. "Kirloskar Pump" or "Siemens PLC")
  let combinedProductMatch: Product | null = null;
  let combinedBrandMatch: Brand | null = null;

  for (const brand of BRANDS) {
    const brandKeywords = [brand.id.toLowerCase(), brand.name.toLowerCase().split(' ')[0]];
    const matchesBrandKeyword = brandKeywords.some(keyword => q.includes(keyword));

    if (matchesBrandKeyword) {
      combinedBrandMatch = brand;
      const words = q.split(' ').filter(w => !brandKeywords.some(bk => bk.includes(w) || w.includes(bk)));
      const remainingQuery = words.join(' ');
      if (remainingQuery.length > 1) {
        const matchedProd = PRODUCTS.find(p =>
          p.brandId === brand.id &&
          (p.name.toLowerCase().includes(remainingQuery) ||
           p.mcatId.toLowerCase().includes(remainingQuery) ||
           p.description.toLowerCase().includes(remainingQuery))
        );
        if (matchedProd) {
          combinedProductMatch = matchedProd;
          break;
        }
      }
    }
  }

  if (combinedProductMatch) {
    return { type: 'product', product: combinedProductMatch };
  }

  if (combinedBrandMatch && q.length < combinedBrandMatch.name.toLowerCase().split(' ')[0].length + 5) {
    return { type: 'brand', brand: combinedBrandMatch };
  }

  if (matchedBrand) {
    return { type: 'brand', brand: matchedBrand };
  }

  // 3. Check for specific standalone Product Name match
  const matchedProduct = PRODUCTS.find(p =>
    p.name.toLowerCase().includes(q) ||
    q.includes(p.name.toLowerCase())
  );
  if (matchedProduct) {
    return { type: 'product', product: matchedProduct };
  }

  // 4. Check for standalone MCat Match
  const matchedCategory = MCATS.find(c =>
    c.name.toLowerCase().includes(q) ||
    q.includes(c.name.toLowerCase()) ||
    c.id.toLowerCase() === q
  );
  if (matchedCategory) {
    return { type: 'category', categoryId: matchedCategory.id };
  }

  // 4b. Realistic multi-word buyer phrasing (e.g. "80 kva generator") rarely appears as
  // one exact substring — retry product/category matching token-by-token before giving up.
  const tokens = tokenize(q);
  if (tokens.length > 1) {
    const tokenProductMatch = PRODUCTS.find(p =>
      matchesAllTokens(`${p.name} ${p.brandName} ${p.modelNumber} ${p.keySpecValue}`, tokens)
    );
    if (tokenProductMatch) {
      return { type: 'product', product: tokenProductMatch };
    }

    const tokenCategoryMatch = MCATS.find(c => matchesAllTokens(c.name, tokens));
    if (tokenCategoryMatch) {
      return { type: 'category', categoryId: tokenCategoryMatch.id };
    }
  }

  // 5. Default: general search query in Directory view
  return { type: 'fallback', query };
}

export interface GroupedSearchResults {
  products: Product[];
  brands: Brand[];
  categories: MCat[];
  brandMCats: BrandMCat[];
}

export function getGroupedSearchResults(query: string): GroupedSearchResults {
  const q = query.toLowerCase().trim();
  const tokens = tokenize(q);

  let products = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brandName.toLowerCase().includes(q) ||
    p.modelNumber.toLowerCase().includes(q)
  );
  let brands = BRANDS.filter(b => b.name.toLowerCase().includes(q));
  let categories = MCATS.filter(c => c.name.toLowerCase().includes(q));
  let brandMCats = BRAND_MCATS.filter(m => m.name.toLowerCase().includes(q));

  // Realistic multi-word queries rarely appear as one exact substring — fall back to
  // order-independent token matching (then a looser "most tokens" pass) so a phrase like
  // "80 kva generator" still surfaces the 62.5/82.5 kVA generators instead of zero results.
  if (tokens.length > 1) {
    if (products.length === 0) {
      products = PRODUCTS.filter(p =>
        matchesAllTokens(`${p.name} ${p.brandName} ${p.modelNumber} ${p.keySpecValue}`, tokens)
      );
    }
    if (products.length === 0) {
      products = PRODUCTS.filter(p =>
        matchesMostTokens(`${p.name} ${p.brandName} ${p.modelNumber} ${p.keySpecValue}`, tokens)
      );
    }
    if (brands.length === 0) {
      brands = BRANDS.filter(b => matchesAllTokens(`${b.name} ${b.subCategories.join(' ')}`, tokens));
    }
    if (categories.length === 0) {
      categories = MCATS.filter(c => matchesAllTokens(c.name, tokens));
    }
    if (brandMCats.length === 0) {
      brandMCats = BRAND_MCATS.filter(m => matchesAllTokens(`${m.name} ${m.applications.join(' ')}`, tokens));
    }
  }

  return {
    products: products.slice(0, 8),
    brands: brands.slice(0, 6),
    categories: categories.slice(0, 6),
    brandMCats: brandMCats.slice(0, 6)
  };
}
