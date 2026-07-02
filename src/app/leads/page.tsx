import LeadsTrackerView from '@/components/LeadsTrackerView';
import { getLeads } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <LeadsTrackerView leads={getLeads()} />;
}
