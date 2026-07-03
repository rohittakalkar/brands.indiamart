import DiscoverView from '@/components/DiscoverView';
import { getBrands, getProducts, getMcats, getCategoryFomoSummaries, getCatalogStats } from '@/lib/data';

export default function Page() {
  return (
    <DiscoverView
      brands={getBrands()}
      products={getProducts()}
      categories={getMcats()}
      categoryFomo={getCategoryFomoSummaries()}
      catalogStats={getCatalogStats()}
    />
  );
}
