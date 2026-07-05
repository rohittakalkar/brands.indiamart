'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useNavigationHistory } from './NavigationHistoryProvider';

interface BackButtonProps {
  /** Logical parent route to fall back to on a cold landing (no in-app history). */
  fallbackHref: string;
  title?: string;
  className?: string;
  /** Always navigate to fallbackHref (the page's canonical taxonomy parent) instead of
   * real router.back() — even when in-app history exists. Use this where a buyer's actual
   * path can skip a level in the Home > Category > Brand > Brand Model Line > Product
   * chain (search landing directly on a Product page is the one case this happens today),
   * so "back" always retraces the taxonomy rather than a real path that bypassed it. */
  alwaysCanonical?: boolean;
}

// Uses real router.back() (preserving native scroll-position restoration) whenever the
// buyer actually has in-app history to go back to; falls back to a fixed-parent Link only
// on a cold landing (search engine, direct link, new tab) where there's nothing to go
// back to in-app. Pass alwaysCanonical to skip the history check entirely.
export function BackButton({ fallbackHref, title, className = 'p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition', alwaysCanonical = false }: BackButtonProps) {
  const router = useRouter();
  const { hasHistory } = useNavigationHistory();
  // Every call site should really pass a specific title ("Back to Kirloskar Brothers
  // Limited"), but several don't — falling back to a generic label here means the control
  // always has a real accessible name for screen readers, never just an unlabeled icon.
  const accessibleLabel = title || 'Back';

  if (hasHistory && !alwaysCanonical) {
    return (
      <button type="button" onClick={() => router.back()} className={className} title={title} aria-label={accessibleLabel}>
        <ArrowLeft className="w-4 h-4 text-slate-800 dark:text-slate-200" />
      </button>
    );
  }

  return (
    <Link href={fallbackHref} className={className} title={title} aria-label={accessibleLabel}>
      <ArrowLeft className="w-4 h-4 text-slate-800 dark:text-slate-200" />
    </Link>
  );
}
