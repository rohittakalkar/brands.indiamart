import { Metadata } from 'next';
import DirectoryView from '@/components/DirectoryView';
import { getBrands, getMcats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'All Brands — Verified Manufacturers | IndiaMART Brands',
  description: 'Browse every verified manufacturer brand available on IndiaMART Brands.'
};

export default function Page() {
  return (
    <DirectoryView
      brands={getBrands()}
      categories={getMcats()}
    />
  );
}
