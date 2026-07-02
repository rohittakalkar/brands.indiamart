import CategorySearchView from '@/components/CategorySearchView';
import { getMcats, getBrands, getProducts } from '@/lib/data';

export default function Page() {
  return (
    <CategorySearchView
      categories={getMcats()}
      brands={getBrands()}
      products={getProducts()}
    />
  );
}
