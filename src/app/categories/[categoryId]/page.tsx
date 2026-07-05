import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryBrandsView from '@/components/CategoryBrandsView';
import { getMcatById, getPMcatById, getBrands, getProducts, getSuppliers, getBrandMCats } from '@/lib/data';

interface CategorySearchParams {
  // Written back to the URL by CategoryBrandsView itself whenever the buyer changes a
  // filter, so an in-progress filtered view stays a durable, shareable link — same
  // pattern as Compare's ?sellers=/?category= sync.
  brands?: string;
  spec?: string;
  price?: string;
  cert?: string;
}

type PageProps = { params: Promise<{ categoryId: string }>; searchParams: Promise<CategorySearchParams> };

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

export default async function Page({ params, searchParams }: PageProps) {
  const { categoryId } = await params;
  const { brands, spec, price, cert } = await searchParams;

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
      initialSelectedBrandIds={brands ? brands.split(',').filter(Boolean) : undefined}
      initialSpecValue={spec}
      initialPriceBucket={price !== undefined ? parseInt(price, 10) : undefined}
      initialCertification={cert}
    />
  );
}
