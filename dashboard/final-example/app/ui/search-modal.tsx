'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';

export default function SearchModal({
  query,
  children,
}: {
  query: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(!!query);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Cmd+K / Ctrl+K to toggle, Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  function handleClose() {
    setIsOpen(false);
    // Clear query param when closing
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-4 hidden rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500 md:inline-block">
          Cmd+K
        </kbd>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-gray-900/50"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4">
              <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search customers, invoices..."
                defaultValue={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border-0 bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={handleClose}
                className="shrink-0 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-400 transition-colors hover:bg-gray-200"
              >
                Esc
              </button>
            </div>

            {/* Server-rendered children (Suspense boundary lives in the parent page) */}
            {children}

            {/* Footer hint */}
            {query && (
              <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
                Showing results for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
