import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SearchExperienceView from '@/components/SearchExperienceView';
import { resolveSearch } from '@/lib/search';
import { getBrands, getProducts, getMcats, getBrandMCats } from '@/lib/data';

type PageProps = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q = '' } = await searchParams;
  return { title: q.trim() ? `"${q.trim()}" — Search | IndiaMART Brands` : 'Search | IndiaMART Brands' };
}

export default async function Page({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const trimmed = q.trim();

  if (trimmed) {
    const resolution = resolveSearch(trimmed);
    if (resolution.type === 'product') redirect(`/products/${resolution.product.id}`);
    if (resolution.type === 'brand') redirect(`/brands/${resolution.brand.id}`);
    if (resolution.type === 'category') redirect(`/categories/${resolution.categoryId}`);
    // resolution.type === 'fallback' falls through to the interactive experience below,
    // prefilled with the query, instead of a one-shot grouped-results page.
  }

  // No query, or an unresolved/ambiguous one — a dedicated search screen (recently viewed +
  // recommendations when empty, live suggestions once typing resumes) rather than
  // redirecting Home or rendering a static results list.
  return (
    <SearchExperienceView
      initialQuery={trimmed}
      brands={getBrands()}
      products={getProducts()}
      categories={getMcats()}
      brandMCats={getBrandMCats()}
    />
  );
}
