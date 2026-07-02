import CompareView from '@/components/CompareView';
import { getSuppliers, getBrands } from '@/lib/data';

// NOTE: this route already accepts a `?brandId=` search param in its URL shape
// for future supplier-scoping (Phase 2), but scoping behavior is not implemented
// yet — CompareView always seeds from the full supplier list, matching current
// (pre-migration) behavior exactly.
export default function Page() {
  return (
    <CompareView
      suppliers={getSuppliers()}
      brands={getBrands()}
    />
  );
}
