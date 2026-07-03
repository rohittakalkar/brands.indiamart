import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BrandProfileView from '@/components/BrandProfileView';
import { getBrandById, getProducts, getSuppliers, getBrandMCats, getServiceCenters, getReviews, getMcatById, findProductBySpec } from '@/lib/data';

type PageProps = {
  params: Promise<{ brandId: string }>;
  searchParams: Promise<{ fromCategory?: string; spec?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandId } = await params;
  const brand = getBrandById(brandId);
  if (!brand) return {};
  return {
    title: `${brand.name} — Verified Sellers, Products & Trust Credentials | IndiaMART Brands`,
    description: brand.description
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { brandId } = await params;
  const { fromCategory, spec } = await searchParams;
  const brand = getBrandById(brandId);
  if (!brand) notFound();

  // Resolve incoming category+spec context (from a filtered category page) into the
  // exact product it points to, so the Brand Hub can offer a direct "Continue" path
  // instead of losing what the buyer was just looking at.
  const contextCategory = fromCategory ? getMcatById(fromCategory) : undefined;
  const contextProduct = contextCategory && spec ? findProductBySpec(brand.id, contextCategory.id, spec) : undefined;

  return (
    <BrandProfileView
      brand={brand}
      brandMCats={getBrandMCats({ brandId: brand.id })}
      brandProducts={getProducts({ brandId: brand.id })}
      brandSuppliers={getSuppliers({ brandId: brand.id })}
      serviceCenters={getServiceCenters({ brandId: brand.id })}
      reviews={getReviews({ brandId: brand.id })}
      contextCategory={contextCategory ? { id: contextCategory.id, name: contextCategory.name } : undefined}
      contextProduct={contextProduct}
    />
  );
}
