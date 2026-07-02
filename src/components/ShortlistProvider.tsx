'use client';

import React, { createContext, useContext, useState } from 'react';

interface ShortlistContextValue {
  shortlistedBrands: string[];
  shortlistedProducts: string[];
  shortlistedCategories: string[];
  toggleShortlistBrand: (id: string) => void;
  toggleShortlistProduct: (id: string) => void;
  toggleShortlistCategory: (id: string) => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  // Prefilled with 1 item of each type to make the UI look rich and functional initially
  const [shortlistedBrands, setShortlistedBrands] = useState<string[]>(['kirloskar']);
  const [shortlistedProducts, setShortlistedProducts] = useState<string[]>(['voltas-water-cooler']);
  const [shortlistedCategories, setShortlistedCategories] = useState<string[]>(['machinery']);

  const toggleShortlistBrand = (id: string) => {
    setShortlistedBrands(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleShortlistProduct = (id: string) => {
    setShortlistedProducts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleShortlistCategory = (id: string) => {
    setShortlistedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <ShortlistContext.Provider value={{
      shortlistedBrands,
      shortlistedProducts,
      shortlistedCategories,
      toggleShortlistBrand,
      toggleShortlistProduct,
      toggleShortlistCategory
    }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error('useShortlist must be used within a ShortlistProvider');
  return ctx;
}
