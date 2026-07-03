import { Metadata } from 'next';
import CategorySearchView from '@/components/CategorySearchView';
import { getMcats, getBrands, getProducts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Browse All Categories | IndiaMART Brands',
  description: 'Browse every branded and standard product category on IndiaMART Brands.'
};

export default function Page() {
  return (
    <CategorySearchView
      categories={getMcats()}
      brands={getBrands()}
      products={getProducts()}
    />
  );
}
