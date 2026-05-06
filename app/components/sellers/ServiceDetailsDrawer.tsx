"use client";

import { useEffect } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: "Active" | "Inactive";
}

interface ServiceDetailsDrawerProps {
  service: Service | null;
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

export default function ServiceDetailsDrawer({ service, isOpen, onClose }: ServiceDetailsDrawerProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!service) return null;

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
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[15px] font-bold text-[#21272A]">Service Details</h2>
            <p className="text-[11px] text-[#6B6F72] mt-0.5">View and manage seller-specific Service information</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Service Card */}
          <div className="p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="w-[160px] h-[160px] rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-6xl flex-shrink-0">
                {service.image}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[20px] font-semibold text-[#1E3862] mb-1">{service.name}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <LocationIcon />
                  <span className="text-[14px] font-medium text-[#1E3862]">Herba Salus Parapharmacy, Via Gramoci, 211/b..</span>
                </div>

                {/* Base Price */}
                <div className="border border-[#F8F8F8] rounded-lg p-3">
                  <p className="text-[12px] font-medium text-[#6B6F72] mb-0.5">Base Price</p>
                  <p className="text-[14px] font-semibold text-black">€{service.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[13px] font-bold text-[#21272A] mb-2">Description</h4>
            <p className="text-[12px] text-[#6B6F72] leading-relaxed">
              The CardioCheck Cholesterol Screening offers a quick and easy way to monitor your cholesterol levels.
              This service provides accurate results, helping you stay proactive about your heart health. Get insights
              into your total cholesterol, HDL, LDL, and triglycerides in just minutes.
            </p>
            <p className="text-[12px] text-[#6B6F72] leading-relaxed mt-2">
              The process is simple and convenient, involving a small blood sample taken from your fingertip. Our trained
              professionals ensure a comfortable experience, providing you with immediate results and personalized advice.
              Ideal for regular check-ups and maintaining a healthy lifestyle.
            </p>
          </div>

          {/* Main Benefits */}
          <div>
            <h4 className="text-[13px] font-bold text-[#21272A] mb-2">Main benefits</h4>
            <ul className="space-y-1.5">
              {[
                "Comprehensive cholesterol analysis",
                "Fast results in 10 minutes",
                "Guidance from certified health professionals",
                "No fasting required",
                "Simple finger-prick test",
                "Confidential and secure results",
                "Regular monitoring for proactive health management",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-[12px] text-[#6B6F72]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#6B6F72] flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Format and variants */}
          <div>
            <h4 className="text-[13px] font-bold text-[#21272A] mb-2">Format and variants</h4>
            <p className="text-[12px] text-[#6B6F72] leading-relaxed">
              Single-use kit<br />
              Results provided during the appointment<br />
              Expiration: 12 months from purchase
            </p>
          </div>

          {/* Format and variants (2) */}
          <div>
            <h4 className="text-[13px] font-bold text-[#21272A] mb-2">Format and variants</h4>
            <p className="text-[12px] text-[#6B6F72] leading-relaxed">
              Single-use kit<br />
              Results provided during the appointment<br />
              Expiration: 12 months from purchase
            </p>
          </div>

          {/* Service Details */}
          <div>
            <h4 className="text-[13px] font-bold text-[#21272A] mb-2">Service Details</h4>
          </div>

        </div>
      </div>
    </>
  );
}