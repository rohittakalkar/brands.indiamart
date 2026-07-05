import React from 'react';

export type IconAnimation = 'flicker' | 'tick' | 'bounce' | 'flip' | 'pulse' | 'breathe';

const VARIANT_CLASS: Record<IconAnimation, string> = {
  flicker: 'icon-anim-flicker',
  tick: 'icon-anim-tick',
  bounce: 'icon-anim-bounce',
  flip: 'icon-anim-flip',
  pulse: 'icon-anim-pulse',
  breathe: 'icon-anim-breathe'
};

interface AnimatedIconProps {
  icon: React.ElementType;
  /** Semantic motion picked per icon meaning (flame flickers, clock ticks, trend bounces
   * up, a book flips its page) — not one generic effect reused everywhere regardless of
   * what the icon actually depicts. Defaults to a neutral "breathe" for anything else. */
  variant?: IconAnimation;
  className?: string;
}

// A CSS-keyframe substitute for the GIF icons originally requested — no real .gif assets
// exist in this project and none should be fetched from an unverified external source, so
// this gets the same "small, continuously-animated icon" effect with an inline, themeable,
// zero-asset alternative. Respects prefers-reduced-motion globally (see index.css).
export function AnimatedIcon({ icon: Icon, variant = 'breathe', className = 'w-4 h-4' }: AnimatedIconProps) {
  return (
    <span className={`inline-flex ${VARIANT_CLASS[variant]}`}>
      <Icon className={className} />
    </span>
  );
}
