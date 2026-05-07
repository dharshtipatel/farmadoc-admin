"use client";

import { useEffect } from "react";
import OfferArtwork from "./OfferArtwork";
import { Offer } from "./types";

const SCOPE_VALUES: Record<string, string[]> = {
  Showrooms: [
    "Binu Pharmacy, Milano",
    "Health Mart, Rome",
    "Cura Pharmacy, Naples",
    "Wellness Corner, Florence",
    "Vital Care Pharmacy, Turin",
    "GreenAid Pharmacy, Bologna",
    "MediPlus, Verona",
    "Farmacia Centrale, Genoa",
    "Life Pharmacy, Bari",
    "PharmaTrust, Palermo",
    "CareWell Pharmacy, Catania",
    "HealFirst, Trieste",
    "Community Drugstore, Modena",
    "Expert Pharmacy, Padua",
    "Family Care Pharmacy, Brescia",
    "Sunshine Pharmacy, Livorno",
  ],
  Products: [
    "Solar Labo Prot Crp Spf50+",
    "Hydra Boost Moisturizer 24h",
    "Revitalizing Eye Cream",
    "Night Repair Serum",
    "Gentle Exfoliating Scrub",
    "Vitamin C Tablets",
  ],
  Categories: [
    "Pain Relief & Analgesics",
    "Antibiotics & Antibacterials",
    "Vitamins & Supplements",
    "Skin Care & Dermatology",
    "Digestive Health",
    "Respiratory Care",
  ],
  Global: ["All sellers, products, and categories"],
};

const TYPE_LABELS: Record<string, string> = {
  "Flat Discount": "Apply a fixed amount discount",
  "Percentage Discount": "Apply a fixed percentage discount",
  "Cart Value": "Apply discount on cart value",
};

const STATUS_STYLES: Record<Offer["status"], string> = {
  Active: "bg-[#F2FFE2] text-[#24A148]",
  Inactive: "bg-[#F4F4F4] text-[#6B6F72]",
  Scheduled: "bg-[#EFF6FF] text-[#1192E8]",
  Expired: "bg-[#FEF2F2] text-[#DA1E28]",
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ViewOfferDrawer({
  open,
  offer,
  onClose,
}: {
  open: boolean;
  offer: Offer | null;
  onClose: () => void;
}) {
  const scopeItems = offer ? SCOPE_VALUES[offer.appliedOn] ?? [] : [];
  const couponCode = offer ? `${offer.name.replace(/\s+/g, "").toUpperCase()}26` : "";
  const priorityText = "Higher priority overrides lower offers";
  const autoApplyText = offer?.type === "Flat Discount" ? "Yes" : "No";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/85" onClick={onClose} />}

      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[880px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[#E8EAED] px-5 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#21272A]">View Offer</h2>
            <p className="mt-0.5 text-[11px] text-[#6B6F72]">
              View offer configuration, applied scope, and current status across the platform.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[#6B6F72] transition-colors hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        {offer && (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-3 rounded-lg border border-[#8470BC] bg-[#F6F4FF] px-3 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E3E8F0] bg-white">
                  <OfferArtwork art={offer.art} />
                </div>
                <div>
                  <p className="text-[12px] font-bold leading-4 text-[#21272A]">{offer.type}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-[#6B6F72]">{TYPE_LABELS[offer.type] ?? "Offer configuration"}</p>
                </div>
              </div>

              <span className={`rounded-full px-3 py-1 text-[12px] font-semibold capitalize ${STATUS_STYLES[offer.status]}`}>
                {offer.status === "Active" ? "+ Active" : offer.status}
              </span>
            </div>

            <h3 className="mb-5 text-[20px] font-bold leading-7 text-[#1F2937]">{offer.name}</h3>

            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Discount Amount</p>
                <p className="text-[12px] text-[#4B5563]">{offer.discount}</p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Applied on</p>
                <p className="text-[12px] text-[#4B5563]">{offer.appliedOn}</p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Validity</p>
                <p className="text-[12px] text-[#4B5563]">
                  {offer.validFrom} to {offer.validTo}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Total Usages Limit</p>
                <p className="text-[12px] text-[#4B5563]">{offer.usage}</p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Per User Limit</p>
                <p className="text-[12px] text-[#4B5563]">1</p>
              </div>
              <div />

              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Priority</p>
                <p className="text-[12px] text-[#4B5563]">{priorityText}</p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Auto Apply</p>
                <p className="text-[12px] text-[#4B5563]">{autoApplyText}</p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Coupon Code</p>
                <p className="text-[12px] text-[#4B5563]">{couponCode}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-1 text-[11px] font-semibold text-[#21272A]">Description</p>
              <p className="text-[12px] leading-5 text-[#4B5563]">
                At Apothicure, a verified Showroom + pharmacy, discover reliable medications, expert healthcare
                assistance, and special in-store discounts. Clients can easily order items online and pick them up
                directly at the pharmacy, benefiting from personalized advice from skilled professionals.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-[#D6DADD]">
              <div className="border-b border-[#D6DADD] bg-[#F7F9FC] px-4 py-2.5 text-[11px] font-medium text-[#6B6F72]">
                Selected {offer.appliedOn}
              </div>
              <div className="max-h-[320px] overflow-y-auto bg-white">
                {scopeItems.map((item) => (
                  <div
                    key={item}
                    className="border-b border-[#EEF1F4] px-4 py-2.5 text-[12px] font-medium text-[#1192E8] last:border-b-0"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
