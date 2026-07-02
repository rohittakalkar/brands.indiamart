import { NextResponse } from 'next/server';
import { getMcats } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getMcats());
}
