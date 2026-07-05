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
}

// Uses real router.back() (preserving native scroll-position restoration) whenever the
// buyer actually has in-app history to go back to; falls back to a fixed-parent Link only
// on a cold landing (search engine, direct link, new tab) where there's nothing to go
// back to in-app.
export function BackButton({ fallbackHref, title, className = 'p-1.5 hover:bg-slate-100 rounded-full transition' }: BackButtonProps) {
  const router = useRouter();
  const { hasHistory } = useNavigationHistory();
  // Every call site should really pass a specific title ("Back to Kirloskar Brothers
  // Limited"), but several don't — falling back to a generic label here means the control
  // always has a real accessible name for screen readers, never just an unlabeled icon.
  const accessibleLabel = title || 'Back';

  if (hasHistory) {
    return (
      <button type="button" onClick={() => router.back()} className={className} title={title} aria-label={accessibleLabel}>
        <ArrowLeft className="w-4 h-4 text-slate-800" />
      </button>
    );
  }

  return (
    <Link href={fallbackHref} className={className} title={title} aria-label={accessibleLabel}>
      <ArrowLeft className="w-4 h-4 text-slate-800" />
    </Link>
  );
}
