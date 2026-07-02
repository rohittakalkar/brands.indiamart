import { Product } from '../types';

export async function getProducts(filter?: { mcatId?: string; brandId?: string }): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filter?.mcatId) params.set('mcatId', filter.mcatId);
  if (filter?.brandId) params.set('brandId', filter.brandId);
  const qs = params.toString();
  const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`);
  return res.json();
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}
