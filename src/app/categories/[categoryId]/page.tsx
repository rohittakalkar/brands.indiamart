import { notFound } from 'next/navigation';
import CategoryBrandsView from '@/components/CategoryBrandsView';
import { getMcatById, getPMcatById, getBrands, getProducts, getSuppliers, getBrandMCats } from '@/lib/data';

export default async function Page({ params }: { params: Promise<{ categoryId: string }> }) {
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
