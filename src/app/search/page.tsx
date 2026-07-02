import { redirect } from 'next/navigation';
import SearchResultsView from '@/components/SearchResultsView';
import { resolveSearch, getGroupedSearchResults } from '@/lib/search';

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;

  if (!q.trim()) {
    redirect('/');
  }

  const resolution = resolveSearch(q);

  if (resolution.type === 'product') {
    redirect(`/products/${resolution.product.id}`);
  }
  if (resolution.type === 'brand') {
    redirect(`/brands/${resolution.brand.id}`);
  }
  if (resolution.type === 'category') {
    redirect(`/categories/${resolution.categoryId}`);
  }

  // Fallback: no single confident match — show grouped results
  const results = getGroupedSearchResults(resolution.query);

  return (
    <SearchResultsView
      query={resolution.query}
      products={results.products}
      brands={results.brands}
      categories={results.categories}
      brandMCats={results.brandMCats}
    />
  );
}
