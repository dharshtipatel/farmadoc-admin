"use client";

import { useState } from "react";

const SUSPENSION_REASONS = [
  "Suspicious activity detected",
  "Multiple order violations",
  "Misuse of platform offers",
  "Abusive behavior / policy violation",
  "Customer request",
  "Fake or incomplete information",
  "Other",
];

type Props = {
  open: boolean;
  userName?: string;
  onClose: () => void;
  onConfirm: (reasons: string[], note: string) => void;
};

export default function SuspendUserModal({ open, userName, onClose, onConfirm }: Props) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={handleClose}
    >
      <div
        className="w-[560px] bg-white rounded-2xl shadow-xl border border-[#D6DADD]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-[18px] font-semibold font-inter text-black">Suspend User?</h2>
          <p className="text-[14px] font-medium font-inter text-[#6B6F72] mt-1.5 leading-relaxed">
            Are you sure you want to suspend{userName ? ` ${userName}'s` : " this User's"} account?
            This will prevent User from access Platform.
          </p>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-5">
          {/* Reasons */}
          <div>
            <p className="text-[16px] font-semibold font-inter text-black mb-3">
              Select Reason for Suspension
            </p>
            <div className="flex flex-col gap-2.5">
              {SUSPENSION_REASONS.map((reason) => (
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
                  <span className="text-[14px] text-black group-hover:text-[#1E3862] transition-colors font-medium font-inter">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[14px] font-medium font-inter text-[#6B6F72]">Reason</p>
              <p className="text-[12px] font-medium font-inter text-[#6B6F72]">(Character Limit: 250)</p>
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
              className="px-5 py-2.5 text-[14px] font-helvetica font-medium text-black hover:text-[#6B6F72] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-[#DA1E28] hover:bg-[#b91c1c] text-white rounded-lg text-[14px] font-medium transition-colors"
            >
              Confirm Suspend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}