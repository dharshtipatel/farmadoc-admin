"use client";

import { useEffect, useState } from "react";

interface Product {
  sku: string;
  name: string;
  image: string;
  quantity: number;
  discount: string;
  disValue: string;
  sellingPrice: string;
  promoEnds: string;
  status: "Active" | "Inactive";
}

interface ProductDetailsDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6F72"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium font-inter text-[#6B6F72] mb-1">{label}</p>
      <p className="text-[14px] font-inter font-semibold text-[#000000]">{value}</p>
    </div>
  );
}

export default function ProductDetailsDrawer({ product, isOpen, onClose }: ProductDetailsDrawerProps) {
  // All images (main + extras) — use emoji as placeholder
  const ALL_IMAGES = product ? [
    product.image, "🧴", "💊", "🌿", "✨", "💧",
  ] : [];

  const VISIBLE_COUNT = 4; // thumbnails shown before +N
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else { document.body.style.overflow = ""; setActiveIdx(0); setShowAll(false); }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!product) return null;

  const visibleThumbs = showAll ? ALL_IMAGES : ALL_IMAGES.slice(0, VISIBLE_COUNT);
  const hiddenCount = ALL_IMAGES.length - VISIBLE_COUNT;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/85 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[880px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[18px] font-semibold text-black">Product Details</h2>
            <p className="text-[12px] font-medium font-inter text-[#6B6F72] mt-0.5">View and manage seller-specific product information</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* ── Product Card ── */}
            <div className="border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex gap-5">

                {/* Left: large image + thumbnails */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                {/* Large image */}
                <div className="w-[300px] h-[256px] rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-6xl">
                    {ALL_IMAGES[activeIdx]}
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-1.5">
                    {visibleThumbs.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className={`w-[54px] h-[54px] rounded-lg border flex items-center justify-center text-lg flex-shrink-0 transition-all ${
                        activeIdx === i
                            ? "border-[#1192E8] bg-blue-50"
                            : "border-[#E5E7EB] bg-gradient-to-br from-orange-50 to-red-100"
                        }`}
                    >
                        {img}
                    </button>
                    ))}
                    {!showAll && hiddenCount > 0 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="w-[54px] h-[54px] rounded-lg bg-black/85 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                    >
                        +{hiddenCount}
                    </button>
                    )}
                </div>
                </div>

                {/* Right: name + sku + seller + info grid */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">

                {/* Name, SKU, Seller */}
                <div>
                    <h3 className="text-[20px] font-bold text-[#1E3862] leading-snug mb-2">
                    {product.name}
                    </h3>
                    <p className="text-[14px] font-medium text-[#6B6F72] mb-1.5">
                    SKU: <span className="text-[#1192E8] font-medium">{product.sku}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                    <LocationIcon />
                    <span className="text-[14px] text-[#1E3862] font-medium">
                        Herba Salus Parapharmacy, Via Gramoci, 211/b..
                    </span>
                    </div>
                </div>

                {/* Info Grid — on the right, below name */}
                <div className="border border-[#EDF2FB] bg-[#F8F8F8] rounded-xl mt-2 p-3">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    <InfoCell label="Base Price"     value="€100.00" />
                    <InfoCell label="Discount Value" value={product.disValue} />
                    <InfoCell label="Discount %"     value={product.discount} />
                    <InfoCell label="Selling Price %" value={product.sellingPrice} />
                    <InfoCell label="Quantity"       value={String(product.quantity)} />
                    <InfoCell label="Promotion Ends" value={product.promoEnds} />
                    <InfoCell label="Bookable"       value="Yes" />
                    <InfoCell label="Category"       value="Pain Relief" />
                    <InfoCell label="Brand"          value="Brand Name here" />
                    </div>
                </div>

                </div>
            </div>
            </div>

          {/* Description */}
          <div>
            <h4 className="text-[16px] font-semibold text-black mb-2">Description</h4>
            <p className="text-[14px] text-[#6B6F72] leading-relaxed">
              Filterina Extra Comfort Fluid Foundation SPF15 is an advanced makeup treatment that combines
              coverage, hydration, and sun protection in a single formula. It contains the patented complex
              of 6 hyaluronic acids, for a smoothing, plumping, and hydrating action visible from the first application.
            </p>
            <p className="text-[14px] text-[#6B6F72] leading-relaxed mt-2">
              The creamy, fluid texture blends seamlessly with the skin, leaving a light, silky film that evens
              out skin tone and reduces discolorations and imperfections without weighing it down. Ideal for daily
              use, even on sensitive skin, thanks to the hypoallergenic, non-comedogenic formula, tested for nickel,
              chromium, and cobalt.
            </p>
          </div>

          {/* Main Benefits */}
          <div>
            <h4 className="text-[16px] font-semibold text-black mb-2">Main benefits</h4>
            <ul className="space-y-1.5">
              {[
                "Medium buildable coverage",
                "Formula with 6 patented Hyaluronic Acids",
                "Deep and long-lasting hydration",
                "SPF 15 sun protection",
                "Fluid, light and silky texture",
                "Hypoallergenic and non-comedogenic",
                "Nickel, chromium and cobalt tested",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-[14px] text-[#6B6F72]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#6B6F72] flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Format and variants */}
          <div>
            <h4 className="text-[16px] font-semibold text-black mb-2">Format and variants</h4>
            <p className="text-[14px] text-[#6B6F72] leading-relaxed">
              30 ml tube<br />
              Available in 6 shades to suit every skin tone:<br />
              Cod: 03032, 03033, 03034, 03035, 03036, 03037<br />
              Validity after opening: 6 months
            </p>
          </div>

        </div>
      </div>
    </>
  );
}