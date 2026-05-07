"use client";

type ProductActionType = "inactivate" | "activate" | "remove";

interface ProductActionModalProps {
  open: boolean;
  actionType: ProductActionType | null;
  isBulk: boolean;
  isInventory?: boolean;
  itemLabel?: string;
  copyVariant?: "default" | "servicesInventory" | "serviceDetailsInventory";
  onClose: () => void;
  onConfirm: () => void;
}

const CONFIG = {
  inactivate: {
    title: (bulk: boolean, isInventory: boolean, itemLabel: string, copyVariant: "default" | "servicesInventory" | "serviceDetailsInventory") =>
      copyVariant === "serviceDetailsInventory"
        ? bulk ? "Inactivate Service for Selected Sellers?" : "Inactivate Service?"
        : 
      copyVariant === "servicesInventory"
        ? bulk ? "Inactivate Services?" : "Inactivate Service?"
        : isInventory
        ? `Inactivate ${itemLabel} for Selected Sellers?`
        : bulk ? `Inactivate ${itemLabel}s?` : `Inactivate ${itemLabel}?`,
    description: (bulk: boolean, isInventory: boolean, itemLabel: string, copyVariant: "default" | "servicesInventory" | "serviceDetailsInventory") =>
      copyVariant === "serviceDetailsInventory"
        ? bulk
          ? "This will hide only the selected sellers and remove this service from their active listings. The service will remain available in the master inventory and for all other sellers."
          : "This will hide this service for the selected seller only. The service will remain available in the master inventory and for all other sellers."
        :
      copyVariant === "servicesInventory"
        ? bulk
          ? "Selected Services will no longer be visible or available across all sellers. This action will affect all linked seller-specific (child) Services. You can activate them again anytime."
          : "This Service will no longer be visible or available across all sellers. This action will affect all seller-specific (child) Service linked to it. You can activate it again anytime."
        : isInventory
        ? `This ${itemLabel.toLowerCase()} will no longer be visible or available for the selected sellers. This action only affects these sellers and does not impact the master ${itemLabel.toLowerCase()} or other sellers.`
        : bulk
        ? `Selected ${itemLabel.toLowerCase()}s will no longer be visible or available for this seller. You can Activate these ${itemLabel.toLowerCase()}s anytime.`
        : `This ${itemLabel.toLowerCase()} will no longer be visible or available for this seller. You can Activate this ${itemLabel.toLowerCase()} anytime.`,
    confirmLabel: "Confirm Inactivate",
    confirmStyle: "bg-[#DA1E28] hover:bg-[#b91c1c] text-white",
  },
  activate: {
    title: (bulk: boolean, isInventory: boolean, itemLabel: string, copyVariant: "default" | "servicesInventory" | "serviceDetailsInventory") =>
      copyVariant === "serviceDetailsInventory"
        ? bulk ? "Activate Service for Selected Sellers?" : "Activate Service?"
        :
      copyVariant === "servicesInventory"
        ? bulk ? "Activate Services?" : "Activate Service?"
        : bulk ? `Activate ${itemLabel}s?` : `Activate ${itemLabel}?`,
    description: (bulk: boolean, isInventory: boolean, itemLabel: string, copyVariant: "default" | "servicesInventory" | "serviceDetailsInventory") =>
      copyVariant === "serviceDetailsInventory"
        ? bulk
          ? "This will make the service visible again for the selected sellers only. It does not change the master service or other sellers."
          : "This will make the service visible again for the selected seller only. It does not change the master service or other sellers."
        :
      copyVariant === "servicesInventory"
        ? bulk
          ? "Selected Services will become visible and available across all sellers. This will also activate all linked seller-specific (child) Services."
          : "This Service will become visible and available across all sellers. This will also activate all linked seller-specific (child) Services."
        : bulk
        ? `Selected ${itemLabel.toLowerCase()}s will be visible and available for this seller.`
        : `This ${itemLabel.toLowerCase()} will be visible and available for this seller.`,
    confirmLabel: "Confirm Activate",
    confirmStyle: "bg-[#24A148] hover:bg-[#1a7a38] text-white",
  },
  remove: {
    title: (bulk: boolean, isInventory: boolean, itemLabel: string, copyVariant: "default" | "servicesInventory" | "serviceDetailsInventory") =>
      copyVariant === "serviceDetailsInventory"
        ? bulk ? "Remove Service from Selected Sellers?" : "Remove Service?"
        :
      copyVariant === "servicesInventory"
        ? bulk ? "Remove Services?" : "Remove Service?"
        : isInventory
        ? `Remove ${itemLabel} from Selected Sellers?`
        : bulk ? `Remove ${itemLabel}s?` : `Remove ${itemLabel}?`,
    description: (bulk: boolean, isInventory: boolean, itemLabel: string, copyVariant: "default" | "servicesInventory" | "serviceDetailsInventory") =>
      copyVariant === "serviceDetailsInventory"
        ? bulk
          ? "This will remove the service only from the selected sellers. It will remain available in the master inventory and can still be assigned to other sellers."
          : "This will remove the service only from the selected seller. It will remain available in the master inventory and can still be assigned to other sellers."
        :
      copyVariant === "servicesInventory"
        ? bulk
          ? "Selected Services will be permanently removed from the master inventory. All linked seller-specific (child) Services will also be removed from sellers."
          : "This will permanently remove the Service from the master inventory. All linked seller-specific (child) Service will also be removed from sellers."
        : isInventory
        ? `This will remove the ${itemLabel.toLowerCase()} from the selected sellers. It will remain available in the master inventory and for other sellers.`
        : bulk
        ? `Selected ${itemLabel.toLowerCase()}s will be removed from this seller. These will not be deleted from the master catalog.`
        : `This will remove the ${itemLabel.toLowerCase()} from this seller. It will not be deleted from the master catalog.`,
    confirmLabel: "Confirm Remove",
    confirmStyle: "bg-[#DA1E28] hover:bg-[#b91c1c] text-white",
  },
};

export default function ProductActionModal({
  open, actionType, isBulk, isInventory = false, itemLabel = "Product", copyVariant = "default", onClose, onConfirm,
}: ProductActionModalProps) {
  if (!open || !actionType) return null;

  const config = CONFIG[actionType];

  return (
    <>
      <div className="fixed inset-0 bg-black/85 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-[16px] font-bold text-[#21272A] mb-2">
            {config.title(isBulk, isInventory, itemLabel, copyVariant)}
          </h2>
          <p className="text-[13px] text-[#6B6F72] leading-relaxed mb-6">
            {config.description(isBulk, isInventory, itemLabel, copyVariant)}
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
