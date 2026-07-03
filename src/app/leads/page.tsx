import { Metadata } from 'next';
import LeadsTrackerView from '@/components/LeadsTrackerView';
import { getLeads } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Quote Requests | IndiaMART Brands'
};

export default function Page() {
  return <LeadsTrackerView leads={getLeads()} />;
}
