"use client";

import { Offer, OfferActionType } from "./types";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10" />
    <path d="M20.49 15A9 9 0 0 1 6.36 18.36L1 14" />
  </svg>
);

const ToggleIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    {active ? <path d="M8 12h8" /> : <path d="M12 8v8M8 12h8" />}
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const MoreVerticalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export default function OffersRowActions({
  offer,
  open,
  onToggle,
  onView,
  onEdit,
  onAction,
}: {
  offer: Offer;
  open: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onAction: (action: OfferActionType) => void;
}) {
  const handleActionClick = (action: OfferActionType) => {
    onAction(action);
  };

  return (
    <div className="relative" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={onToggle}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#6B6F72] transition-colors hover:bg-gray-100"
      >
        <MoreVerticalIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 min-w-[164px] overflow-hidden rounded-xl border border-[#D6DADD] bg-white py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={onView}
            className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#6B6F72] transition-colors hover:bg-gray-50"
          >
            <EyeIcon />
            View Offer
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#6B6F72] transition-colors hover:bg-gray-50"
          >
            <EditIcon />
            Edit Offer
          </button>
          {offer.status === "Inactive" && (
            <button
              type="button"
              onClick={() => handleActionClick("activate")}
              className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#24A148] transition-colors hover:bg-green-50"
            >
              <ToggleIcon active={false} />
              Mark Active
            </button>
          )}
          {offer.status === "Active" && (
            <button
              type="button"
              onClick={() => handleActionClick("inactivate")}
              className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#6B6F72] transition-colors hover:bg-gray-50"
            >
              <ToggleIcon active={true} />
              Mark Inactive
            </button>
          )}
          {offer.status === "Scheduled" && (
            <button
              type="button"
              onClick={() => handleActionClick("activate")}
              className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#24A148] transition-colors hover:bg-green-50"
            >
              <ToggleIcon active={false} />
              Mark Active
            </button>
          )}
          {offer.status === "Expired" && (
            <button
              type="button"
              onClick={() => handleActionClick("renew")}
              className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#24A148] transition-colors hover:bg-green-50"
            >
              <RefreshIcon />
              Renew Offer
            </button>
          )}
          <button
            type="button"
            onClick={() => handleActionClick("remove")}
            className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#DA1E28] transition-colors hover:bg-red-50"
          >
            <TrashIcon />
            Remove Offer
          </button>
        </div>
      )}
    </div>
  );
}
