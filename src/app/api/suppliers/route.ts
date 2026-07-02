import { NextRequest, NextResponse } from 'next/server';
import { getSuppliers } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get('brandId') || undefined;
  return NextResponse.json(getSuppliers({ brandId }));
}
