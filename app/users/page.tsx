"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ExportDropdown from "../components/exportdropdown";
import FiltersModal from "../components/filterspanel";
import SuspendUserModal from "../components/suspenduser";
import ReactivateUserModal from "../components/reactivateuser";
import { INITIAL_USERS, type User, type UserStatus } from "./data";

type SortKey = "name" | "phone" | "joinedOn" | "orders" | "totalSpent" | "status";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [5, 10, 12, 25, 50];

const SortIcon = ({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) => (
  <span className="inline-flex flex-col leading-none opacity-40 flex-shrink-0">
    <span style={{ fontSize: "8px" }} className={sortKey === col && sortDir === "asc" ? "opacity-100 text-blue-500" : ""}>▲</span>
    <span style={{ fontSize: "8px" }} className={sortKey === col && sortDir === "desc" ? "opacity-100 text-blue-500" : ""}>▼</span>
  </span>
);

const IndeterminateCheckbox = ({
  checked, indeterminate, onChange,
}: { checked: boolean; indeterminate: boolean; onChange: () => void }) => {
  const ref = (el: HTMLInputElement | null) => { if (el) el.indeterminate = indeterminate; };
  return (
    <input type="checkbox" ref={ref} checked={checked} onChange={onChange}
      className="w-[15px] h-[15px] cursor-pointer accent-blue-500" />
  );
};

export default function UsersManagement() {
  const router = useRouter();
  // ── data (mutable so status changes reflect in UI) ──────────────────────────
  const [userData, setUserData] = useState<User[]>(INITIAL_USERS);

  // ── table state ──────────────────────────────────────────────────────────────
  const [search, setSearch]       = useState("");
  const [sortKey, setSortKey]     = useState<SortKey | null>(null);
  const [sortDir, setSortDir]     = useState<SortDir>("asc");
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(12);
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [openMenu, setOpenMenu]   = useState<number | null>(null);

  // ── modal state ──────────────────────────────────────────────────────────────
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);       // single
  const [reactivateTarget, setReactivateTarget] = useState<User | null>(null); // single
  const [bulkSuspendOpen, setBulkSuspendOpen]   = useState(false);
  const [bulkReactivateOpen, setBulkReactivateOpen] = useState(false);

  // ── helpers ──────────────────────────────────────────────────────────────────
  const updateStatus = (ids: number[], status: UserStatus) => {
    setUserData((prev) => prev.map((u) => ids.includes(u.id) ? { ...u, status } : u));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = [...userData];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (sortKey) {
      data.sort((a, b) => {
        if (sortKey === "orders" || sortKey === "totalSpent") {
          const av = Number(a[sortKey]), bv = Number(b[sortKey]);
          return sortDir === "asc" ? av - bv : bv - av;
        }
        return sortDir === "asc"
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
    }
    return data;
  }, [userData, search, sortKey, sortDir]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage    = Math.min(page, totalPages);
  const pageData    = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageIds     = pageData.map((u) => u.id);

  const allPageSelected  = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const somePageSelected = pageIds.some((id) => selected.has(id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const changePageSize = (dir: 1 | -1) => {
    const idx  = PAGE_SIZE_OPTIONS.indexOf(pageSize);
    const next = idx + dir;
    if (next >= 0 && next < PAGE_SIZE_OPTIONS.length) {
      setPageSize(PAGE_SIZE_OPTIONS[next]);
      setPage(1);
      setSelected(new Set());
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (safePage > 3) pages.push("...");
    const start = Math.max(2, safePage - 1);
    const end   = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  // ── selection bar logic ──────────────────────────────────────────────────────
  const selectedUsers  = userData.filter((u) => selected.has(u.id));
  const allActive      = selectedUsers.length > 0 && selectedUsers.every((u) => u.status === "Active");
  const allSuspended   = selectedUsers.length > 0 && selectedUsers.every((u) => u.status === "Suspended");
  const isMixed        = !allActive && !allSuspended;

  const showSuspendBtn    = selected.size > 0 && (allActive || isMixed);
  const showReactivateBtn = selected.size > 0 && (allSuspended || isMixed);

  const columns: { key: SortKey; label: string }[] = [
    { key: "name",       label: "User" },
    { key: "phone",      label: "Phone" },
    { key: "joinedOn",   label: "Joined On" },
    { key: "orders",     label: "Orders" },
    { key: "totalSpent", label: "Total Spent" },
    { key: "status",     label: "Status" },
  ];

  return (
    <div className="w-full font-inter" onClick={() => setOpenMenu(null)}>

      {/* ── Modals ── */}

      {/* Single suspend */}
      <SuspendUserModal
        open={suspendTarget !== null}
        userName={suspendTarget?.name}
        onClose={() => setSuspendTarget(null)}
        onConfirm={(reasons, note) => {
          if (suspendTarget) updateStatus([suspendTarget.id], "Suspended");
          setSuspendTarget(null);
        }}
      />

      {/* Single reactivate */}
      <ReactivateUserModal
        open={reactivateTarget !== null}
        userName={reactivateTarget?.name}
        onClose={() => setReactivateTarget(null)}
        onConfirm={() => {
          if (reactivateTarget) updateStatus([reactivateTarget.id], "Active");
          setReactivateTarget(null);
        }}
      />

      {/* Bulk suspend */}
      <SuspendUserModal
        open={bulkSuspendOpen}
        userName={`${selected.size} selected users`}
        onClose={() => setBulkSuspendOpen(false)}
        onConfirm={(reasons, note) => {
          updateStatus([...selected], "Suspended");
          setSelected(new Set());
          setBulkSuspendOpen(false);
        }}
      />

      {/* Bulk reactivate */}
      <ReactivateUserModal
        open={bulkReactivateOpen}
        userName={`${selected.size} selected users`}
        onClose={() => setBulkReactivateOpen(false)}
        onConfirm={() => {
          updateStatus([...selected], "Active");
          setSelected(new Set());
          setBulkReactivateOpen(false);
        }}
      />

      {/* ── Page Title ── */}
      <div className="mb-4">
        <h1 className="text-[18px] font-semibold text-black">Users Management</h1>
        <p className="text-[12px] font-medium text-[#6B6F72] mt-1">Manage and monitor all platform users</p>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border border-[#D6DADD] rounded-2xl overflow-hidden">

        {/* ── Toolbar: swaps between selection bar and search bar ── */}
        {selected.size > 0 ? (

          /* Selection Action Bar */
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] bg-[#F8FAFF]">
            {/* Left: count */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#1192E8] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                  fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-[#21272A]">
                {String(selected.size).padStart(2, "0")} Selection{selected.size > 1 ? "s" : ""}
              </span>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2">

              {/* Suspend Selection — shown when all Active or mixed */}
              {showSuspendBtn && (
                <button
                  onClick={() => setBulkSuspendOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#DA1E28] hover:bg-[#b91c1c] text-white rounded-lg text-[13px] font-medium transition-colors"
                >
                  Suspend Selection
                </button>
              )}

              {/* Reactivate Selection — shown when all Suspended or mixed */}
              {showReactivateBtn && (
                <button
                  onClick={() => setBulkReactivateOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#24A148] hover:bg-[#1a7a38] text-white rounded-lg text-[13px] font-medium transition-colors"
                >
                  Reactivate Selection
                </button>
              )}

              {/* Export Selection — always shown */}
              <button
                onClick={() => console.log("Export:", [...selected])}
                className="flex items-center gap-2 px-4 py-2 border border-[#D6DADD] bg-white hover:bg-gray-50 text-[#21272A] rounded-lg text-[13px] font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Selection
              </button>

              {/* Clear selection */}
              <button
                onClick={() => setSelected(new Set())}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
                title="Clear selection"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

            </div>
          </div>

        ) : (

          /* Normal Search + Filter Bar */
          <div className="flex items-center justify-between p-3 gap-4 border-b border-[#D6DADD]">
            <div className="relative w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6F72]"
                xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); setSelected(new Set()); }}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setFiltersOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filters
                </button>
                <FiltersModal
                  open={filtersOpen}
                  onClose={() => setFiltersOpen(false)}
                  onApply={(filters) => { console.log("Applied filters:", filters); }}
                />
              </div>
              <ExportDropdown />
            </div>
          </div>

        )}

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F0F6FF] border-b border-[#D6DADD]">
                <th className="w-11 px-4 py-3">
                  <IndeterminateCheckbox
                    checked={allPageSelected}
                    indeterminate={!allPageSelected && somePageSelected}
                    onChange={toggleAll}
                  />
                </th>
                {columns.map(({ key, label }) => (
                  <th key={key} onClick={() => handleSort(key)}
                    className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap">
                    <span className="flex items-center justify-between gap-3 text-[12px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                      <span>{label}</span>
                      <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#6B6F72] uppercase tracking-wide whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((user) => (
                <tr key={user.id}
                  className={`border-b border-[#D6DADD] last:border-b-0 transition-colors ${selected.has(user.id) ? "bg-blue-50" : "hover:bg-blue-50/30"}`}>

                  {/* Checkbox */}
                  <td className="px-4 py-3 w-11">
                    <input type="checkbox" checked={selected.has(user.id)} onChange={() => toggleRow(user.id)}
                      className="w-[15px] h-[15px] cursor-pointer accent-blue-500" />
                  </td>

                  {/* Name + Email */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: user.bgColor }}>
                        {user.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#21272A]">{user.name}</p>
                        <a href={`mailto:${user.email}`} className="text-[11px] text-[#1192E8] hover:underline">{user.email}</a>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[13px] text-[#1192E8]">{user.phone}</span>
                  </td>

                  {/* Joined On */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[13px] text-[#6B6F72]">{user.joinedOn}</span>
                  </td>

                  {/* Orders */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[13px] text-[#6B6F72]">{user.orders}</span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[13px] text-[#6B6F72]">€{user.totalSpent.toFixed(2)}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: user.status === "Active" ? "#24A148" : "#DA1E28" }} />
                      <span className="text-[13px] font-medium"
                        style={{ color: user.status === "Active" ? "#24A148" : "#DA1E28" }}>
                        {user.status}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] hover:text-[#21272A] transition-colors text-lg"
                    >
                      ⋮
                    </button>

                    {openMenu === user.id && (
                      <div className="absolute right-4 top-10 z-10 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1 min-w-[160px]">

                        {/* View Details */}
                        <button
                          onClick={() => {
                            setOpenMenu(null);
                            router.push(`/users/${user.id}`);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                            fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View Details
                        </button>

                        <div className="mx-3 border-t border-[#F0F2F4]" />

                        {/* Suspend / Reactivate */}
                        {user.status === "Suspended" ? (
                          <button
                            onClick={() => { setOpenMenu(null); setReactivateTarget(user); }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#24A148] hover:bg-green-50 transition-colors flex items-center gap-2.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                              fill="none" stroke="#24A148" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                              <polyline points="16 11 18 13 22 9" />
                            </svg>
                            Reactivate User
                          </button>
                        ) : (
                          <button
                            onClick={() => { setOpenMenu(null); setSuspendTarget(user); }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#F59E0B] hover:bg-amber-50 transition-colors flex items-center gap-2.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                              fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                              <line x1="10" y1="14" x2="10" y2="20" />
                              <line x1="14" y1="14" x2="14" y2="20" />
                            </svg>
                            Suspend User
                          </button>
                        )}

                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#D6DADD] flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[12px] text-[#6B6F72]">
            <span>Page Entries</span>
            <div className="flex items-center border border-[#D6DADD] rounded-lg overflow-hidden">
              <span className="px-3 py-1.5 text-[12px] text-[#21272A]">{pageSize}</span>
              <div className="flex flex-col border-l border-[#D6DADD]">
                <button onClick={() => changePageSize(1)}  className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72]">▲</button>
                <button onClick={() => changePageSize(-1)} className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72] border-t border-[#D6DADD]">▼</button>
              </div>
            </div>
            <span className="text-[#A8AAAC]">
              {filtered.length === 0 ? "0" : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)}`} of {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-[#D6DADD] text-[#6B6F72] hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm">‹</button>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="text-[#6B6F72] text-[12px] px-1">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p as number)}
                  className="w-7 h-7 flex items-center justify-center rounded text-[12px] transition-colors"
                  style={{
                    backgroundColor: safePage === p ? "#1192E8" : "transparent",
                    color: safePage === p ? "#fff" : "#6B6F72",
                    border: safePage === p ? "none" : "1px solid #D6DADD",
                  }}>
                  {p}
                </button>
              )
            )}

            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded border border-[#D6DADD] text-[#6B6F72] hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm">›</button>
          </div>
        </div>

      </div>
    </div>
  );
}
