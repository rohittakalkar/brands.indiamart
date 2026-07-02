'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BuyLeadFormModal from './BuyLeadFormModal';
import { BuyLead } from '../types';
import { submitLead, getLeads } from '../services/leads';

interface BuyLeadModalContextValue {
  open: (data: Partial<Omit<BuyLead, 'id' | 'timestamp' | 'status'>>) => void;
  close: () => void;
  leadsCount: number;
}

const BuyLeadModalContext = createContext<BuyLeadModalContextValue | null>(null);

export function BuyLeadModalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledData, setPrefilledData] = useState<Partial<Omit<BuyLead, 'id' | 'timestamp' | 'status'>> | undefined>(undefined);
  const [leadsCount, setLeadsCount] = useState(0);

  useEffect(() => {
    getLeads().then(leads => setLeadsCount(leads.length)).catch(() => {});
  }, []);

  const open = (data: Partial<Omit<BuyLead, 'id' | 'timestamp' | 'status'>>) => {
    setPrefilledData(data);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleSubmit = async (formData: Omit<BuyLead, 'id' | 'timestamp' | 'status'>) => {
    const lead = await submitLead(formData);
    setLeadsCount(prev => prev + 1);
    const params = new URLSearchParams({
      id: lead.id,
      productName: lead.productName,
      brandName: lead.brandName || '',
      quantity: lead.quantity,
      location: lead.location,
      requirement: lead.requirement,
      timestamp: lead.timestamp,
      status: lead.status
    });
    router.push(`/leads/success?${params.toString()}`);
  };

  return (
    <BuyLeadModalContext.Provider value={{ open, close, leadsCount }}>
      {children}
      <BuyLeadFormModal
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleSubmit}
        initialData={prefilledData}
      />
    </BuyLeadModalContext.Provider>
  );
}

export function useBuyLeadModal() {
  const ctx = useContext(BuyLeadModalContext);
  if (!ctx) throw new Error('useBuyLeadModal must be used within a BuyLeadModalProvider');
  return ctx;
}
