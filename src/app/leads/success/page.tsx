import { redirect } from 'next/navigation';
import SuccessView from '@/components/SuccessView';
import { BuyLead } from '@/types';

interface SuccessSearchParams {
  id?: string;
  productName?: string;
  brandName?: string;
  quantity?: string;
  location?: string;
  requirement?: string;
  timestamp?: string;
  status?: string;
}

export default async function Page({ searchParams }: { searchParams: Promise<SuccessSearchParams> }) {
  const params = await searchParams;

  if (!params.id || !params.productName) {
    redirect('/leads');
  }

  const lead: BuyLead = {
    id: params.id,
    productName: params.productName,
    brandName: params.brandName || undefined,
    quantity: params.quantity || '',
    location: params.location || '',
    requirement: params.requirement || '',
    timestamp: params.timestamp || new Date().toISOString(),
    status: (params.status as BuyLead['status']) || 'pending'
  };

  return <SuccessView lead={lead} />;
}
