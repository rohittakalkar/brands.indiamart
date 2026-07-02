import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductById, getBrandById, getSuppliers, getAlternativeProducts } from '@/lib/data';

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
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
