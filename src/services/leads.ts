import { BuyLead } from '../types';

export async function getLeads(): Promise<BuyLead[]> {
  const res = await fetch('/api/leads');
  return res.json();
}

export async function submitLead(data: Omit<BuyLead, 'id' | 'timestamp' | 'status'>): Promise<BuyLead> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit requirement.');
  }
  return res.json();
}
