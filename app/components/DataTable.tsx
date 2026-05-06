"use client";

import { useState, useMemo, useRef, useEffect, ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  renderRowActions?: (row: T) => ReactNode;
  onBulkAction?: (action: string, selectedIds: (string | number)[]) => void;
  bulkActions?: { label: string; value: string; icon?: ReactNode; color?: string }[];
  renderBulkActionBar?: (selectedCount: number, onClear: () => void) => ReactNode;
  pageSize?: number;
  showCheckboxes?: boolean;
  headerBackground?: string;
  onRowClick?: (row: T) => void;
  customFilter?: (row: T, query: string) => boolean;
  toolbarRight?: ReactNode;
}

type SortKey = string | null;
type SortDir = "asc" | "desc";

const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
  <span className="inline-flex flex-col leading-none opacity-40 flex-shrink-0">
    <span style={{ fontSize: "7px" }} className={active && dir === "asc" ? "opacity-100 text-blue-500" : ""}>▲</span>
    <span style={{ fontSize: "7px" }} className={active && dir === "desc" ? "opacity-100 text-blue-500" : ""}>▼</span>
  </span>
);

const IndeterminateCheckbox = ({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) => {
  const ref = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = indeterminate;
  };
  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={onChange}
      className="w-[15px] h-[15px] cursor-pointer accent-blue-500"
    />
  );
};

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  searchFields = [],
  searchPlaceholder = "Search here...",
  onSearch,
  renderRowActions,
  onBulkAction,
  bulkActions = [],
  renderBulkActionBar,
  pageSize: initialPageSize = 12,
  showCheckboxes = true,
  headerBackground = "#F0F6FF",
  onRowClick,
  customFilter,
  toolbarRight,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageSizeInput, setPageSizeInput] = useState(String(initialPageSize));
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [openMenu, setOpenMenu] = useState<string | number | null>(null);
  const [actionOpen, setActionOpen] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setActionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = (key: string) => {
    const column = columns.find((c) => c.key === key);
    if (!column?.sortable) return;
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...data];

    if (search && searchFields.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((row) => {
        if (customFilter) return customFilter(row, q);
        return searchFields.some((field) => {
          const value = row[field];
          return String(value).toLowerCase().includes(q);
        });
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, search, sortKey, sortDir, searchFields, customFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageIds = pageData.map((row) => rowKey(row));

  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const somePageSelected = pageIds.some((id) => selected.has(id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleRow = (id: string | number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (safePage > 3) pages.push("...");
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="w-full font-inter" onClick={() => setOpenMenu(null)}>
      <div className="bg-white border border-[#D6DADD] rounded-2xl overflow-hidden">
        {/* ── Toolbar ── */}
        {selected.size > 0 ? (
          renderBulkActionBar ? (
            renderBulkActionBar(selected.size, () => setSelected(new Set()))
          ) : (
            /* Default Bulk Action Bar */
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] gap-4 bg-[#F8FAFF]">
              <div className="relative w-56">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AAAC]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                    onSearch?.(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                {bulkActions.length > 0 && (
                  <div className="relative" ref={actionRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionOpen((prev) => !prev);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#1192E8] border border-[#1192E8] rounded-lg hover:bg-blue-50 transition-colors bg-white"
                    >
                      Action
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {actionOpen && (
                      <div className="absolute left-0 top-10 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[180px]">
                        {bulkActions.map((action, idx) => (
                          <div key={action.value}>
                            {idx > 0 && <div className="mx-3 border-t border-[#F0F2F4]" />}
                            <button
                              onClick={() => {
                                setActionOpen(false);
                                onBulkAction?.(action.value, Array.from(selected));
                              }}
                              className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2.5 ${
                                action.color ? action.color : "text-[#21272A]"
                              }`}
                            >
                              {action.icon && <span>{action.icon}</span>}
                              <span>{action.label}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setSelected(new Set())}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )
        ) : (
          /* Normal Search Bar */
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] gap-4">
            <div className="relative w-56">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AAAC]"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  setSelected(new Set());
                  onSearch?.(e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
              />
            </div>
            {/* 👇 only renders when passed, zero impact on other pages */}
            {toolbarRight && (
              <div className="flex items-center gap-2">
                {toolbarRight}
              </div>
            )}
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D6DADD]" style={{ backgroundColor: headerBackground }}>
                {showCheckboxes && (
                  <th className="w-11 px-4 py-3">
                    <IndeterminateCheckbox
                      checked={allPageSelected}
                      indeterminate={!allPageSelected && somePageSelected}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`px-4 py-3 text-left ${col.sortable ? "cursor-pointer select-none" : ""} whitespace-nowrap`}
                    style={{ width: col.width }}
                  >
                    <span className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                      {col.label}
                      {col.sortable && <SortIcon active={sortKey === col.key} dir={sortDir} />}
                    </span>
                  </th>
                ))}
                {renderRowActions && (
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide whitespace-nowrap">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => {
                const rowId = rowKey(row);
                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-[#D6DADD] last:border-b-0 transition-colors ${
                      selected.has(rowId) ? "bg-blue-50" : "hover:bg-blue-50/30"
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {showCheckboxes && (
                      <td className="px-4 py-3 w-11" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(rowId)}
                          onChange={() => toggleRow(rowId)}
                          className="w-[15px] h-[15px] cursor-pointer accent-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={`${rowId}-${col.key}`} className="px-4 py-3" style={{ width: col.width }}>
                        {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] || "")}
                      </td>
                    ))}
                    {renderRowActions && (
                      <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                        {renderRowActions(row)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#D6DADD] flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[12px] text-[#6B6F72]">
            <span>Page Entries</span>
            <div className="flex items-center border border-[#D6DADD] rounded-lg overflow-hidden">
              <input
                type="text"
                inputMode="numeric"
                value={pageSizeInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "" || /^\d+$/.test(raw)) {
                    setPageSizeInput(raw);
                    const val = parseInt(raw);
                    if (!isNaN(val) && val >= 1 && val <= 100) {
                      setPageSize(val);
                      setPage(1);
                    }
                  }
                }}
                onBlur={() => {
                  const val = parseInt(pageSizeInput);
                  if (isNaN(val) || val < 1) setPageSizeInput(String(pageSize));
                }}
                className="w-12 px-2 py-1.5 text-[12px] text-[#21272A] text-center outline-none bg-white"
              />
              <div className="flex flex-col border-l border-[#D6DADD]">
                <button
                  onClick={() => {
                    const n = pageSize + 1;
                    if (n <= 100) {
                      setPageSize(n);
                      setPageSizeInput(String(n));
                      setPage(1);
                    }
                  }}
                  className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72]"
                >
                  ▲
                </button>
                <button
                  onClick={() => {
                    const n = pageSize - 1;
                    if (n >= 1) {
                      setPageSize(n);
                      setPageSizeInput(String(n));
                      setPage(1);
                    }
                  }}
                  className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72] border-t border-[#D6DADD]"
                >
                  ▼
                </button>
              </div>
            </div>
            <span className="text-[#A8AAAC]">
              {filtered.length === 0
                ? "0"
                : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)}`}{" "}
              of {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-[#D6DADD] text-[#6B6F72] hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm"
            >
              ‹
            </button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="text-[#6B6F72] text-[12px] px-1">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className="w-7 h-7 flex items-center justify-center rounded text-[12px] transition-colors"
                  style={{
                    backgroundColor: safePage === p ? "#1192E8" : "transparent",
                    color: safePage === p ? "#fff" : "#6B6F72",
                    border: safePage === p ? "none" : "1px solid #D6DADD",
                  }}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded border border-[#D6DADD] text-[#6B6F72] hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
