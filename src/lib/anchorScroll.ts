import type { MouseEvent } from 'react';

// A plain `<a href="#id">` left-click makes the browser push a *new* history entry per
// click — harmless for one jump, but a buyer tapping through several in-page nav pills
// stacks up that many entries, so the next several presses of the real back button just
// unwind those hash changes instead of leaving the page (it looks like "back is broken").
// history.replaceState swaps the current entry's hash instead of adding one, so the address
// bar still reflects the section in view (still shareable/bookmarkable) without touching
// browser history. Modifier/middle clicks are left alone so ctrl/cmd/middle-click-to-open-
// in-a-new-tab still works exactly like a normal link.
export function scrollToSection(e: MouseEvent<HTMLAnchorElement>, id: string) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}
