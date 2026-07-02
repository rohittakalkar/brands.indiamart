import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductById } from '@/lib/data';

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = getProductById(productId);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
