"use client";

import { CategoryNode } from "./types";

type CategoryActionType = "activate" | "inactivate" | "remove";

interface CategoryActionModalProps {
  open: boolean;
  actionType: CategoryActionType | null;
  category: CategoryNode | null;
  onClose: () => void;
  onConfirm: () => void;
}

const COPY: Record<
  CategoryActionType,
  { title: string; description: string; button: string; buttonClassName: string }
> = {
  inactivate: {
    title: "Inactivate Category?",
    description:
      "Are you sure you want to inactivate this category? All products associated with this category will also be marked as inactive and will no longer be visible to users.",
    button: "Confirm Inactivate",
    buttonClassName: "bg-[#DA1E28] hover:bg-[#B81922]",
  },
  activate: {
    title: "Activate Category?",
    description:
      "Are you sure you want to activate this category? All associated products will also be activated and made available on the platform.",
    button: "Confirm Activate",
    buttonClassName: "bg-[#24A148] hover:bg-[#1D8A3D]",
  },
  remove: {
    title: "Remove Category?",
    description:
      "Are you sure you want to remove this category? All products associated with this category will also be removed from the platform. This action cannot be undone.",
    button: "Confirm Remove",
    buttonClassName: "bg-[#DA1E28] hover:bg-[#B81922]",
  },
};

export default function CategoryActionModal({
  open,
  actionType,
  category,
  onClose,
  onConfirm,
}: CategoryActionModalProps) {
  if (!open || !actionType || !category) {
    return null;
  }

  const content = COPY[actionType];

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center px-4 pointer-events-none">
        <div
          className="pointer-events-auto relative isolate w-full max-w-[560px] overflow-hidden rounded-md border border-[#E8EAED] bg-white opacity-100 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-0"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-6 py-5">
            <h3 className="text-[20px] font-semibold text-[#21272A]">{content.title}</h3>
            <p className="mt-4 max-w-[470px] text-[13px] leading-6 text-[#6B6F72]">
              {content.description}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-[12px] font-medium text-[#21272A] transition-colors hover:bg-[#F5F7FA]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-md px-4 py-2 text-[12px] font-medium text-white transition-colors ${content.buttonClassName}`}
            >
              {content.button}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
