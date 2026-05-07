"use client";

import { Offer, OfferActionType } from "./types";

export default function OffersActionModal({
  open,
  actionType,
  target,
  onClose,
  onConfirm,
}: {
  open: boolean;
  actionType: OfferActionType | null;
  target: Offer | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open || !actionType || !target) {
    return null;
  }

  const copy = {
    activate: {
      title: "Mark Offer Active?",
      description:
        "Are you sure you want to mark this Offer active. It will be visible to customers on the platform and will apply again based on its configured scope.",
      button: "Confirm Activate",
      buttonClassName: "bg-[#24A148] hover:bg-[#1c7d38]",
    },
    inactivate: {
      title: "Mark Offer Inactive?",
      description:
        "Are you sure you want to inactivate this Offer? Once inactive, the offer will no longer be visible on the platform and will stop applying to eligible products, categories, or sellers.",
      button: "Confirm Inactive",
      buttonClassName: "bg-[#DA1E28] hover:bg-[#b81922]",
    },
    renew: {
      title: "Renew Offer?",
      description:
        "Are you sure you want to permanently renew this offer? This offer will replace the same offer on the platform and will no longer appear as expired after renewal.",
      button: "Confirm Renew Offer",
      buttonClassName: "bg-[#DA1E28] hover:bg-[#b81922]",
    },
    remove: {
      title: "Remove Offer?",
      description: "This action will remove the offer from the system. This cannot be undone.",
      button: "Confirm Remove",
      buttonClassName: "bg-[#DA1E28] hover:bg-[#b81922]",
    },
  }[actionType];

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto relative isolate w-full max-w-[560px] overflow-hidden rounded-md border border-[#E8EAED] bg-white opacity-100 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-0">
          <div className="px-6 py-5">
            <h3 className="text-[20px] font-semibold text-[#21272A]">{copy.title}</h3>
            <p className="mt-4 max-w-[470px] text-[13px] leading-6 text-[#6B6F72]">
              {copy.description}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-[12px] font-medium text-[#21272A] hover:bg-[#F5F7FA]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-md px-4 py-2 text-[12px] font-medium text-white ${copy.buttonClassName}`}
            >
              {copy.button}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
