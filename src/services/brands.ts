import { Brand } from '../types';

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch('/api/brands');
  return res.json();
}

export async function getBrand(id: string): Promise<Brand | null> {
  const res = await fetch(`/api/brands/${id}`);
  if (!res.ok) return null;
  return res.json();
}
