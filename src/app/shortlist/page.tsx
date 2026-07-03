import { Metadata } from 'next';
import ShortlistedView from '@/components/ShortlistedView';
import { getProducts, getBrands, getMcats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'My Shortlist | IndiaMART Brands'
};

export default function Page() {
  return (
    <ShortlistedView
      products={getProducts()}
      brands={getBrands()}
      categories={getMcats()}
    />
  );
}
