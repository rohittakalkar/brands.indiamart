import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductById, getBrandById, getSuppliers, getAlternativeProducts, getMcatById, getBrandMCatById, getProducts } from '@/lib/data';

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

  const category = getMcatById(product.mcatId);
  // Powers the "Brand MCat" (model-line) rung in the PDP breadcrumb — Home > Category >
  // Brand > Brand MCat > this product — so the full path is always present and clickable
  // no matter how the buyer actually arrived here (search, deep link, shared link).
  const brandMCat = product.brandMCatId ? getBrandMCatById(product.brandMCatId) : undefined;

  // Sibling models in the same Brand-MCat line — powers the Nearby Options engine
  // (adjacent higher/lower-capacity model within this line), distinct from
  // getAlternativeProducts() which is cross-brand.
  const lineSiblings = product.brandMCatId ? getProducts({ brandMCatId: product.brandMCatId }) : [];

  return (
    <ProductDetailView
      product={product}
      brand={brand}
      category={category}
      brandMCat={brandMCat}
      suppliers={getSuppliers({ productId: product.id })}
      alternatives={getAlternativeProducts(product.id)}
      lineSiblings={lineSiblings}
    />
  );
}
