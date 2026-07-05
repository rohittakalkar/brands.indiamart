// Shared price-string helpers — several views (Category filters, the Nearby Options
// engine) need to reduce a free-text "₹1,20,000 - ₹1,50,000" range down to a sortable
// number, or format one back for display.
export function leadingPrice(priceRange: string): number {
  const match = priceRange.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}
