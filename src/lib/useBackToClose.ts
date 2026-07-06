'use client';

import { useEffect, useRef } from 'react';

// Traps the back button/gesture while a modal-like overlay (RFQ form, Add-Seller sheet) is
// open. Without this, pressing back while an overlay is open navigates the page underneath
// while the overlay stays stuck on screen — the browser has no idea an overlay is "on top."
// The fix: push a same-URL history entry the instant the overlay opens, so the first back
// press lands on that entry instead of the real previous page. That press fires `popstate`
// here, where a confirmation is shown before the overlay actually closes (rather than
// silently discarding whatever the buyer was doing); canceling re-arms the trap so a second
// back press asks again instead of silently falling through to a real navigation.
export function useBackToClose(isOpen: boolean, onClose: () => void, confirmMessage: string) {
  const closedViaBackRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    closedViaBackRef.current = false;
    window.history.pushState({ __overlayTrap: true }, '');

    const handlePopState = () => {
      const shouldLeave = window.confirm(confirmMessage);
      if (shouldLeave) {
        closedViaBackRef.current = true;
        onClose();
      } else {
        // Re-arm the trap — the back press that just fired already consumed our pushed
        // entry, so without this a second back press would skip the confirmation entirely.
        window.history.pushState({ __overlayTrap: true }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Closed some other way (X button, submit, backdrop click) — remove the trap entry
      // ourselves so a later back press doesn't need two taps to reach the real previous page.
      if (!closedViaBackRef.current) {
        window.history.back();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}
