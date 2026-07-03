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
  // Starts genuinely empty — a buyer returning after a session boundary (this state is
  // client-memory-only, not persisted) should see an honest empty state, not plausible-
  // looking data that isn't actually theirs.
  const [shortlistedBrands, setShortlistedBrands] = useState<string[]>([]);
  const [shortlistedProducts, setShortlistedProducts] = useState<string[]>([]);
  const [shortlistedCategories, setShortlistedCategories] = useState<string[]>([]);

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
