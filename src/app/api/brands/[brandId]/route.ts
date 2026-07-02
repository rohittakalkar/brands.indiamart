import { NextResponse } from 'next/server';
import { getBrandById } from '@/lib/data';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ brandId: string }> }
) {
  const { brandId } = await params;
  const brand = getBrandById(brandId);
  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  }
  return NextResponse.json(brand);
}
