"use client";

import { useEffect } from "react";

interface PharmacyRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  mapUrl: string;
  reqOn: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface ReviewPharmacyDrawerProps {
  request: PharmacyRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onReject: (id: string) => void;
  onApprove: (id: string) => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function InfoBlock({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <p className="text-[12px] font-medium font-inter text-[#6B6F72] mb-0.5">{label}</p>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-[#1192E8] hover:underline break-all leading-relaxed"
        >
          {value}
        </a>
      ) : (
        <p className="text-[14px] font-medium text-black leading-snug">{value}</p>
      )}
    </div>
  );
}

export default function ReviewPharmacyDrawer({
  request, isOpen, onClose, onReject, onApprove,
}: ReviewPharmacyDrawerProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!request) return null;

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
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[18px] font-semibold font-inter text-black">Review Pharmacy Application</h2>
            <p className="text-[12px] font-medium font-inter text-[#6B6F72] mt-0.5">
              Validate the pharmacy details and documents.
            </p>
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

          {/* Pharmacy Details */}
          <div>
            <h3 className="text-[16px] font-semibold text-black font-inter mb-4">Pharmacy Details</h3>
            <div className="grid grid-cols-2 gap-5 mb-4">
              <InfoBlock label="Pharmacy / Business Name" value={request.name} />
              <InfoBlock label="Email" value={request.email} />
            </div>
            <div>
              <InfoBlock label="Phone" value={request.phone} />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E5E7EB]" />

          {/* Location Details */}
          <div>
            <h3 className="text-[13px] font-bold text-[#21272A] mb-4">Location Details</h3>
            <div className="mb-4">
              <InfoBlock label="Full Address Details" value={request.location} />
            </div>
            <div>
              <InfoBlock label="Map URL" value={request.mapUrl} isLink />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#21272A] hover:bg-gray-50 rounded-lg transition-colors border border-[#D6DADD]"
          >
            Close
          </button>
          <button
            onClick={() => { onReject(request.id); onClose(); }}
            className="px-5 py-2.5 text-[13px] font-medium text-[#DA1E28] border border-[#DA1E28] rounded-lg hover:bg-red-50 transition-colors"
          >
            Reject Request
          </button>
          <button
            onClick={() => { onApprove(request.id); onClose(); }}
            className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#24A148] hover:bg-[#1a7a38] rounded-lg transition-colors"
          >
            Verify & Approve
          </button>
        </div>
      </div>
    </>
  );
}