import { MCat } from '../types';

export type { MCat };
export type Category = MCat;

export async function getCategories(): Promise<MCat[]> {
  const res = await fetch('/api/categories');
  return res.json();
}
