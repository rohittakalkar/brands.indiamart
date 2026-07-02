import { notFound } from 'next/navigation';
import BrandProfileView from '@/components/BrandProfileView';
import { getBrandById, getProducts, getSuppliers, REVIEWS } from '@/lib/data';

export default async function Page({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  const brand = getBrandById(brandId);
  if (!brand) notFound();

  return (
    <BrandProfileView
      brand={brand}
      brandProducts={getProducts({ brandId: brand.id })}
      brandSuppliers={getSuppliers({ brandId: brand.id })}
      reviews={REVIEWS}
    />
  );
}
