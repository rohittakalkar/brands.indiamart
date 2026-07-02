import { notFound } from 'next/navigation';
import BrandMCatView from '@/components/BrandMCatView';
import { getBrandById, getBrandMCats, getProducts, getSuppliers, getMcatById, REVIEWS } from '@/lib/data';

export default async function Page({ params }: { params: Promise<{ brandId: string; categoryId: string }> }) {
  const { brandId, categoryId } = await params;

  const brand = getBrandById(brandId);
  if (!brand) notFound();

  const category = getMcatById(categoryId);
  if (!category) notFound();

  const [brandMCat] = getBrandMCats({ brandId, mcatId: categoryId });
  if (!brandMCat) notFound();

  const products = getProducts({ brandMCatId: brandMCat.id });
  const productIds = new Set(products.map(p => p.id));
  const suppliers = getSuppliers({ brandId }).filter(s => s.productId && productIds.has(s.productId));

  return (
    <BrandMCatView
      brandMCat={brandMCat}
      brand={brand}
      categoryName={category.name}
      products={products}
      suppliers={suppliers}
      reviews={REVIEWS}
    />
  );
}
