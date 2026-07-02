import { redirect } from 'next/navigation';
import DirectoryView from '@/components/DirectoryView';
import { resolveSearch } from '@/lib/search';
import { getBrands, getCategories } from '@/lib/data';

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

  // Fallback: general search query in Directory view
  return (
    <DirectoryView
      brands={getBrands()}
      categories={getCategories()}
      showBack
      initialCategory="all"
      initialSearchQuery={resolution.query}
    />
  );
}
