import React, { useState } from 'react';
import { X, Check, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.size || product.availableSizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.color || product.availableColors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const views = [product.image, ...(product.additionalImages ?? [])];
  const [view, setView] = useState<string>(product.image);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // The modal stays mounted between products, so reset the chosen view.
  React.useEffect(() => { setView(product.image); }, [product.image]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-[#FFFFFF] w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 border border-[#1A1A1A]/15 shadow-2xl">
        {/* Close button */}
        <button
          id="close-product-modal-btn"
          aria-label="Close Product Details"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-[#F9F7F2] border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A] hover:bg-[#ECE8E1] transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">
          {/* Product Image Column */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="w-full aspect-[3/4] bg-[#ECE8E1] overflow-hidden relative border border-[#1A1A1A]/10">
              <img
                src={view}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {views.length > 1 && (
              <div className="flex gap-2.5">
                {views.map((src, i) => (
                  <button
                    key={src}
                    id={`product-view-${i}`}
                    aria-label={`View ${i + 1} of ${product.name}`}
                    aria-pressed={view === src}
                    onClick={() => setView(src)}
                    className={`w-16 aspect-[3/4] overflow-hidden border transition-colors cursor-pointer ${
                      view === src ? 'border-[#1A1A1A]' : 'border-[#1A1A1A]/15 hover:border-[#1A1A1A]/50'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#1A1A1A]/10 pb-6 mb-6">
                <span className="text-[10px] uppercase font-bold text-[#1A1A1A]/50 tracking-[0.3em] font-sans block mb-1">
                  Catalog Edition • {product.category}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#1A1A1A] tracking-tight">
                  {product.name}
                </h2>
                <p className="font-sans text-xl font-bold tracking-wider text-[#1A1A1A] mt-2">
                  ${product.price}.00 USD
                </p>
              </div>

              {/* Description */}
              <p className="font-sans text-xs text-[#1A1A1A]/70 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mb-6">
                <label className="block text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-[#1A1A1A]/60 mb-2">
                  Colorway: <span className="font-medium text-[#1A1A1A]">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {product.availableColors.map((col) => (
                    <button
                      key={col}
                      id={`select-color-${col}`}
                      onClick={() => setSelectedColor(col)}
                      className={`h-8 px-3.5 text-[10px] font-sans uppercase font-semibold border tracking-wider transition-colors cursor-pointer ${
                        selectedColor === col
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2]'
                          : 'border-[#1A1A1A]/20 bg-[#F9F7F2] text-[#1A1A1A] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-[#1A1A1A]/60">
                    Proportion: <span className="font-medium text-[#1A1A1A]">{selectedSize}</span>
                  </label>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#1A1A1A]/40">
                    Fit: Architectural Boxy
                  </span>
                </div>
                <div className="flex gap-2">
                  {product.availableSizes.map((sz) => (
                    <button
                      key={sz}
                      id={`select-size-${sz}`}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 text-xs font-sans font-semibold uppercase border transition-colors cursor-pointer flex items-center justify-center ${
                        selectedSize === sz
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2]'
                          : 'border-[#1A1A1A]/20 bg-[#F9F7F2] text-[#1A1A1A] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add Action */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center border border-[#1A1A1A]/20 h-12 w-28 bg-[#FFFFFF]">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#ECE8E1] disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-full text-center font-sans font-semibold text-xs">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#ECE8E1] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  disabled={addedSuccess}
                  className={`flex-grow h-12 font-sans font-semibold text-xs uppercase tracking-[0.25em] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    addedSuccess
                      ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                      : 'bg-[#1A1A1A] hover:bg-[#333] text-[#F9F7F2] active:scale-[0.99]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={15} />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      <span>Reserve Piece — ${(product.price * quantity).toFixed(2)} USD</span>
                    </>
                  )}
                </button>
              </div>

              {/* Specs & Assurance Badges */}
              <div className="border-t border-[#1A1A1A]/10 pt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-[11px] text-[#1A1A1A]/70 font-sans">
                  <Truck size={14} className="text-[#1A1A1A]" />
                  <span>Free insured shipping on orders over $150</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] text-[#1A1A1A]/70 font-sans">
                  <RotateCcw size={14} className="text-[#1A1A1A]" />
                  <span>30-day returns and exchanges</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] text-[#1A1A1A]/70 font-sans">
                  <Shield size={14} className="text-[#1A1A1A]" />
                  <span>Numbered edition, closed when it sells through</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
