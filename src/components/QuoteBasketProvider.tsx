'use client';

import React, { createContext, useContext, useState } from 'react';

export interface BasketItem {
  id: string;
  productId?: string;
  productName: string;
  brandName?: string;
  quantity: string;
}

interface QuoteBasketContextValue {
  items: BasketItem[];
  addToBasket: (item: Omit<BasketItem, 'id'>) => void;
  removeFromBasket: (id: string) => void;
  updateQuantity: (id: string, quantity: string) => void;
  clearBasket: () => void;
}

const QuoteBasketContext = createContext<QuoteBasketContextValue | null>(null);

export function QuoteBasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  const addToBasket = (item: Omit<BasketItem, 'id'>) => {
    setItems(prev => {
      const existing = item.productId ? prev.find(i => i.productId === item.productId) : undefined;
      if (existing) return prev;
      return [...prev, { ...item, id: `${item.productId || item.productName}-${Date.now()}` }];
    });
  };

  const removeFromBasket = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearBasket = () => setItems([]);

  return (
    <QuoteBasketContext.Provider value={{ items, addToBasket, removeFromBasket, updateQuantity, clearBasket }}>
      {children}
    </QuoteBasketContext.Provider>
  );
}

export function useQuoteBasket() {
  const ctx = useContext(QuoteBasketContext);
  if (!ctx) throw new Error('useQuoteBasket must be used within a QuoteBasketProvider');
  return ctx;
}
