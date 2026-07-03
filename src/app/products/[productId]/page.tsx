import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductById, getBrandById, getSuppliers, getAlternativeProducts } from '@/lib/data';

type PageProps = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);
  if (!product) return {};
  return {
    title: `${product.brandName} ${product.modelNumber} — ${product.keySpecLabel}: ${product.keySpecValue} | IndiaMART Brands`,
    description: product.description
  };
}

export default async function Page({ params }: PageProps) {
  const { productId } = await params;
  const product = getProductById(productId);
  if (!product) notFound();

  const brand = getBrandById(product.brandId);
  if (!brand) notFound();

  return (
    <ProductDetailView
      product={product}
      brand={brand}
      suppliers={getSuppliers({ productId: product.id })}
      alternatives={getAlternativeProducts(product.id)}
    />
  );
}
