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

interface EditProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Product) => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-[#1E3862]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
        className={`absolute top-[3px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
          checked ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function InputField({
  label, placeholder, value, onChange, suffix, type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-[#21272A]">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1E3862] text-[#21272A] placeholder-[#A8AAAC] bg-white"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#6B6F72]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function DateField({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-[#21272A]">{label}</label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] bg-white appearance-none"
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6F72]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function EditProductDrawer({ product, isOpen, onClose, onSave }: EditProductDrawerProps) {
  const [basePrice,    setBasePrice]    = useState("");
  const [discountPct,  setDiscountPct]  = useState("");
  const [discountVal,  setDiscountVal]  = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockQty,     setStockQty]     = useState("");
  const [expiryDate,   setExpiryDate]   = useState("");
  const [promoEnd,     setPromoEnd]     = useState("");
  const [bookable,     setBookable]     = useState(true);

  // Populate fields when product changes
  useEffect(() => {
    if (product) {
      setBasePrice("100.00");
      setDiscountPct(product.discount.replace("%", ""));
      setDiscountVal(product.disValue.replace("€", ""));
      setSellingPrice(product.sellingPrice.replace("€", ""));
      setStockQty(String(product.quantity));
      setExpiryDate("");
      setPromoEnd(product.promoEnds);
      setBookable(true);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!product) return null;

  const handleSave = () => {
    onSave({
      ...product,
      discount: `${discountPct}%`,
      disValue: `€${discountVal}`,
      sellingPrice: `€${sellingPrice}`,
      quantity: parseInt(stockQty) || product.quantity,
      promoEnds: promoEnd,
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
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
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[15px] font-bold text-[#21272A]">Edit Product</h2>
            <p className="text-[11px] text-[#6B6F72] mt-0.5">Update seller-specific details for this product</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Product Info */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#21272A] mb-3">Product Info</h3>
            <div className="flex items-center gap-3">
              <div className="w-[60px] h-[60px] rounded-lg bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-2xl flex-shrink-0">
                {product.image}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1E3862] font-inter mb-1">{product.name}</p>
                <p className="text-[14px] text-[#6B6F72] font-medium">
                  SKU: <span className="text-[#1192E8] font-medium">{product.sku}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8 flex-shrink-0 mt-2">
            <div>
                <p className="text-[12px] text-[#6B6F72] font-medium font-inter">Category</p>
                <p className="text-[14px] font-medium text-black font-inter">Pain Relief</p>
            </div>
            <div>
                <p className="text-[12px] text-[#6B6F72] font-medium font-inter">Brand</p>
                <p className="text-[14px] font-medium text-[#21272A] font-inter">Brand Name here</p>
            </div>
        </div>
          </div>

          {/* Pricing & Discount */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#21272A] mb-3">Pricing & Discount</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Base Price"
                placeholder="Enter Base Price"
                value={basePrice}
                onChange={setBasePrice}
              />
              <InputField
                label="Discount %"
                placeholder="Enter discount %"
                value={discountPct}
                onChange={setDiscountPct}
                suffix="%"
              />
              <InputField
                label="Discount Value"
                placeholder="Enter discount value"
                value={discountVal}
                onChange={setDiscountVal}
              />
              <InputField
                label="Selling Price"
                placeholder="Enter discount value"
                value={sellingPrice}
                onChange={setSellingPrice}
              />
            </div>
          </div>

          {/* Inventory & Dates */}
          <div>
  <h3 className="text-[13px] font-semibold text-[#21272A] mb-3">Inventory & Dates</h3>
  <div className="grid grid-cols-3 gap-4">
    <InputField
      label="Stock Quantity"
      placeholder="Enter stock quantity"
      value={stockQty}
      onChange={setStockQty}
      type="number"
    />
    <DateField
      label="Product Expiry Date"
      value={expiryDate}
      onChange={setExpiryDate}
    />
    <DateField
      label="Promotion End Date"
      value={promoEnd}
      onChange={setPromoEnd}
    />
  </div>
</div>

          {/* Availability */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#21272A] mb-3">Availability</h3>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#21272A]">Bookable</span>
              <Toggle checked={bookable} onChange={() => setBookable((prev) => !prev)} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#21272A] hover:bg-gray-50 rounded-lg transition-colors border border-[#D6DADD]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#1E3862] hover:bg-[#16305a] rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}