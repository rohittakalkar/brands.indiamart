import React, { useState } from 'react';
import PhoneContainer from './components/PhoneContainer';
import DiscoverView from './components/DiscoverView';
import DirectoryView from './components/DirectoryView';
import BrandProfileView from './components/BrandProfileView';
import ProductDetailView from './components/ProductDetailView';
import CompareView from './components/CompareView';
import CategorySearchView from './components/CategorySearchView';
import ShortlistedView from './components/ShortlistedView';
import BuyLeadFormModal from './components/BuyLeadFormModal';
import SuccessView from './components/SuccessView';
import { Home, Layers, GitCompare, Heart, FileText, Clock, Building2 } from 'lucide-react';
import { Brand, Product, BuyLead } from './types';
import { PRODUCTS, BRANDS, CATEGORIES } from './data';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'categories' | 'compare' | 'shortlisted' | 'brands' | 'leads'>('home');
  
  // Detail views state
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [directoryState, setDirectoryState] = useState<{ category: string; query: string } | null>(null);

  // Shortlisted tracking state (prefilled with 1 item of each type to make the UI look rich and functional initially)
  const [shortlistedBrands, setShortlistedBrands] = useState<string[]>(['kirloskar']);
  const [shortlistedProducts, setShortlistedProducts] = useState<string[]>(['voltas-water-cooler']);
  const [shortlistedCategories, setShortlistedCategories] = useState<string[]>(['machinery']);

  // Modal & Success States
  const [isBuyLeadModalOpen, setIsBuyLeadModalOpen] = useState(false);
  const [prefilledLeadData, setPrefilledLeadData] = useState<Partial<BuyLead> | null>(null);
  const [showSuccessLead, setShowSuccessLead] = useState<BuyLead | null>(null);

  // Dynamic user-authored RFQ/Leads list
  const [createdLeads, setCreatedLeads] = useState<BuyLead[]>([
    {
      id: 'BL98431057',
      productName: 'Kirloskar Monoblock Pump',
      brandName: 'Kirloskar Brothers Limited',
      quantity: '2 Pieces',
      location: 'Ahmedabad, Gujarat',
      requirement: 'Require high-durability cast iron monoblock pumps for light agricultural sprinkle loops.',
      timestamp: '2026-06-28T14:30:00Z',
      status: 'completed'
    },
    {
      id: 'BL84021793',
      productName: 'Crompton Induction Motor (5HP)',
      brandName: 'Crompton Greaves',
      quantity: '1 Piece',
      location: 'Pune, Maharashtra',
      requirement: 'Need an IE3 highly efficient motor for workshop drill assemblies.',
      timestamp: '2026-06-30T09:15:00Z',
      status: 'connected'
    }
  ]);

  // Shortlist Toggles
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

  // Open inquiry form
  const handleOpenBuyLeadForm = (data: Partial<any>) => {
    setPrefilledLeadData(data);
    setIsBuyLeadModalOpen(true);
  };

  // Submit inquiry form
  const handleBuyLeadSubmit = (formData: any) => {
    const newLead: BuyLead = {
      id: `BL${Math.floor(100000000 + Math.random() * 900000000)}`,
      productName: formData.productName,
      brandName: formData.brandName || undefined,
      quantity: formData.quantity,
      location: formData.location,
      requirement: formData.requirement,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setCreatedLeads(prev => [newLead, ...prev]);
    setShowSuccessLead(newLead);
  };

  // Handle B2B Search submit trigger
  const handleB2BSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // Reset details first
    setSelectedBrand(null);
    setSelectedProduct(null);
    setDirectoryState(null);

    // 1. Check for exact/partial Brand Match
    const matchedBrand = BRANDS.find(b => 
      b.name.toLowerCase().includes(q) || 
      b.id.toLowerCase() === q ||
      (b.logo && b.logo.toLowerCase() === q)
    );

    // 2. Check for Brand + Product combinations (e.g. "Kirloskar Pump" or "Siemens PLC")
    let combinedProductMatch: Product | null = null;
    let combinedBrandMatch: Brand | null = null;

    for (const brand of BRANDS) {
      const brandKeywords = [brand.id.toLowerCase(), brand.name.toLowerCase().split(' ')[0]];
      const matchesBrandKeyword = brandKeywords.some(keyword => q.includes(keyword));

      if (matchesBrandKeyword) {
        combinedBrandMatch = brand;
        // Search remaining part for product name/category/specs
        const words = q.split(' ').filter(w => !brandKeywords.some(bk => bk.includes(w) || w.includes(bk)));
        const remainingQuery = words.join(' ');
        if (remainingQuery.length > 1) {
          const matchedProd = PRODUCTS.find(p => 
            p.brandId === brand.id && 
            (p.name.toLowerCase().includes(remainingQuery) || 
             p.category.toLowerCase().includes(remainingQuery) || 
             p.description.toLowerCase().includes(remainingQuery))
          );
          if (matchedProd) {
            combinedProductMatch = matchedProd;
            break;
          }
        }
      }
    }

    if (combinedProductMatch) {
      setSelectedProduct(combinedProductMatch);
      return;
    }

    if (combinedBrandMatch && q.length < combinedBrandMatch.name.toLowerCase().split(' ')[0].length + 5) {
      setSelectedBrand(combinedBrandMatch);
      return;
    }

    if (matchedBrand) {
      setSelectedBrand(matchedBrand);
      return;
    }

    // 3. Check for specific standalone Product Name match
    const matchedProduct = PRODUCTS.find(p => 
      p.name.toLowerCase().includes(q) || 
      q.includes(p.name.toLowerCase())
    );
    if (matchedProduct) {
      setSelectedProduct(matchedProduct);
      return;
    }

    // 4. Check for standalone Category Match
    const matchedCategory = CATEGORIES.find(c => 
      c.name.toLowerCase().includes(q) || 
      q.includes(c.name.toLowerCase()) || 
      c.id.toLowerCase() === q
    );
    if (matchedCategory) {
      setDirectoryState({ category: matchedCategory.id, query: '' });
      return;
    }

    // 5. Default: general search query in Directory view
    setDirectoryState({ category: 'all', query: query });
  };

  const handleSelectBrandId = (brandId: string) => {
    const brandObj = BRANDS.find(b => b.id === brandId);
    if (brandObj) {
      setSelectedBrand(brandObj);
      setSelectedProduct(null);
      setDirectoryState(null);
    }
  };

  const handleSelectCategoryId = (catId: string) => {
    setSelectedBrand(null);
    setSelectedProduct(null);
    setDirectoryState({ category: catId, query: '' });
  };

  // Sub-navigation render routers
  const renderScreenContent = () => {
    // If the success overlay is active, show the confirmation view
    if (showSuccessLead) {
      return (
        <SuccessView 
          lead={showSuccessLead} 
          onBackToHome={() => {
            setShowSuccessLead(null);
            setSelectedBrand(null);
            setSelectedProduct(null);
            setDirectoryState(null);
            setCurrentTab('leads');
          }}
        />
      );
    }

    // If a product details sheet is selected
    if (selectedProduct) {
      return (
        <ProductDetailView 
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onOpenBuyLeadForm={handleOpenBuyLeadForm}
          onCompareSuppliers={() => {
            setCurrentTab('compare');
            setSelectedProduct(null);
          }}
          shortlistedProducts={shortlistedProducts}
          onToggleShortlistProduct={toggleShortlistProduct}
        />
      );
    }

    // If a brand profile hub is selected
    if (selectedBrand) {
      return (
        <BrandProfileView 
          brand={selectedBrand}
          onBack={() => setSelectedBrand(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenBuyLeadForm={handleOpenBuyLeadForm}
          shortlistedBrands={shortlistedBrands}
          onToggleShortlistBrand={toggleShortlistBrand}
        />
      );
    }

    // If a directory search overlay is active
    if (directoryState) {
      return (
        <DirectoryView 
          initialCategory={directoryState.category}
          initialSearchQuery={directoryState.query}
          onSelectBrand={(b) => setSelectedBrand(b)}
          onBack={() => setDirectoryState(null)}
        />
      );
    }

    // Tab Router switcher
    switch (currentTab) {
      case 'home':
        return (
          <DiscoverView 
            onSelectBrand={(b) => setSelectedBrand(b)}
            onSelectCategory={handleSelectCategoryId}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenRFQForm={() => handleOpenBuyLeadForm({})}
            onSearch={handleB2BSearch}
            shortlistedBrands={shortlistedBrands}
            shortlistedProducts={shortlistedProducts}
            shortlistedCategories={shortlistedCategories}
            onToggleShortlistBrand={toggleShortlistBrand}
            onToggleShortlistProduct={toggleShortlistProduct}
            onToggleShortlistCategory={toggleShortlistCategory}
          />
        );
      case 'categories':
        return (
          <CategorySearchView 
            onSelectCategory={handleSelectCategoryId}
            onOpenBuyLeadForm={handleOpenBuyLeadForm}
            shortlistedCategories={shortlistedCategories}
            onToggleShortlistCategory={toggleShortlistCategory}
          />
        );
      case 'compare':
        return (
          <CompareView 
            onBack={() => setCurrentTab('home')} 
            onOpenBuyLeadForm={handleOpenBuyLeadForm}
            onSelectBrand={handleSelectBrandId}
          />
        );
      case 'shortlisted':
        return (
          <ShortlistedView 
            shortlistedBrands={shortlistedBrands}
            shortlistedProducts={shortlistedProducts}
            shortlistedCategories={shortlistedCategories}
            onToggleShortlistBrand={toggleShortlistBrand}
            onToggleShortlistProduct={toggleShortlistProduct}
            onToggleShortlistCategory={toggleShortlistCategory}
            onSelectBrand={(b) => setSelectedBrand(b)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSelectCategory={handleSelectCategoryId}
            onOpenBuyLeadForm={handleOpenBuyLeadForm}
            onBrowseMore={() => setCurrentTab('categories')}
          />
        );
      case 'brands':
        return (
          <DirectoryView 
            onSelectBrand={(b) => setSelectedBrand(b)}
          />
        );
      case 'leads':
        return (
          <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden select-none">
            {/* Leads list header in IndiaMART style */}
            <div className="bg-white border-b border-slate-100 p-4 shrink-0">
              <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#028384]" />
                <span>My BuyLeads Tracker</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Monitor response quotations from verified manufacturers</span>
            </div>

            {/* List layout */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {createdLeads.length === 0 ? (
                <div className="bg-white border rounded-2xl p-8 text-center text-slate-400 text-xs shadow-xs">
                  No BuyLeads created yet. Send a custom inquiry to receive competitive price proposals.
                </div>
              ) : (
                createdLeads.map((lead) => (
                  <div key={lead.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-[#028384] font-black uppercase tracking-widest">{lead.id}</span>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight mt-0.5">{lead.productName}</h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-wider ${
                        lead.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        lead.status === 'connected' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {lead.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div><strong className="text-slate-800 font-bold">Qty Required:</strong> {lead.quantity}</div>
                      <div className="mt-0.5"><strong className="text-slate-800 font-bold">Delivery Location:</strong> {lead.location}</div>
                      <p className="mt-1.5 text-[10px] italic font-normal text-slate-500 border-t border-slate-150/60 pt-1.5">"{lead.requirement}"</p>
                    </div>

                    <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1 pt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Submitted on {new Date(lead.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Sum of shortlisted counts for tab badge
  const shortlistedTotalCount = shortlistedBrands.length + shortlistedProducts.length + shortlistedCategories.length;

  return (
    <PhoneContainer>
      {/* Screen body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderScreenContent()}
      </div>

      {/* Floating Bottom Nav Bar */}
      {!showSuccessLead && (
        <nav className="h-[52px] bg-white border-t border-slate-200 grid grid-cols-6 select-none shrink-0 z-20">
          
          {/* 1. Home */}
          <button 
            onClick={() => {
              setCurrentTab('home');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setDirectoryState(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition w-full ${
              currentTab === 'home' && !selectedBrand && !selectedProduct && !directoryState 
                ? 'text-[#028384] font-black' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[8px] font-black tracking-tighter uppercase">Home</span>
          </button>

          {/* 2. Categories */}
          <button 
            onClick={() => {
              setCurrentTab('categories');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setDirectoryState(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition w-full ${
              currentTab === 'categories' && !selectedBrand && !selectedProduct && !directoryState 
                ? 'text-[#028384] font-black' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[8px] font-black tracking-tighter uppercase">Categories</span>
          </button>

          {/* 3. Compare (PRIME FEATURE IN THE CENTER!) */}
          <div className="relative flex items-center justify-center -mt-3.5 w-full">
            <button 
              onClick={() => {
                setCurrentTab('compare');
                setSelectedBrand(null);
                setSelectedProduct(null);
                setDirectoryState(null);
              }}
              className={`flex flex-col items-center justify-center w-11 h-11 rounded-full border-2 transition shadow-md ${
                currentTab === 'compare' 
                  ? 'bg-[#2563eb] border-[#2563eb] text-white' 
                  : 'bg-[#3b82f6] border-[#3b82f6] text-white hover:bg-[#1d4ed8]'
              }`}
              title="Compare Industrial Suppliers side-by-side"
            >
              <GitCompare className="w-4.5 h-4.5 animate-bounce-slow" />
            </button>
            <span className="absolute bottom-[-13px] text-[8px] text-slate-500 font-extrabold tracking-tighter uppercase">Compare</span>
          </div>

          {/* 4. Shortlist */}
          <button 
            onClick={() => {
              setCurrentTab('shortlisted');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setDirectoryState(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
              currentTab === 'shortlisted' && !selectedBrand && !selectedProduct && !directoryState 
                ? 'text-[#028384] font-black' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${currentTab === 'shortlisted' ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="text-[8px] font-black tracking-tighter uppercase">Shortlist</span>
            {shortlistedTotalCount > 0 && (
              <span className="absolute top-1 right-1.5 bg-[#2563eb] text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 ring-1 ring-white">
                {shortlistedTotalCount}
              </span>
            )}
          </button>

          {/* 5. Brands */}
          <button 
            onClick={() => {
              setCurrentTab('brands');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setDirectoryState(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
              currentTab === 'brands' && !selectedBrand && !selectedProduct && !directoryState 
                ? 'text-[#028384] font-black' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-[8px] font-black tracking-tighter uppercase">Brands</span>
          </button>

          {/* 6. Leads */}
          <button 
            onClick={() => {
              setCurrentTab('leads');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setDirectoryState(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
              currentTab === 'leads' && !selectedBrand && !selectedProduct && !directoryState 
                ? 'text-[#028384] font-black' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[8px] font-black tracking-tighter uppercase">Leads</span>
            {createdLeads.length > 0 && (
              <span className="absolute top-1 right-2 bg-slate-400 text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 ring-1 ring-white">
                {createdLeads.length}
              </span>
            )}
          </button>
        </nav>
      )}

      {/* Pop-up BuyLead Inquiry Form Modal */}
      <BuyLeadFormModal 
        isOpen={isBuyLeadModalOpen}
        onClose={() => setIsBuyLeadModalOpen(false)}
        onSubmit={handleBuyLeadSubmit}
        initialData={prefilledLeadData || undefined}
      />
    </PhoneContainer>
  );
}
