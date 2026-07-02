import DirectoryView from '@/components/DirectoryView';
import { getBrands, getCategories } from '@/lib/data';

export default function Page() {
  return (
    <DirectoryView
      brands={getBrands()}
      categories={getCategories()}
    />
  );
}
