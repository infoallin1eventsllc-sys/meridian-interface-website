import { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
}

export function ImageModal({ isOpen, onClose, imageSrc, title }: ImageModalProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Close on Escape & handle body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    setZoomLevel(1);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(1, prev + delta)));
  };

  const resetZoom = () => setZoomLevel(1);

  return (
    <div
      id="image-modal-lightbox"
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 sm:p-6 bg-[#2C1B10]/95 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 text-white pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-sans uppercase tracking-widest text-[#D4A373] font-bold bg-[#2C1B10]/80 px-3 py-1 rounded-full border border-[#D4A373]/30">
            High-Resolution Lens
          </span>
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#FAF7F2] hidden sm:inline truncate max-w-md">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-white/10 rounded-full px-2 py-1 border border-white/20">
            <button
              id="btn-zoom-out"
              onClick={() => handleZoom(-0.25)}
              disabled={zoomLevel <= 1}
              className="p-1 text-white/80 hover:text-white disabled:opacity-30 transition-opacity"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-[#D4A373]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              id="btn-zoom-in"
              onClick={() => handleZoom(0.25)}
              disabled={zoomLevel >= 2.5}
              className="p-1 text-white/80 hover:text-white disabled:opacity-30 transition-opacity"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                id="btn-zoom-reset"
                onClick={resetZoom}
                className="ml-1 text-[10px] text-[#D4A373] hover:underline font-sans font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          <a
            id="btn-image-open-full"
            href={imageSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            title="Open in new window"
            aria-label="Open image in new tab"
          >
            <Maximize2 className="w-4 h-4" />
          </a>

          <button
            id="btn-image-close"
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Container with Zoom Transform */}
      <div
        id="image-zoom-viewport"
        className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center overflow-auto p-2 cursor-zoom-out"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <img
          id="lightbox-inspected-image"
          src={imageSrc}
          alt={title}
          style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
          className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl origin-center border border-[#D4A373]/20"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Title Bar on Mobile */}
      <div className="absolute bottom-4 left-4 right-4 text-center z-20 text-xs font-sans text-[#E5D3C0] sm:hidden bg-[#2C1B10]/80 py-1.5 px-3 rounded-full mx-auto max-w-xs truncate border border-[#D4A373]/20">
        {title}
      </div>
    </div>
  );
}
