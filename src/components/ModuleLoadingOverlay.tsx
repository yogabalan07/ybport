import React from 'react';

// Shared Suspense fallback for lazily-loaded modal chunks.
// Matches the existing paper/engineering aesthetic (same z-50 + backdrop as the modals)
// so there is no visible layout jump between "loading" and "loaded" states.
export const ModalLoadingOverlay: React.FC = () => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs"
    role="status"
    aria-live="polite"
    aria-label="Loading dialog"
  >
    <div className="bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl px-6 py-4 shadow-[5px_6px_0px_#141517] font-mono text-xs text-[#575961] flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
      <span>// loading module…</span>
    </div>
  </div>
);
