import BuyerProfileView from '@/components/BuyerProfileView';
import { getBrands, getProducts } from '@/lib/data';

export default function Page() {
  return <BuyerProfileView brands={getBrands()} products={getProducts()} />;
}
