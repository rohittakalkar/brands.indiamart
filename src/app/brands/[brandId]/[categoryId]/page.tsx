import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BrandMCatView from '@/components/BrandMCatView';
import { getBrandById, getBrandMCats, getProducts, getSuppliers, getMcatById, getReviews, getAlternativeProducts } from '@/lib/data';
import type { AlternativeProduct } from '@/types';

type PageProps = {
  params: Promise<{ brandId: string; categoryId: string }>;
  searchParams: Promise<{ model?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandId, categoryId } = await params;
  const brand = getBrandById(brandId);
  const [brandMCat] = brand ? getBrandMCats({ brandId, mcatId: categoryId }) : [];
  if (!brand || !brandMCat) return {};
  return {
    title: `${brandMCat.name} — Models, Pricing & Verified Dealers | IndiaMART Brands`,
    description: brandMCat.tagline
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { brandId, categoryId } = await params;
  const { model } = await searchParams;

  const brand = getBrandById(brandId);
  if (!brand) notFound();

  const category = getMcatById(categoryId);
  if (!category) notFound();

  const [brandMCat] = getBrandMCats({ brandId, mcatId: categoryId });
  if (!brandMCat) notFound();

  const products = getProducts({ brandMCatId: brandMCat.id });
  const productIds = new Set(products.map(p => p.id));
  const suppliers = getSuppliers({ brandId }).filter(s => s.productId && productIds.has(s.productId));

  // Cross-brand "Compare Alternatives" (same pattern as the product page) keyed per model,
  // since the buyer can switch which model is selected client-side — fetching per-product
  // here and looking up by whichever is currently selected is simpler than re-fetching on
  // every selection change.
  const alternativesByProduct: Record<string, AlternativeProduct[]> = {};
  for (const p of products) {
    const alts = getAlternativeProducts(p.id);
    if (alts.length > 0) alternativesByProduct[p.id] = alts;
  }

  return (
    <BrandMCatView
      brandMCat={brandMCat}
      brand={brand}
      categoryName={category.name}
      products={products}
      suppliers={suppliers}
      reviews={getReviews({ brandId: brand.id })}
      alternativesByProduct={alternativesByProduct}
      initialModelId={model}
    />
  );
}
