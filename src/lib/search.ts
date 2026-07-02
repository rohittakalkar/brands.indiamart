import 'server-only';
import { BRANDS, PRODUCTS, MCATS, BRAND_MCATS } from './data';
import { Brand, Product, MCat, BrandMCat } from '../types';

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
  return {
    products: PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.modelNumber.toLowerCase().includes(q)
    ).slice(0, 8),
    brands: BRANDS.filter(b => b.name.toLowerCase().includes(q)).slice(0, 6),
    categories: MCATS.filter(c => c.name.toLowerCase().includes(q)).slice(0, 6),
    brandMCats: BRAND_MCATS.filter(m => m.name.toLowerCase().includes(q)).slice(0, 6)
  };
}
