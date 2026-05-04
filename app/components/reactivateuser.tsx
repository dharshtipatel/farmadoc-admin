"use client";

type Props = {
  open: boolean;
  userName?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ReactivateUserModal({ open, userName, onClose, onConfirm }: Props) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <div
        className="w-[560px] bg-white rounded-2xl shadow-xl border border-[#D6DADD] px-6 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-semibold text-black font-inter mb-2">Reactivate User</h2>
        <p className="text-[14px] font-medium font-inter text-[#6B6F72] leading-relaxed mb-6">
          Are you sure you want to reactivate{userName ? ` ${userName}'s` : " this User's"} account?
          This will allow User to access the Platform.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] font-medium text-black font-medium font-helvetica hover:text-[#6B6F72] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-[#24A148] hover:bg-[#1a7a38] font-medium font-helvetica text-white rounded-lg text-[14px] font-medium transition-colors"
          >
            Confirm Reactivate
          </button>
        </div>
      </div>
    </div>
  );
}