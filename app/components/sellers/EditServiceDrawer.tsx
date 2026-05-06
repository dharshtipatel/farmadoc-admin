"use client";

import { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: "Active" | "Inactive";
}

interface EditServiceDrawerProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Service) => void;
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

export default function EditServiceDrawer({ service, isOpen, onClose, onSave }: EditServiceDrawerProps) {
  const [basePrice, setBasePrice] = useState("");
  const [bookable, setBookable]   = useState(true);

  useEffect(() => {
    if (service) {
      setBasePrice(String(service.price));
      setBookable(true);
    }
  }, [service]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!service) return null;

  const handleSave = () => {
    onSave({ ...service, price: parseFloat(basePrice) || service.price });
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/85 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[880px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[15px] font-bold text-[#21272A]">Edit Service</h2>
            <p className="text-[11px] text-[#6B6F72] mt-0.5">Update seller-specific details for this Service.</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Service Info */}
          <div>
            <h3 className="text-[16px] font-inter font-semibold text-black mb-3">Service Info</h3>
            <div className="flex items-center gap-3">
              <div className="w-[60px] h-[60px] rounded-lg bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                {service.image}
              </div>
              <div>
                <p className="text-[14px] font-inter font-semibold text-[#1E3862]">{service.name}</p>
                <p className="text-[14px] font-inter text-[#6B6F72]">
                  Service ID: <span className="text-[#1192E8] font-inter font-medium">{service.id}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Discount */}
          <div>
            <h3 className="text-[16px] font-inter font-semibold text-black mb-3">Pricing & Discount</h3>
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-medium text-black">Base Price</label>
              <input
                type="text"
                placeholder="Enter Base Price"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-[16px] font-inter font-semibold text-black mb-3">Availability</h3>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-inter text-[#21272A]">Bookable</span>
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