import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryBrandsView from '@/components/CategoryBrandsView';
import { getMcatById, getPMcatById, getBrands, getProducts, getSuppliers, getBrandMCats } from '@/lib/data';

type PageProps = { params: Promise<{ categoryId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = getMcatById(categoryId);
  if (!category) return {};
  const brandCount = getBrands({ mcatId: category.id }).length;
  return {
    title: `${category.name} — Compare ${brandCount > 0 ? `${brandCount} Verified Brands` : 'Brands'} & Sellers | IndiaMART Brands`,
    description: `Compare ${category.name} brands, models, pricing and verified sellers on IndiaMART Brands.`
  };
}

export default async function Page({ params }: PageProps) {
  const { categoryId } = await params;

  const category = getMcatById(categoryId);
  if (!category) notFound();

  const pmcat = getPMcatById(category.pmcatId);
  const products = getProducts({ mcatId: category.id });
  const productIds = new Set(products.map(p => p.id));

  return (
    <CategoryBrandsView
      category={category}
      industryName={pmcat?.name || ''}
      brands={getBrands({ mcatId: category.id })}
      products={products}
      suppliers={getSuppliers().filter(s => s.productId && productIds.has(s.productId))}
      brandMCats={getBrandMCats({ mcatId: category.id })}
    />
  );
}
