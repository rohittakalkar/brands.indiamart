import { Product } from '../types';

// Shared RFQ requirement-text builder — walks the product's full specifications table
// (not a positional slice) so every "Get Quotes" entry point produces the same
// fully-specified requirement a supplier can quote against without follow-up questions.
// Deliberately has no 'server-only' import (unlike lib/data.ts) since it's called from
// client components (ProductDetailView, BrandMCatView) as well as server code.
export function buildRfqRequirement(product: Product): string {
  const specLines = Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join('; ');
  return `Interested in the ${product.name} (Model: ${product.modelNumber}). Key specifications: ${specLines}. Please share exact pricing and delivery timeline for the above.`;
}
