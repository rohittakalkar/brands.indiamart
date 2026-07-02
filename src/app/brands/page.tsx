import DirectoryView from '@/components/DirectoryView';
import { getBrands, getMcats } from '@/lib/data';

export default function Page() {
  return (
    <DirectoryView
      brands={getBrands()}
      categories={getMcats()}
    />
  );
}
