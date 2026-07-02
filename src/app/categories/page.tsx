import CategorySearchView from '@/components/CategorySearchView';
import { getCategories, getBrands, getProducts } from '@/lib/data';

export default function Page() {
  return (
    <CategorySearchView
      categories={getCategories()}
      brands={getBrands()}
      products={getProducts()}
    />
  );
}
