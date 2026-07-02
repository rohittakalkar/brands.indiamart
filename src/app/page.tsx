import DiscoverView from '@/components/DiscoverView';
import { getBrands, getProducts, getCategories } from '@/lib/data';

export default function Page() {
  return (
    <DiscoverView
      brands={getBrands()}
      products={getProducts()}
      categories={getCategories()}
    />
  );
}
