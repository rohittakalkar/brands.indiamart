export interface Category {
  id: string;
  name: string;
  icon: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  return res.json();
}
