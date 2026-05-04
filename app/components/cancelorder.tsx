"use client";

import { useState } from "react";

const CANCELLATION_REASONS = [
  "User requested cancellation",
  "Pharmacy unable to fulfill order",
  "Product out of stock",
  "Pricing or discount issue",
  "Payment failure / issue",
  "Duplicate order",
  "Other",
];

type Props = {
  open: boolean;
  orderId?: string;
  onClose: () => void;
  onConfirm: (reasons: string[], note: string) => void;
};

export default function CancelOrderModal({ open, orderId = "#FMD3213215", onClose, onConfirm }: Props) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");

  if (!open) return null;

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedReasons, note);
    setSelectedReasons([]);
    setNote("");
    onClose();
  };

  const handleClose = () => {
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
        className="w-[480px] bg-white rounded-2xl shadow-xl border border-[#D6DADD]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-[17px] font-semibold text-[#21272A]">Cancel Order?</h2>
          <p className="text-[13px] text-[#6B6F72] mt-1.5 leading-relaxed">
            You are about to cancel order{" "}
            <span className="text-[#1192E8] font-semibold">{orderId}</span>. Please provide a reason.
          </p>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-5">
          {/* Reasons */}
          <div>
            <p className="text-[13px] font-semibold text-[#21272A] mb-3">
              Select Reason for Cancellation.
            </p>
            <div className="flex flex-col gap-2.5">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(reason)}
                    onChange={() => toggleReason(reason)}
                    className="w-[15px] h-[15px] cursor-pointer accent-[#1E3862] rounded flex-shrink-0"
                  />
                  <span className="text-[13px] text-[#21272A] group-hover:text-[#1E3862] transition-colors">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-medium text-[#21272A]">Reason</p>
              <p className="text-[11px] text-[#6B6F72]">(Character Limit: 250)</p>
            </div>
            <textarea
              value={note}
              onChange={(e) => {
                if (e.target.value.length <= 250) setNote(e.target.value);
              }}
              placeholder="Please share your reason."
              rows={4}
              className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] resize-none leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-[13px] font-medium text-[#21272A] hover:text-[#6B6F72] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-[#DA1E28] hover:bg-[#b91c1c] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}