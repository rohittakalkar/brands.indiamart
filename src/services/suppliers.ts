import { Supplier } from '../types';

export async function getSuppliers(filter?: { brandId?: string }): Promise<Supplier[]> {
  const params = new URLSearchParams();
  if (filter?.brandId) params.set('brandId', filter.brandId);
  const qs = params.toString();
  const res = await fetch(`/api/suppliers${qs ? `?${qs}` : ''}`);
  return res.json();
}
