"use client";

import { useState } from "react";

const REJECT_REASONS = [
  "Incomplete application",
  "Invalid license or documentation",
  "Location not serviceable",
  "Duplicate application",
  "Failed background verification",
  "Other",
];

interface RejectPharmacyModalProps {
  open: boolean;
  isBulk: boolean;
  selectedCount?: number;
  onClose: () => void;
  onConfirm: (reasons: string[], note: string) => void;
}

export default function RejectPharmacyModal({
  open,
  isBulk,
  selectedCount = 1,
  onClose,
  onConfirm,
}: RejectPharmacyModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");

  if (!open) return null;

  const toggleReason = (r: string) =>
    setSelectedReasons((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const handleClose = () => {
    setSelectedReasons([]);
    setNote("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(selectedReasons, note);
    setSelectedReasons([]);
    setNote("");
  };

  const title = isBulk
    ? "Reject Selected Pharmacy Requests?"
    : "Reject Pharmacy Request?";

  const description = isBulk
    ? `You are about to reject ${selectedCount} selected pharmacy requests. Please provide a reason for rejection.`
    : "You are about to reject this pharmacy request. Please provide a reason for rejection.";

  const confirmLabel = isBulk
    ? "Reject All"
    : "Reject Request";

  return (
    <>
      <div className="fixed inset-0 bg-black/85 z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-[460px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h2 className="text-[17px] font-semibold text-[#21272A] mb-1">{title}</h2>
          <p className="text-[13px] text-[#6B6F72] mb-4 leading-relaxed">{description}</p>

          {/* Reasons */}
          <p className="text-[13px] font-semibold text-[#21272A] mb-3">
            Select Reason for Rejection.
          </p>
          <div className="flex flex-col gap-2.5 mb-4">
            {REJECT_REASONS.map((reason) => (
              <label key={reason} className="flex items-center gap-2.5 cursor-pointer group">
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

          {/* Note */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[13px] font-medium text-[#21272A]">Reason</p>
              <p className="text-[11px] text-[#6B6F72]">(Character Limit: 250)</p>
            </div>
            <textarea
              value={note}
              onChange={(e) => { if (e.target.value.length <= 250) setNote(e.target.value); }}
              placeholder="Please share your reason."
              rows={4}
              className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
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
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}