"use client";

import { useState } from "react";

interface CategoryRowActionsProps {
  rowId: string;
  onViewProducts: (rowId: string) => void;
  onEdit: (rowId: string) => void;
  onRemove: (rowId: string) => void;
}

export default function CategoryRowActions({
  rowId,
  onViewProducts,
  onEdit,
  onRemove,
}: CategoryRowActionsProps) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpenMenu((prev) => !prev)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-[#6B6F72] transition-colors hover:bg-gray-100"
        aria-label={`Actions for ${rowId}`}
      >
        ⋮
      </button>

      {openMenu && (
        <div className="absolute right-0 top-8 z-20 min-w-[176px] overflow-hidden rounded-xl border border-[#D6DADD] bg-white py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
          <button
            onClick={() => {
              setOpenMenu(false);
              onViewProducts(rowId);
            }}
            className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#6B6F72] transition-colors hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View Products
          </button>

          <button
            onClick={() => {
              setOpenMenu(false);
              onEdit(rowId);
            }}
            className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#6B6F72] transition-colors hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Edit Category
          </button>

          <button
            onClick={() => {
              setOpenMenu(false);
              onRemove(rowId);
            }}
            className="flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left text-[12px] text-[#DA1E28] transition-colors hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Remove Category
          </button>
        </div>
      )}
    </div>
  );
}
