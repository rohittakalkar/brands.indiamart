import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLead } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getLeads());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.productName || !body.quantity || !body.location || !body.requirement) {
    return NextResponse.json({ error: 'productName, quantity, location, and requirement are required.' }, { status: 400 });
  }
  const lead = addLead({
    productName: body.productName,
    brandName: body.brandName,
    quantity: body.quantity,
    location: body.location,
    requirement: body.requirement
  });
  return NextResponse.json(lead, { status: 201 });
}
