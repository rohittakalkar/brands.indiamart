import ShortlistedView from '@/components/ShortlistedView';
import { getProducts, getBrands, getCategories } from '@/lib/data';

export default function Page() {
  return (
    <ShortlistedView
      products={getProducts()}
      brands={getBrands()}
      categories={getCategories()}
    />
  );
}
