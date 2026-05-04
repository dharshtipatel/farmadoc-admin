"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ActionType = "upgrade" | "inactive" | "suspend" | "downgrade" | "active" | "reactivate" | null;

type Props = {
  open: boolean;
  actionType: ActionType;
  sellerName?: string;
  onClose: () => void;
  onConfirm: (actionType: ActionType, reasons?: string[], note?: string) => void;
};

const SUSPEND_REASONS = [
  "Policy violation",
  "Suspicious activity",
  "Repeated order issues",
  "Payment-related concerns",
  "Incomplete or invalid information",
  "Other",
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white"
    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="#F59E0B" stroke="#F59E0B" strokeWidth="0">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function SellerBulkActionModal({ open, actionType, sellerName, onClose, onConfirm }: Props) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");

  if (!open || !actionType) return null;

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setNote("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(actionType, selectedReasons, note);
    setSelectedReasons([]);
    setNote("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85"
      onClick={handleClose}
    >
      <div
        className="w-[560px] bg-white rounded-2xl shadow-xl border border-[#E8EAED] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ══ UPGRADE TO SHOWROOM ══ */}
        {actionType === "upgrade" && (
          <div className="p-6">
            <h2 className="text-[18px] font-semibold text-black mb-1">Upgrade to Showroom?</h2>
            <p className="text-[14px] text-[#6B6F72] font-medium mb-5 leading-relaxed">
              Enable showroom features for this pharmacy to increase visibility and offerings.
            </p>
            <p className="text-[16px] font-semibold text-black mb-3">What changes after upgrade?</p>
            <ul className="flex flex-col gap-2 mb-6">
              {[
                "Pharmacy will appear in Showroom listings",
                "Can showcase products without reservation requirement",
                "Eligible for premium placement & higher visibility",
                "Can highlight featured products",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#6B6F72] text-[14px] font-medium leading-relaxed">• {item}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-end gap-3">
              <button onClick={handleClose}
                className="px-4 py-2 text-[14px] font-medium text-black hover:text-[#21272A] transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className="px-4 py-2 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[14px] font-medium transition-colors">
                Upgrade to Showroom
              </button>
            </div>
          </div>
        )}

        {/* ══ DOWNGRADE TO STANDARD PHARMACY ══ */}
        {actionType === "downgrade" && (
          <div className="p-6">
            <h2 className="text-[18px] font-semibold text-black mb-1">Downgrade to Standard Pharmacy?</h2>
            <p className="text-[14px] text-[#6B6F72] font-medium mb-5 leading-relaxed">
              Remove showroom privileges and revert to a standard pharmacy listing.
            </p>

            <div className="flex items-center gap-2 mb-3">
              <WarningIcon />
              <p className="text-[15px] font-semibold text-black">What changes after downgrade?</p>
            </div>

            <ul className="flex flex-col gap-2 mb-6">
              {[
                "Pharmacy will no longer appear in Showroom sections",
                "Showroom-only products may be hidden",
                "Reduced visibility across marketplace",
                "Listings may be excluded from primary search results",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#6B6F72] text-[14px] font-medium leading-relaxed">• {item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-end gap-3">
              <button onClick={handleClose}
                className="px-4 py-2 text-[14px] font-medium text-black hover:text-[#21272A] transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className="px-4 py-2 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[14px] font-medium transition-colors">
                Downgrade
              </button>
            </div>
          </div>
        )}

        {/* ══ MARK AS INACTIVE ══ */}
        {actionType === "inactive" && (
          <div className="p-6">
            <h2 className="text-[18px] font-semibold text-black mb-1">Mark Seller as Inactive?</h2>
            <p className="text-[14px] text-[#6B6F72] font-medium mb-5 leading-relaxed">
              Marking this seller as inactive will remove their visibility from the platform, including all associated products, offers, and listings. Users will no longer be able to discover or interact with this seller until they are reactivated. This action does not delete any data and can be reversed at any time by marking the seller as active again.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={handleClose}
                className="px-4 py-2 text-[14px] font-medium text-black hover:text-[#21272A] transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className="px-4 py-2 bg-[#DA1E28] hover:bg-[#b91c1c] text-white rounded-lg text-[14px] font-medium transition-colors">
                Confirm Inactivate
              </button>
            </div>
          </div>
        )}

        {/* ══ MARK AS ACTIVE ══ */}
        {actionType === "active" && (
          <div className="p-6">
            <h2 className="text-[18px] font-semibold text-black mb-1">Mark Seller as Active?</h2>
            <p className="text-[14px] text-[#6B6F72] font-medium mb-5 leading-relaxed">
              Activating this seller will restore their visibility across the platform, making their products, offers, and listings accessible to users again. Any previously hidden content associated with this seller will become available, and normal operations will resume immediately.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={handleClose}
                className="px-4 py-2 text-[14px] font-medium text-black hover:text-[#21272A] transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className="px-4 py-2 bg-[#24A148] hover:bg-[#1a7a38] text-white rounded-lg text-[14px] font-medium transition-colors">
                Confirm Activate
              </button>
            </div>
          </div>
        )}

        {/* ══ SUSPEND SELLER ══ */}
        {actionType === "suspend" && (
          <div className="p-6">
            <h2 className="text-[18px] font-semibold text-black mb-1">Suspend Seller?</h2>
            <p className="text-[14px] text-[#6B6F72] font-medium mb-5 leading-relaxed">
              Suspending this seller will immediately restrict their access to the platform and prevent any further activity.
            </p>
            <p className="text-[14px] font-semibold text-[#21272A] mb-3">Select Reason for Suspension</p>
            <div className="flex flex-col gap-2.5 mb-5">
              {SUSPEND_REASONS.map((reason) => (
                <label key={reason} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleReason(reason)}
                    className="w-[15px] h-[15px] rounded border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: selectedReasons.includes(reason) ? "#1E3862" : "#fff",
                      borderColor: selectedReasons.includes(reason) ? "#1E3862" : "#D6DADD",
                    }}
                  >
                    {selectedReasons.includes(reason) && <CheckIcon />}
                  </div>
                  <span className="text-[13px] text-black group-hover:text-[#1E3862] transition-colors">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[14px] font-medium text-[#6B6F72]">Reason</label>
                <span className="text-[11px] text-[#4E616A]">(Character Limit: 250)</span>
              </div>
              <textarea
                value={note}
                onChange={(e) => { if (e.target.value.length <= 250) setNote(e.target.value); }}
                placeholder="Please share your reason."
                rows={4}
                className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#9A9C9E] placeholder-[#A8AAAC] resize-none leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={handleClose}
                className="px-4 py-2 text-[14px] font-medium text-black hover:text-[#21272A] transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className="px-4 py-2 bg-[#DA1E28] hover:bg-[#b91c1c] text-white rounded-lg text-[14px] font-medium transition-colors">
                Confirm Suspend
              </button>
            </div>
          </div>
        )}

        {/* ══ REACTIVATE SELLER ══ */}
        {actionType === "reactivate" && (
          <div className="p-6">
            <h2 className="text-[18px] font-semibold text-black mb-1">Reactivate Seller?</h2>
            <p className="text-[14px] text-[#6B6F72] font-medium mb-5 leading-relaxed">
              Reactivating this seller will restore their access to the platform and allow them to resume normal operations, including managing products, handling orders, and updating their profile. Any previous restrictions applied during suspension will be removed, and the seller will regain full control of their account.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={handleClose}
                className="px-4 py-2 text-[14px] font-medium text-black hover:text-[#21272A] transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className="px-4 py-2 bg-[#24A148] hover:bg-[#1a7a38] text-white rounded-lg text-[14px] font-medium transition-colors">
                Confirm Reactivate
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}