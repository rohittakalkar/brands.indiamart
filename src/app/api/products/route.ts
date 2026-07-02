import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const brandId = searchParams.get('brandId') || undefined;
  return NextResponse.json(getProducts({ category, brandId }));
}
