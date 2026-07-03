'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Clock, Star, ThumbsUp, Send, X, Plus, Search, Sparkles, GitCompare, Copy } from 'lucide-react';
import { Supplier, Product } from '../types';
import { Category } from '../services/categories';
import { CategoryIcon } from './CategoryIcon';
import { TrustBadge } from './TrustBadge';
import { ConnectButton } from './ConnectButton';
import { useBuyLeadModal } from './BuyLeadModalProvider';

interface CompareViewProps {
  suppliers: Supplier[];
  allSuppliers: Supplier[];
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  brandName?: string;
}

export default function CompareView({ suppliers, allSuppliers, products, categories, initialCategory, brandName = 'Compare Sellers' }: CompareViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  // Use state for compared suppliers, initialized with preset suppliers
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>(suppliers);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(initialCategory);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const productsById = new Map(products.map(p => [p.id, p]));

  // The category every currently-compared seller's product belongs to — comparison is always
  // scoped to one category at a time so we only ever compare equivalent products, never
  // unrelated brands (e.g. a diesel generator dealer next to a power tools dealer).
  const comparisonCategory = activeCategory
    ?? (selectedSuppliers[0]?.productId ? productsById.get(selectedSuppliers[0].productId)?.mcatId : undefined);

  // Keeps the URL a live, literal snapshot of the current comparison (category + exact
  // sellers) so any customization the buyer makes — adding a seller, switching category —
  // stays shareable, not just the original ?productId=/?brandId= scope from the entry link.
  useEffect(() => {
    const params = new URLSearchParams();
    if (comparisonCategory) params.set('category', comparisonCategory);
    if (selectedSuppliers.length > 0) params.set('sellers', selectedSuppliers.map(s => s.id).join(','));
    const qs = params.toString();
    router.replace(qs ? `/compare?${qs}` : '/compare', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSuppliers, comparisonCategory]);

  const [linkCopied, setLinkCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => {});
  };

  const handleRemoveSupplier = (id: string) => {
    setSelectedSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleAddSupplier = (supplier: Supplier) => {
    // Check if this brand is already represented (keeps columns to one seller per brand)
    if (selectedSuppliers.some(s => s.brandId === supplier.brandId)) return;
    setSelectedSuppliers(prev => [...prev, supplier]);
    setIsAddOpen(false);
    setSearchQuery('');
  };

  const handleCompareQuotes = () => {
    if (selectedSuppliers.length === 0) return;

    const names = selectedSuppliers.map(s => s.brandName).join(' & ');
    openBuyLeadForm({
      productName: 'OEM Supply Contract - Direct Quote Request',
      brandName: names,
      requirement: `Please provide competitive quotation with catalogs and pricing sheets for side-by-side compared suppliers: ${names}.`
    });
  };

  // Dynamic statistics for comparison summary
  const getComparisonStats = () => {
    if (selectedSuppliers.length === 0) return null;

    // Sort suppliers by rating
    const sortedByRating = [...selectedSuppliers].sort((a, b) => b.rating - a.rating);
    // Find fastest response
    const sortedByResponse = [...selectedSuppliers].sort((a, b) => {
      const aVal = parseFloat(a.responseTime) || 99;
      const bVal = parseFloat(b.responseTime) || 99;
      return aVal - bVal;
    });
    // Find most experienced
    const sortedByExperience = [...selectedSuppliers].sort((a, b) => b.experienceYears - a.experienceYears);

    return {
      bestRated: sortedByRating[0],
      fastest: sortedByResponse[0],
      mostExperienced: sortedByExperience[0],
      averageRating: (selectedSuppliers.reduce((sum, s) => sum + s.rating, 0) / selectedSuppliers.length).toFixed(1)
    };
  };

  const stats = getComparisonStats();

  // Candidate sellers to add: real suppliers of an equivalent product in the same category,
  // excluding brands already represented — never an arbitrary unrelated brand.
  const filteredCandidates = allSuppliers.filter(supplier => {
    if (!supplier.productId) return false;
    const product = productsById.get(supplier.productId);
    if (!product || (comparisonCategory && product.mcatId !== comparisonCategory)) return false;
    if (selectedSuppliers.some(s => s.brandId === supplier.brandId)) return false;
    const q = searchQuery.toLowerCase();
    return !q ||
      supplier.brandName.toLowerCase().includes(q) ||
      supplier.name.toLowerCase().includes(q) ||
      product.name.toLowerCase().includes(q);
  });

  // Resolve compared suppliers to their exact linked products (for spec comparison)
  const comparedProducts = selectedSuppliers
    .map(supp => ({ supplier: supp, product: supp.productId ? products.find(p => p.id === supp.productId) : undefined }))
    .filter((entry): entry is { supplier: Supplier; product: Product } => !!entry.product);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft className="w-4 h-4 text-slate-800" />
          </button>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Compare Suppliers ({selectedSuppliers.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{brandName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {selectedSuppliers.length > 0 && (
            <button
              onClick={handleCopyLink}
              title="Copy a shareable link to this exact comparison"
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-line text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{linkCopied ? 'Copied!' : 'Share'}</span>
            </button>
          )}
          {selectedSuppliers.length < 5 && comparisonCategory && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-accent-blue/10 hover:bg-accent-blue/15 border border-accent-blue/20 text-accent-blue text-[10px] font-black uppercase tracking-wider rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Seller</span>
            </button>
          )}
        </div>
      </div>

      {/* Main body scrollable list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro */}
        <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-accent-blue font-bold text-xs">
            <ThumbsUp className="w-4 h-4 text-accent-blue" />
            <span>Smart Side-by-Side Comparison</span>
          </div>
          <p className="text-[10px] text-accent-blue leading-relaxed font-medium">
            Evaluate response times, delivery capabilities, and reviews to find the best fit before connecting. Scroll horizontally to view more brands.
          </p>
        </div>

        {!comparisonCategory ? (
          /* No category scoped yet — never mash unrelated brands together, ask the buyer to pick one */
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-xs">Pick a category to start comparing</h3>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Choose a product category — we'll show you real sellers of equivalent products so every comparison stays apples-to-apples.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className="flex items-center gap-2 p-2.5 bg-canvas hover:bg-accent-blue/10 border border-line hover:border-accent-blue/30 rounded-xl transition text-left"
                >
                  <div className="w-7 h-7 bg-white rounded-lg border border-line flex items-center justify-center text-accent-blue shrink-0">
                    <CategoryIcon icon={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700 leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
        <>
        {/* Side by side columns - Horizontally scrollable to avoid column squeeze */}
        <div className="overflow-x-auto pb-3 -mx-4 px-4 scrollbar-thin flex gap-3 select-none">
          {selectedSuppliers.map((supp, sIdx) => (
            <div
              key={supp.id}
              className="w-[145px] bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs shrink-0 relative hover:border-accent-blue/40 transition duration-200"
            >
              {/* Delete button */}
              <button
                onClick={() => handleRemoveSupplier(supp.id)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full text-slate-300 hover:text-rose-500 hover:bg-slate-100 transition z-10"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-2">
                {/* Header Logo Name */}
                <div className="text-center pb-2 border-b border-slate-100 pt-1.5">
                  <div className={`w-9 h-9 mx-auto rounded-full font-extrabold text-[10px] flex items-center justify-center ${
                    sIdx % 3 === 0 ? 'bg-accent-blue/10 text-accent-blue' :
                    sIdx % 3 === 1 ? 'bg-amber-50 text-amber-600' :
                    'bg-indigo-50 text-indigo-600'
                  }`}>
                    {supp.brandName.substring(0, 3).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-[9px] text-slate-900 mt-1.5 line-clamp-2 leading-tight min-h-[24px]">
                    {supp.name}
                  </h3>
                </div>

                {/* Rating Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Rating</span>
                  <div className="flex items-center justify-center gap-0.5 text-[10px] font-extrabold text-slate-900 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{supp.rating}</span>
                    <span className="text-[8px] text-slate-400 font-normal">({supp.reviewsCount})</span>
                  </div>
                </div>

                {/* Experience Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Experience</span>
                  <div className="text-[10px] font-extrabold text-slate-900 mt-0.5">
                    {supp.experienceYears} Years
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="text-center py-1.5 bg-slate-50 rounded-lg space-y-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Trust</span>
                  <div className="flex flex-col items-center gap-1">
                    {supp.verified ? (
                      <TrustBadge type="verified-supplier" who="IndiaMART" className="!px-1.5 !py-0 !text-[7.5px]" />
                    ) : (
                      <span className="text-[8px] text-slate-400">Standard</span>
                    )}
                    {supp.isAuthorizedDealer && (
                      <TrustBadge type="authorized-dealer" who={supp.brandName} since={supp.authorizedSince} className="!px-1.5 !py-0 !text-[7.5px]" />
                    )}
                  </div>
                </div>

                {/* Response Time */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Resp. Time</span>
                  <div className="text-[10px] font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <span>{supp.responseTime}</span>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Delivery</span>
                  <div className="text-[9px] font-extrabold text-slate-900 mt-0.5">
                    {supp.deliveryTimeRange}
                  </div>
                </div>

                {/* Contact */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Contact</span>
                  <ConnectButton supplierId={supp.id} brandName={supp.brandName} compact className="text-center" />
                </div>
              </div>

              {/* View Profile Action */}
              <div className="pt-2 border-t border-slate-100 mt-2.5 text-center">
                <Link
                  href={`/brands/${supp.brandId}`}
                  className="text-[9px] font-extrabold text-accent-blue hover:underline cursor-pointer"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}

          {/* Inline Add Seller Card at the end of scrollable list */}
          {selectedSuppliers.length < 5 && (
            <motion.button
              onClick={() => setIsAddOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={selectedSuppliers.length < 2 ? { y: [0, -4, 0] } : {}}
              transition={selectedSuppliers.length < 2 ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
              className="w-[145px] min-h-[340px] bg-white border-2 border-dashed border-slate-200 hover:border-accent-blue/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group transition-colors text-center shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-accent-blue group-hover:border-accent-blue/30 group-hover:bg-accent-blue/5 transition">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-accent-blue transition">Add Seller</span>
            </motion.button>
          )}
        </div>

        {/* Dynamic comparison summary card */}
        {selectedSuppliers.length > 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent-blue" />
              <span>Smart Comparison Insights</span>
            </h3>

            <div className="space-y-2.5 text-[11px] text-slate-600 font-medium">
              <div className="flex items-start gap-2 text-slate-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{stats?.bestRated.name}</strong> has the highest rating of{' '}
                  <strong className="text-slate-900">{stats?.bestRated.rating} ★</strong> ({stats?.bestRated.reviewsCount} verified buyers).
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{stats?.fastest.name}</strong> responds quickest in{' '}
                  <strong className="text-accent-blue font-bold">{stats?.fastest.responseTime}</strong>, compared to the group average.
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{stats?.mostExperienced.name}</strong> offers the longest industry tenure of{' '}
                  <strong className="text-slate-900">{stats?.mostExperienced.experienceYears} Years</strong>.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs shadow-xs italic">
            Add sellers above to compare them side-by-side
          </div>
        )}

        {/* Specifications Comparison — only when compared suppliers map to exact products */}
        {comparedProducts.length > 1 && (
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-accent-blue" />
              <h3 className="font-extrabold text-slate-950 text-xs">Specifications Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse min-w-[420px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-slate-100">Product</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-slate-100">Key Spec</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-slate-100">Price Range</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-slate-100">Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {comparedProducts.map(({ supplier, product }, idx) => (
                    <tr key={supplier.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-3 py-2.5 font-bold text-primary border-b border-slate-100 whitespace-nowrap">
                        <Link href={`/products/${product.id}`} className="hover:text-accent-blue">{product.brandName.split(' ')[0]} {product.modelNumber}</Link>
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 border-b border-slate-100 whitespace-nowrap">{product.keySpecLabel}: {product.keySpecValue}</td>
                      <td className="px-3 py-2.5 text-slate-700 border-b border-slate-100 whitespace-nowrap">{product.priceRange}</td>
                      <td className="px-3 py-2.5 text-slate-700 border-b border-slate-100 whitespace-nowrap">{product.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </>
        )}
      </div>

      {/* Persistent Compare CTA */}
      <div className="border-t border-slate-100 p-4 bg-white shrink-0 z-10">
        <motion.button
          disabled={selectedSuppliers.length === 0}
          onClick={handleCompareQuotes}
          whileHover={selectedSuppliers.length > 0 ? { scale: 1.015 } : undefined}
          whileTap={selectedSuppliers.length > 0 ? { scale: 0.98 } : undefined}
          animate={selectedSuppliers.length >= 2 ? {
            boxShadow: [
              '0 0 0 0 rgba(255,106,26,0.4)',
              '0 0 0 7px rgba(255,106,26,0)',
              '0 0 0 0 rgba(255,106,26,0.4)'
            ]
          } : {}}
          transition={selectedSuppliers.length >= 2 ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
          className="w-full bg-cta hover:bg-cta-hover disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Get Quotes From All Sellers</span>
        </motion.button>
      </div>

      {/* Add Seller Bottom Sheet Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end z-30 transition duration-300">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsAddOpen(false)} />

          <div className="bg-white rounded-t-3xl max-h-[80%] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="font-extrabold text-xs text-slate-900">Add a Seller to Compare</h3>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Equivalent products, same category only</span>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 bg-white shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by brand, seller or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 focus:bg-white text-[11px] font-semibold text-slate-800 rounded-xl outline-none border border-transparent focus:border-accent-blue/30 transition"
                />
              </div>
            </div>

            {/* Seller Options List */}
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50 space-y-1">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-[10.5px] font-bold italic">
                  No matching sellers found in this category
                </div>
              ) : (
                filteredCandidates.map((supplier) => {
                  const product = supplier.productId ? productsById.get(supplier.productId) : undefined;
                  return (
                    <button
                      key={supplier.id}
                      onClick={() => handleAddSupplier(supplier)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border bg-white border-slate-200/60 hover:border-accent-blue/30 hover:bg-accent-blue/10 text-slate-800 cursor-pointer transition text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 bg-white rounded-lg border border-slate-150 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                          {product ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-[8px] font-bold text-slate-400">
                              {supplier.brandName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-[10.5px] text-slate-900 leading-tight truncate">{supplier.brandName}</h4>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider truncate block">{product?.modelNumber || supplier.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-bold text-slate-500">
                          {supplier.rating} ★
                        </span>
                        <div className="w-5 h-5 rounded-full bg-slate-100 hover:bg-accent-blue/10 hover:text-accent-blue flex items-center justify-center text-slate-400 transition">
                          <Plus className="w-3 h-3" />
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
