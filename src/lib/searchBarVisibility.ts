// Single source of truth for "should the floating MobileSearchBar be suppressed on this
// route" — MobileSearchBar (whether to render at all) and PageContentFrame (how much top
// clearance to reserve for it) used to each carry their own independent copy of this
// condition. They drifted out of sync at least once already (PageContentFrame kept
// reserving space on /products/* after MobileSearchBar was updated to hide there),
// leaving a blank gap where the reserved padding had nothing left to clear. One shared
// function can't drift from itself.
export function floatingSearchBarHidden(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/leads/success' ||
    pathname === '/search' ||
    pathname === '/categories' ||
    pathname.startsWith('/categories/') ||
    pathname.startsWith('/products/') ||
    pathname.startsWith('/brands/')
  );
}
