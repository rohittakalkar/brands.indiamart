import React, { useState } from 'react';
import PhoneContainer from './components/PhoneContainer';
import DiscoverView from './components/DiscoverView';
import DirectoryView from './components/DirectoryView';
import AIAssistant from './components/AIAssistant';
import MarketplaceIntelligence from './components/MarketplaceIntelligence';
import BrandProfileView from './components/BrandProfileView';
import ProductDetailView from './components/ProductDetailView';
import CompareView from './components/CompareView';
import BuyLeadFormModal from './components/BuyLeadFormModal';
import SuccessView from './components/SuccessView';
import { Home, Search, Sparkles, LineChart, FileText, CheckCircle2, Clock, Eye, ChevronRight } from 'lucide-react';
import { Brand, Product, BuyLead } from './types';
import { PRODUCTS, BRANDS, CATEGORIES } from './data';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'directory' | 'ai' | 'pulse' | 'leads'>('home');
  
  // Detail views state
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCompareActive, setIsCompareActive] = useState(false);
  const [searchInitialCategory, setSearchInitialCategory] = useState<string>('all');
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

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

  // Auto fill inquiry triggered from AI assistant recommendations
  const handleAutoFillFromAI = (leadData: Partial<BuyLead>) => {
    setPrefilledLeadData(leadData);
    setIsBuyLeadModalOpen(true);
  };

  // Handle B2B Search submit trigger
  const handleB2BSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // Reset details first
    setSelectedBrand(null);
    setSelectedProduct(null);
    setIsCompareActive(false);

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
      setCurrentTab('directory');
      setSearchInitialCategory(matchedCategory.id);
      setSearchInitialQuery('');
      return;
    }

    // 5. Default: general search query in Directory view
    setCurrentTab('directory');
    setSearchInitialCategory('all');
    setSearchInitialQuery(query);
  };

  const handleSelectBrandId = (brandId: string) => {
    const brandObj = BRANDS.find(b => b.id === brandId);
    if (brandObj) {
      setSelectedBrand(brandObj);
      setSelectedProduct(null);
      setIsCompareActive(false);
    }
  };

  const handleSelectCategoryId = (catId: string) => {
    setSelectedBrand(null);
    setSelectedProduct(null);
    setIsCompareActive(false);
    setCurrentTab('directory');
    setSearchInitialCategory(catId);
    setSearchInitialQuery('');
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
            setIsCompareActive(false);
            setCurrentTab('leads');
          }}
        />
      );
    }

    // If an active compare board is open
    if (isCompareActive) {
      return (
        <CompareView 
          onBack={() => setIsCompareActive(false)} 
          onOpenBuyLeadForm={handleOpenBuyLeadForm}
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
          onCompareSuppliers={() => setIsCompareActive(true)}
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
            onOpenRFQForm={() => handleOpenBuyLeadForm({})}
            onSearch={handleB2BSearch}
          />
        );
      case 'directory':
        return (
          <DirectoryView 
            initialCategory={searchInitialCategory}
            initialSearchQuery={searchInitialQuery}
            onSelectBrand={(b) => setSelectedBrand(b)}
          />
        );
      case 'ai':
        return (
          <AIAssistant 
            onAutoFillLead={handleAutoFillFromAI}
            onSelectBrand={handleSelectBrandId}
            onSelectCategory={handleSelectCategoryId}
          />
        );
      case 'pulse':
        return <MarketplaceIntelligence />;
      case 'leads':
        return (
          <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden select-none">
            {/* Leads list header */}
            <div className="bg-white border-b border-slate-100 p-4 shrink-0">
              <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-600" />
                <span>My BuyLeads Tracker</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monitor quotation proposals from matching brands</span>
            </div>

            {/* List layout */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {createdLeads.length === 0 ? (
                <div className="bg-white border rounded-2xl p-8 text-center text-slate-400 text-xs">
                  No BuyLeads created yet. Try talking with the AI Assistant or visiting a product catalog to request quotes!
                </div>
              ) : (
                createdLeads.map((lead) => (
                  <div key={lead.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-red-600 font-bold uppercase tracking-widest">{lead.id}</span>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight mt-0.5">{lead.productName}</h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${
                        lead.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        lead.status === 'connected' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div><strong className="text-slate-800">Qty:</strong> {lead.quantity}</div>
                      <div className="mt-0.5"><strong className="text-slate-800">Deliv. Area:</strong> {lead.location}</div>
                      <p className="mt-1.5 text-[10px] italic font-normal text-slate-500 border-t border-slate-100/60 pt-1.5">"{lead.requirement}"</p>
                    </div>

                    <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
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

  return (
    <PhoneContainer>
      {/* Screen body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderScreenContent()}
      </div>

      {/* Floating Bottom Nav Bar */}
      {!showSuccessLead && (
        <nav className="h-[52px] bg-white border-t border-slate-150/80 grid grid-cols-5 select-none shrink-0 z-20">
          <button 
            onClick={() => {
              setCurrentTab('home');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setIsCompareActive(false);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition ${
              currentTab === 'home' && !selectedBrand && !selectedProduct && !isCompareActive 
                ? 'text-[#028384] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-4.5 h-4.5" />
            <span className="text-[8px] font-bold tracking-wide uppercase scale-90">Home</span>
          </button>

          <button 
            onClick={() => {
              setCurrentTab('directory');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setIsCompareActive(false);
              setSearchInitialCategory('all');
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition ${
              currentTab === 'directory' && !selectedBrand && !selectedProduct && !isCompareActive 
                ? 'text-[#028384] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search className="w-4.5 h-4.5" />
            <span className="text-[8px] font-bold tracking-wide uppercase scale-90">Directory</span>
          </button>

          <button 
            onClick={() => {
              setCurrentTab('ai');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setIsCompareActive(false);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition relative ${
              currentTab === 'ai' && !selectedBrand && !selectedProduct && !isCompareActive 
                ? 'text-[#028384] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-4.5 h-4.5 fill-amber-300/40 text-amber-500 animate-pulse" />
            <span className="text-[8px] font-bold tracking-wide uppercase scale-90">AI Smart</span>
          </button>

          <button 
            onClick={() => {
              setCurrentTab('pulse');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setIsCompareActive(false);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition ${
              currentTab === 'pulse' && !selectedBrand && !selectedProduct && !isCompareActive 
                ? 'text-[#028384] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LineChart className="w-4.5 h-4.5" />
            <span className="text-[8px] font-bold tracking-wide uppercase scale-90">Pulse</span>
          </button>

          <button 
            onClick={() => {
              setCurrentTab('leads');
              setSelectedBrand(null);
              setSelectedProduct(null);
              setIsCompareActive(false);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 transition relative ${
              currentTab === 'leads' && !selectedBrand && !selectedProduct && !isCompareActive 
                ? 'text-[#028384] font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            <span className="text-[8px] font-bold tracking-wide uppercase scale-90">My Leads</span>
            {createdLeads.length > 0 && (
              <span className="absolute top-1 right-3 bg-red-600 text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 ring-1 ring-white">
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
