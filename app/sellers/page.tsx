"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import SellerFiltersPanel from "../components/sellers/SellerFiltersPanel";
import SellerActionMenu from "../components/sellers/SellerActionMenu";
import ExportDropdown from "../components/exportdropdown";
import AddSellerDrawer from "@/app/components/sellers/AddSellerDrawer";
import ImportSellersModal from "../components/sellers/ImportSeller";
import SellerBulkActionModal from "../components/sellers/SellerBulkActionModal";

type SellerStatus = "Active" | "Inactive" | "Suspended";
type FeatureTag = "Showroom" | "Service" | "Pharmacy";

interface Seller {
  id: number;
  name: string;
  img: string;
  isPremium: boolean;
  location: string;
  email: string;
  phone: string;
  features: FeatureTag[];
  joinedOn: string;
  orders: number;
  status: SellerStatus;
}

const SELLERS: Seller[] = [
  { id: 1,  name: "City Pharmacy",      img: `https://ui-avatars.com/api/?name=City+Pharmacy&background=6366F1&color=fff&size=36`,      isPremium: true,  location: "Via Cremona, 25, Bozzolo Mantova,46001..", email: "pharmacy@city.com",         phone: "+39 123 4567890", features: ["Showroom", "Service"], joinedOn: "24-04-2026", orders: 24, status: "Active"    },
  { id: 2,  name: "Health Hub",         img: `https://ui-avatars.com/api/?name=Health+Hub&background=10B981&color=fff&size=36`,          isPremium: true,  location: "Piazza della Repubblica, 12, Milano, 20124.", email: "hospital@city.com",        phone: "+39 234 5678901", features: ["Showroom"],            joinedOn: "25-04-2026", orders: 25, status: "Inactive"  },
  { id: 3,  name: "Wellness Corner",    img: `https://ui-avatars.com/api/?name=Wellness+Corner&background=F59E0B&color=fff&size=36`,     isPremium: false, location: "Corso Italia, 45, Firenze, 50123.",            email: "clinic@city.com",          phone: "+39 345 6789012", features: ["Pharmacy"],            joinedOn: "26-04-2026", orders: 26, status: "Suspended" },
  { id: 4,  name: "Urban Care",         img: `https://ui-avatars.com/api/?name=Urban+Care&background=3B82F6&color=fff&size=36`,          isPremium: false, location: "Via Roma, 90, Torino, 10121.",                  email: "doctor@city.com",          phone: "+39 678 9012345", features: ["Pharmacy"],            joinedOn: "27-04-2026", orders: 27, status: "Active"    },
  { id: 5,  name: "PharmaPlus",         img: `https://ui-avatars.com/api/?name=Pharma+Plus&background=8B5CF6&color=fff&size=36`,         isPremium: true,  location: "Viale dei Mille, 14, Bologna, 40121.",          email: "dentlist@city.com",        phone: "+39 567 8901234", features: ["Showroom", "Service"], joinedOn: "28-04-2026", orders: 28, status: "Active"    },
  { id: 6,  name: "Rx Solutions",       img: `https://ui-avatars.com/api/?name=Rx+Solutions&background=EC4899&color=fff&size=36`,        isPremium: true,  location: "Largo di Torre Argentina, 3, Roma, 00186.",     email: "optometrist@city.com",     phone: "+39 679 9012345", features: ["Showroom"],            joinedOn: "29-04-2026", orders: 29, status: "Active"    },
  { id: 7,  name: "Community Health",   img: `https://ui-avatars.com/api/?name=Community+Health&background=14B8A6&color=fff&size=36`,    isPremium: false, location: "Via Garibaldi, 7, Genova, 16124.",              email: "veterinary@city.com",      phone: "+39 789 0123456", features: ["Pharmacy"],            joinedOn: "30-04-2026", orders: 30, status: "Active"    },
  { id: 8,  name: "Pharmacy Express",   img: `https://ui-avatars.com/api/?name=Pharmacy+Express&background=F97316&color=fff&size=36`,    isPremium: true,  location: "Piazza del Campo, 1, Siena, 53100.",            email: "nutritionist@city.com",    phone: "+39 890 1234567", features: ["Showroom", "Service"], joinedOn: "01-05-2026", orders: 31, status: "Active"    },
  { id: 9,  name: "Nature's Remedy",    img: `https://ui-avatars.com/api/?name=Natures+Remedy&background=6366F1&color=fff&size=36`,      isPremium: false, location: "Via D'Azeglio, 28, Modena, 41121.",             email: "therapist@city.com",       phone: "+39 901 2345678", features: ["Pharmacy"],            joinedOn: "02-05-2026", orders: 32, status: "Active"    },
  { id: 10, name: "Family Pharmacy",    img: `https://ui-avatars.com/api/?name=Family+Pharmacy&background=EF4444&color=fff&size=36`,     isPremium: false, location: "Corso Vittorio Emanuele II, 23, Napoli, 80121.",email: "chiropractor@city.com",    phone: "+39 012 3456789", features: ["Pharmacy"],            joinedOn: "03-05-2026", orders: 33, status: "Active"    },
  { id: 11, name: "Vitality Pharmacy",  img: `https://ui-avatars.com/api/?name=Vitality+Pharmacy&background=1E3A5F&color=fff&size=36`,   isPremium: false, location: "Viale della Libertà, 22, Palermo, 90100.",      email: "pediatrician@city.com",    phone: "+39 133 2487890", features: ["Pharmacy"],            joinedOn: "04-05-2026", orders: 34, status: "Active"    },
  { id: 12, name: "CareFirst Pharmacy", img: `https://ui-avatars.com/api/?name=CareFirst+Pharmacy&background=059669&color=fff&size=36`,  isPremium: true,  location: "Via XX Settembre, 75, Catania, 95100.",         email: "physiotherapist@city.com", phone: "+39 248 3579901", features: ["Showroom", "Service"], joinedOn: "05-05-2026", orders: 35, status: "Active"    },
];

type SortKey = "name" | "location" | "joinedOn" | "orders" | "status";
type SortDir = "asc" | "desc";

const featureColors: Record<FeatureTag, { text: string; bg: string }> = {
  Showroom: { text: "#8B5CF6", bg: "#F5F3FF" },
  Service:  { text: "#F59E0B", bg: "#FFFBEB" },
  Pharmacy: { text: "#F97316", bg: "#FFF7ED" },
};

const statusConfig: Record<SellerStatus, { text: string; dot: string }> = {
  Active:    { text: "#24A148", dot: "#24A148" },
  Inactive:  { text: "#6B6F72", dot: "#6B6F72" },
  Suspended: { text: "#DA1E28", dot: "#DA1E28" },
};

const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
  <span className="inline-flex flex-col leading-none opacity-40 flex-shrink-0">
    <span style={{ fontSize: "7px" }} className={active && dir === "asc" ? "opacity-100 text-blue-500" : ""}>▲</span>
    <span style={{ fontSize: "7px" }} className={active && dir === "desc" ? "opacity-100 text-blue-500" : ""}>▼</span>
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

export default function SellersManagement() {
  const [search, setSearch]               = useState("");
  const [sortKey, setSortKey]             = useState<SortKey | null>(null);
  const [sortDir, setSortDir]             = useState<SortDir>("asc");
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(12);
  const [pageSizeInput, setPageSizeInput] = useState("12");
  const [selected, setSelected]           = useState<Set<number>>(new Set());
  const [openMenu, setOpenMenu]           = useState<number | null>(null);
  const [actionOpen, setActionOpen]       = useState(false);
  const [filtersOpen, setFiltersOpen]     = useState(false);
  const [addSellerOpen, setAddSellerOpen] = useState(false);
  const [importOpen, setImportOpen]       = useState(false);
  const [importMode, setImportMode]       = useState<"seller" | "service" | "product">("seller");
  const actionRef                         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setActionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = [...SELLERS];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      data.sort((a, b) => {
        if (sortKey === "orders") return sortDir === "asc" ? a.orders - b.orders : b.orders - a.orders;
        return sortDir === "asc"
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
    }
    return data;
  }, [search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageIds    = pageData.map((s) => s.id);

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

  const getPageNumbers = (): (number | "...")[] => {
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

  const [bulkAction, setBulkAction] = useState<"upgrade" | "inactive" | "suspend" | "downgrade" | "active" | "reactivate" | null>(null);


  return (
    <>
      {/* ── Modals outside root div so fixed positioning works correctly ── */}
      <AddSellerDrawer
        open={addSellerOpen}
        onClose={() => setAddSellerOpen(false)}
      />
      <ImportSellersModal
        open={importOpen}
        mode={importMode}
        onClose={() => setImportOpen(false)}
      />

      <div className="w-full font-inter" onClick={() => setOpenMenu(null)}>

        {/* ── Page Title + Actions ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[18px] font-semibold text-black">Sellers Management</h1>
            <p className="text-[12px] font-medium text-[#6B6F72] mt-1">Manage and monitor all Sellers</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setImportMode("seller"); setImportOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 border border-[#D6DADD] rounded-lg text-[13px] font-medium text-[#21272A] bg-white hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8"/>
                <line x1="4" y1="20" x2="21" y2="3"/>
                <polyline points="21 16 21 21 16 21"/>
                <line x1="15" y1="15" x2="21" y2="21"/>
              </svg>
              Import Sellers
            </button>
            <button
              onClick={() => setAddSellerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Seller
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white border border-[#D6DADD] rounded-2xl overflow-hidden">

          {/* ── Toolbar ── */}
          {selected.size > 0 ? (

            /* Bulk Action Bar */
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] gap-4 bg-[#F8FAFF]">
              <div className="relative w-56">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AAAC]"
                  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search here..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setImportMode("service"); setImportOpen(true); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/>
                    <line x1="4" y1="20" x2="21" y2="3"/>
                    <polyline points="21 16 21 21 16 21"/>
                    <line x1="15" y1="15" x2="21" y2="21"/>
                  </svg>
                  Import Services
                </button>
                <button
                  onClick={() => { setImportMode("product"); setImportOpen(true); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/>
                    <line x1="4" y1="20" x2="21" y2="3"/>
                    <polyline points="21 16 21 21 16 21"/>
                    <line x1="15" y1="15" x2="21" y2="21"/>
                  </svg>
                  Import Products
                </button>
                <div className="relative" ref={actionRef}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActionOpen((prev) => !prev); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#1192E8] border border-[#1192E8] rounded-lg hover:bg-blue-50 transition-colors bg-white"
                  >
                    Action
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {actionOpen && (
                    <div className="absolute left-0 top-10 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[180px]">
                      <button
                        onClick={() => { setActionOpen(false); setBulkAction("upgrade"); }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        <span>Upgrade to Showroom</span>
                        </button>
                      <div className="mx-3 border-t border-[#F0F2F4]" />
                      <button
                        onClick={() => { setActionOpen(false); setBulkAction("inactive"); }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="10" y1="15" x2="10" y2="9"/>
                            <line x1="14" y1="15" x2="14" y2="9"/>
                        </svg>
                        <span>Mark Inactive</span>
                        </button>
                      <div className="mx-3 border-t border-[#F0F2F4]" />
                      <button
                        onClick={() => { setActionOpen(false); setBulkAction("suspend"); }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#DA1E28] hover:bg-red-50 transition-colors flex items-center gap-2.5"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                        </svg>
                        <span>Suspend Seller</span>
                        </button>
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#1192E8] border border-[#1192E8] rounded-lg hover:bg-blue-50 transition-colors bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export Selection
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

          ) : (

            /* Normal Search + Filter Bar */
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] gap-4">
              <div className="relative w-56">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AAAC]"
                  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search here..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); setSelected(new Set()); }}
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setFiltersOpen((p) => !p); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#6B6F72] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                    </svg>
                    Filters
                  </button>
                  <SellerFiltersPanel
                    open={filtersOpen}
                    onClose={() => setFiltersOpen(false)}
                    onApply={(filters) => {
                      console.log("Applied filters:", filters);
                      setFiltersOpen(false);
                    }}
                  />
                </div>
                <div className="relative">
                  <ExportDropdown />
                </div>
              </div>
            </div>
          )}

          <SellerBulkActionModal
            open={bulkAction !== null}
            actionType={bulkAction}
            onClose={() => setBulkAction(null)}
            onConfirm={(type, reasons, note) => {
              console.log("Action confirmed:", type, reasons, note);
              setBulkAction(null);
            }}
          />

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
                  <th onClick={() => handleSort("name")} className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap">
                    <span className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                      Seller <SortIcon active={sortKey === "name"} dir={sortDir} />
                    </span>
                  </th>
                  <th onClick={() => handleSort("location")} className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap">
                    <span className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                      Location <SortIcon active={sortKey === "location"} dir={sortDir} />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    <span className="text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">Contact</span>
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    <span className="text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">Features</span>
                  </th>
                  <th onClick={() => handleSort("joinedOn")} className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap">
                    <span className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                      Joined on <SortIcon active={sortKey === "joinedOn"} dir={sortDir} />
                    </span>
                  </th>
                  <th onClick={() => handleSort("orders")} className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap">
                    <span className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                      Orders <SortIcon active={sortKey === "orders"} dir={sortDir} />
                    </span>
                  </th>
                  <th onClick={() => handleSort("status")} className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap">
                    <span className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                      Status <SortIcon active={sortKey === "status"} dir={sortDir} />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((seller) => (
                  <tr
                    key={seller.id}
                    className={`border-b border-[#D6DADD] last:border-b-0 transition-colors ${
                      selected.has(seller.id) ? "bg-blue-50" : "hover:bg-blue-50/30"
                    }`}
                  >
                    <td className="px-4 py-3 w-11">
                      <input type="checkbox" checked={selected.has(seller.id)}
                        onChange={() => toggleRow(seller.id)}
                        className="w-[15px] h-[15px] cursor-pointer accent-blue-500" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#E8EAED]">
                          <img
                            src={seller.img}
                            alt={seller.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.style.backgroundColor = "#6366F1";
                                parent.style.display = "flex";
                                parent.style.alignItems = "center";
                                parent.style.justifyContent = "center";
                                parent.innerHTML = `<span style="color:white;font-size:11px;font-weight:700">${seller.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#21272A]">{seller.name}</p>
                          {seller.isPremium && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                                fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
                                <circle cx="12" cy="12" r="10"/>
                              </svg>
                              <span className="text-[10px] font-medium text-[#F59E0B]">Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ maxWidth: "180px" }}>
                      <p className="text-[13px] text-[#6B6F72] leading-snug line-clamp-2">{seller.location}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`mailto:${seller.email}`} className="text-[13px] text-[#1192E8] hover:underline block">{seller.email}</a>
                      <span className="text-[12px] text-[#1192E8] block mt-0.5">{seller.phone}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1.5">
                        {seller.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 rounded-md text-[11px] font-medium"
                            style={{ color: featureColors[f].text, backgroundColor: featureColors[f].bg }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[13px] text-[#6B6F72]">{seller.joinedOn}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[13px] text-[#6B6F72]">{seller.orders}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusConfig[seller.status].dot }} />
                        <span className="text-[13px] font-medium"
                          style={{ color: statusConfig[seller.status].text }}>
                          {seller.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenu(openMenu === seller.id ? null : seller.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors text-lg"
                      >
                        ⋮
                      </button>
                      <SellerActionMenu
  open={openMenu === seller.id}
  status={seller.status}
  onClose={() => setOpenMenu(null)}
  onViewDetails={() => { setOpenMenu(null); console.log("View", seller.id); }}
  onEditDetails={() => { setOpenMenu(null); console.log("Edit", seller.id); }}
  onUpgradeShowroom={() => { setOpenMenu(null); setBulkAction("upgrade"); }}
  onDowngradePharmacy={() => { setOpenMenu(null); setBulkAction("downgrade"); }}
  onMarkInactive={() => { setOpenMenu(null); setBulkAction("inactive"); }}
  onMarkActive={() => { setOpenMenu(null); setBulkAction("active"); }}
  onSuspend={() => { setOpenMenu(null); setBulkAction("suspend"); }}
  onReactivate={() => { setOpenMenu(null); setBulkAction("reactivate"); }}
/>
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
                <input
                  type="text"
                  inputMode="numeric"
                  value={pageSizeInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "" || /^\d+$/.test(raw)) {
                      setPageSizeInput(raw);
                      const val = parseInt(raw);
                      if (!isNaN(val) && val >= 1 && val <= 100) { setPageSize(val); setPage(1); }
                    }
                  }}
                  onBlur={() => {
                    const val = parseInt(pageSizeInput);
                    if (isNaN(val) || val < 1) setPageSizeInput(String(pageSize));
                  }}
                  className="w-12 px-2 py-1.5 text-[12px] text-[#21272A] text-center outline-none bg-white"
                />
                <div className="flex flex-col border-l border-[#D6DADD]">
                  <button onClick={() => { const n = pageSize + 1; if (n <= 100) { setPageSize(n); setPageSizeInput(String(n)); setPage(1); } }}
                    className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72]">▲</button>
                  <button onClick={() => { const n = pageSize - 1; if (n >= 1) { setPageSize(n); setPageSizeInput(String(n)); setPage(1); } }}
                    className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72] border-t border-[#D6DADD]">▼</button>
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
                      color:           safePage === p ? "#fff"     : "#6B6F72",
                      border:          safePage === p ? "none"     : "1px solid #D6DADD",
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
    </>
  );
}