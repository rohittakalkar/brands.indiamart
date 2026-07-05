'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbSegment {
  label: string;
  /** Omit for the current page (rendered as plain text, not a link). */
  href?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

// Small and muted by design — states the hierarchy above the page, never competes with
// the page's own back button/title. A single horizontally-scrollable row rather than
// wrapping, so a deep trail never costs vertical space on a narrow screen.
export function Breadcrumb({ segments, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider overflow-x-auto scrollbar-none whitespace-nowrap ${className}`}
    >
      <Link href="/" className="flex items-center shrink-0 hover:text-accent-blue" title="Home">
        <Home className="w-3 h-3" />
      </Link>
      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        return (
          <Fragment key={idx}>
            <ChevronRight className="w-2.5 h-2.5 shrink-0" />
            {seg.href && !isLast ? (
              <Link href={seg.href} className="shrink-0 hover:text-accent-blue">{seg.label}</Link>
            ) : (
              <span className="shrink-0 text-slate-600 dark:text-slate-400 normal-case truncate max-w-[140px]">{seg.label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
