"use client";

type ProductActionType = "inactivate" | "activate" | "remove";

interface ProductActionModalProps {
  open: boolean;
  actionType: ProductActionType | null;
  isBulk: boolean;
  itemLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CONFIG = {
  inactivate: {
    title: (bulk: boolean) => bulk ? "Inactivate Products?" : "Inactivate Product?",
    description: (bulk: boolean) => bulk
      ? "Selected products will no longer be visible or available for this seller. You can Activate these products anytime."
      : "This product will no longer be visible or available for this seller. You can Activate this product anytime.",
    confirmLabel: "Confirm Inactivate",
    confirmStyle: "bg-[#DA1E28] hover:bg-[#b91c1c] text-white",
  },
  activate: {
    title: (bulk: boolean) => bulk ? "Activate Products?" : "Activate Product?",
    description: (bulk: boolean) => bulk
      ? "Selected products will be visible and available for this seller."
      : "This product will be visible and available for this seller.",
    confirmLabel: "Confirm Activate",
    confirmStyle: "bg-[#24A148] hover:bg-[#1a7a38] text-white",
  },
  remove: {
    title: (bulk: boolean) => bulk ? "Remove Products?" : "Remove Product?",
    description: (bulk: boolean) => bulk
      ? "Selected products will be removed from this seller. These will not be deleted from the master catalog."
      : "This will remove the product from this seller. It will not be deleted from the master catalog.",
    confirmLabel: "Confirm Remove",
    confirmStyle: "bg-[#DA1E28] hover:bg-[#b91c1c] text-white",
  },
  title: (bulk: boolean, label: string) => bulk ? `Inactivate ${label}s?` : `Inactivate ${label}?`,
};

export default function ProductActionModal({
  open, actionType, isBulk, onClose, onConfirm,
}: ProductActionModalProps) {
  if (!open || !actionType) return null;

  const config = CONFIG[actionType];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-[16px] font-bold text-[#21272A] mb-2">
            {config.title(isBulk)}
          </h2>
          <p className="text-[13px] text-[#6B6F72] leading-relaxed mb-6">
            {config.description(isBulk)}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-[13px] font-medium text-[#21272A] hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-colors ${config.confirmStyle}`}
            >
              {config.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}