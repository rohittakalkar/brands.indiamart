import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mcatId = searchParams.get('mcatId') || undefined;
  const brandId = searchParams.get('brandId') || undefined;
  return NextResponse.json(getProducts({ mcatId, brandId }));
}
