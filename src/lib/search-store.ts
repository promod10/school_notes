// Zustand-free lightweight search store using a custom event + module-level state
// This avoids adding another dependency while sharing state between Header and SearchModal.
'use client';

import { useState, useEffect } from 'react';

// Module-level event bus
const SEARCH_OPEN_EVENT = 'conceptweave:search-open';
const SEARCH_CLOSE_EVENT = 'conceptweave:search-close';

export function useSearchStore() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
    window.addEventListener(SEARCH_OPEN_EVENT, onOpen);
    window.addEventListener(SEARCH_CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(SEARCH_OPEN_EVENT, onOpen);
      window.removeEventListener(SEARCH_CLOSE_EVENT, onClose);
    };
  }, []);

  const openSearch = () => window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
  const closeSearch = () => window.dispatchEvent(new Event(SEARCH_CLOSE_EVENT));

  return { isOpen, openSearch, closeSearch };
}
