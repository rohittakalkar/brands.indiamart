import { Metadata } from 'next';
import CompareView from '@/components/CompareView';
import { getSuppliers, getBrandById, getProductById, getMcats, getProducts } from '@/lib/data';
import type { Supplier } from '@/types';

interface CompareSearchParams {
  productId?: string;
  brandId?: string;
  category?: string;
  // A literal, shareable snapshot of an in-progress comparison (which sellers, which
  // category) — written back to the URL by CompareView itself whenever the buyer adds/
  // removes a seller or switches category, so any customized comparison stays a durable,
  // shareable link rather than resetting to just the original ?productId=/?brandId= scope.
  sellers?: string;
}

type PageProps = { searchParams: Promise<CompareSearchParams> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { productId, brandId, category } = await searchParams;
  let scope = 'Compare Sellers';
  if (productId) scope = getProductById(productId)?.name || scope;
  else if (brandId) scope = getBrandById(brandId)?.name || scope;
  else if (category) scope = getMcats().find(c => c.id === category)?.name || scope;
  return { title: `Compare — ${scope} | IndiaMART Brands` };
}

export default async function Page({ searchParams }: PageProps) {
  const { productId, brandId, category, sellers } = await searchParams;

  const products = getProducts();
  const productsById = new Map(products.map(p => [p.id, p]));
  const allSuppliers = getSuppliers();

  let suppliers = allSuppliers;
  let label = 'Compare Sellers';
  let scopeKey = 'none';
  let resolvedCategory: string | undefined;

  const sharedSupplierIds = sellers ? sellers.split(',').filter(Boolean) : [];
  const sharedSuppliers: Supplier[] = sharedSupplierIds
    .map(id => allSuppliers.find(s => s.id === id))
    .filter((s): s is Supplier => !!s);

  if (sharedSuppliers.length > 0) {
    // A shared/customized comparison link takes priority over the shorthand scope params —
    // it's the most literal statement of what the buyer actually wants to compare.
    suppliers = sharedSuppliers;
    scopeKey = `sellers-${sellers}`;
    resolvedCategory = category || (sharedSuppliers[0].productId ? productsById.get(sharedSuppliers[0].productId)?.mcatId : undefined);
    label = (resolvedCategory && getMcats().find(c => c.id === resolvedCategory)?.name) || 'Shared Comparison';
  } else if (productId) {
    const product = getProductById(productId);
    suppliers = getSuppliers({ productId });
    label = product?.name || 'Product';
    scopeKey = `product-${productId}`;
    resolvedCategory = product?.mcatId;
  } else if (brandId) {
    const brand = getBrandById(brandId);
    suppliers = getSuppliers({ brandId });
    label = brand?.name || 'Brand';
    scopeKey = `brand-${brandId}`;
    // A brand's dealer network can now span multiple MCats (e.g. Kirloskar sells both
    // pumps and diesel generators) — pin the comparison to whichever MCat the brand's
    // first listed supplier actually sells, so specs stay apples-to-apples.
    const firstProduct = suppliers.map(s => s.productId && productsById.get(s.productId)).find(Boolean);
    resolvedCategory = firstProduct ? firstProduct.mcatId : undefined;
    if (resolvedCategory) {
      suppliers = suppliers.filter(s => s.productId && productsById.get(s.productId)?.mcatId === resolvedCategory);
    }
  } else if (category) {
    const catObj = getMcats().find(c => c.id === category);
    suppliers = allSuppliers.filter(s => s.productId && productsById.get(s.productId)?.mcatId === category);
    label = catObj?.name || category;
    scopeKey = `category-${category}`;
    resolvedCategory = category;
  } else {
    // No scope given (bottom-nav "Compare" entry) — don't preload every seller across every
    // category, that produces nonsensical brand-vs-brand comparisons. Start empty and let the
    // buyer pick a category first.
    suppliers = [];
  }

  return (
    <CompareView
      key={scopeKey}
      suppliers={suppliers}
      allSuppliers={allSuppliers}
      products={products}
      categories={getMcats()}
      initialCategory={resolvedCategory}
      brandName={label}
    />
  );
}
