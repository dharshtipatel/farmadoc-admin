"use client";

type SellerStatus = "Active" | "Inactive" | "Suspended";

type Props = {
  open: boolean;
  status: SellerStatus;
  onClose: () => void;
  onViewDetails: () => void;
  onEditDetails: () => void;
  onUpgradeShowroom?: () => void;
  onDowngradePharmacy?: () => void;
  onMarkInactive?: () => void;
  onMarkActive?: () => void;
  onSuspend?: () => void;
  onReactivate?: () => void;
};

export default function SellerActionMenu({
  open, status, onClose,
  onViewDetails, onEditDetails,
  onUpgradeShowroom, onDowngradePharmacy,
  onMarkInactive, onMarkActive,
  onSuspend, onReactivate,
}: Props) {
  if (!open) return null;

  const item = (
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
    color = "#21272A",
    hoverBg = "hover:bg-gray-50"
  ) => (
    <button
      onClick={() => { onClick(); onClose(); }}
      className={`w-full text-left px-4 py-2.5 text-[13px] ${hoverBg} transition-colors flex items-center gap-2.5 whitespace-nowrap`}
      style={{ color }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const Divider = () => <div className="mx-3 border-t border-[#F0F2F4]" />;

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  const ShowroomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );

  const InactiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <circle cx="12" cy="12" r="10"/>
      <line x1="10" y1="15" x2="10" y2="9"/>
      <line x1="14" y1="15" x2="14" y2="9"/>
    </svg>
  );

  const SuspendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  );

  const ActiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#24A148" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <path d="M18.364 5.636A9 9 0 1 1 5.636 18.364 9 9 0 0 1 18.364 5.636"/>
      <polyline points="9 11 12 14 22 4"/>
    </svg>
  );

  const ReactivateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#24A148" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  );

  const DowngradeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="14" viewBox="0 0 48 24"
      fill="none" className="flex-shrink-0">
      <rect x="0" y="4" width="28" height="16" rx="8" fill="#1192E8"/>
      <circle cx="20" cy="12" r="6" fill="white"/>
    </svg>
  );

  return (
    <div className="absolute right-4 top-10 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 w-max">

      {/* Always shown */}
      {item(onViewDetails, <EyeIcon />, "View Details")}
      <Divider />
      {item(onEditDetails, <EditIcon />, "Edit Details")}
      <Divider />

      {/* ── Active seller ── */}
      {status === "Active" && (
        <>
          {item(
            () => { (onUpgradeShowroom ?? (() => {}))(); },
            <ShowroomIcon />,
            "Upgrade to Showroom"
          )}
          <Divider />
          {item(
            () => { (onMarkInactive ?? (() => {}))(); },
            <InactiveIcon />,
            "Mark Inactive"
          )}
          <Divider />
          {item(
            () => { (onSuspend ?? (() => {}))(); },
            <SuspendIcon />,
            "Suspend Seller",
            "#DA1E28",
            "hover:bg-red-50"
          )}
        </>
      )}

      {/* ── Inactive seller ── */}
      {status === "Inactive" && (
        <>
          <button
            onClick={() => { (onDowngradePharmacy ?? (() => {}))(); onClose(); }}
            className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2.5 whitespace-nowrap"
            style={{ color: "#21272A" }}
          >
            <DowngradeIcon />
            <span>Downgrade to Pharmacy</span>
          </button>
          <Divider />
          {item(
            () => { (onMarkActive ?? (() => {}))(); },
            <ActiveIcon />,
            "Mark Active",
            "#24A148",
            "hover:bg-green-50"
          )}
        </>
      )}

      {/* ── Suspended seller ── */}
      {status === "Suspended" && (
        <>
          <button
            onClick={() => { (onDowngradePharmacy ?? (() => {}))(); onClose(); }}
            className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2.5 whitespace-nowrap"
            style={{ color: "#21272A" }}
          >
            <DowngradeIcon />
            <span>Downgrade to Pharmacy</span>
          </button>
          <Divider />
          {item(
            () => { (onReactivate ?? (() => {}))(); },
            <ReactivateIcon />,
            "Reactivate Seller",
            "#24A148",
            "hover:bg-green-50"
          )}
        </>
      )}

    </div>
  );
}