import DirectoryView from '@/components/DirectoryView';
import { getBrands, getCategories } from '@/lib/data';

export default async function Page({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;

  return (
    <DirectoryView
      brands={getBrands()}
      categories={getCategories()}
      showBack
      initialCategory={categoryId}
      initialSearchQuery=""
    />
  );
}
