"use client";

import { useRouter } from "next/navigation";
import SellerActionMenu from "../components/sellers/SellerActionMenu";
import ExportDropdown from "../components/exportdropdown";
import AddSellerDrawer from "@/app/components/sellers/AddSellerDrawer";
import ImportSellersModal from "../components/sellers/ImportSeller";
import SellerBulkActionModal from "../components/sellers/SellerBulkActionModal";
import DataTable, { Column } from "../components/DataTable";
import { useState, useRef } from "react";

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
  const router = useRouter();
  const [addSellerOpen, setAddSellerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importMode, setImportMode] = useState<"seller" | "service" | "product">("seller");
  const [bulkAction, setBulkAction] = useState<"upgrade" | "inactive" | "suspend" | "downgrade" | "active" | "reactivate" | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
const bulkActionRef = useRef<HTMLDivElement>(null);

  const columns: Column<Seller>[] = [
    {
      key: "name",
      label: "Seller",
      sortable: true,
      render: (_, seller) => (
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
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (value) => (
        <p className="text-[13px] text-[#6B6F72] leading-snug line-clamp-2">{value}</p>
      ),
      width: "180px",
    },
    {
      key: "email",
      label: "Contact",
      render: (_, seller) => (
        <>
          <a href={`mailto:${seller.email}`} className="text-[13px] text-[#1192E8] hover:underline block">{seller.email}</a>
          <span className="text-[12px] text-[#1192E8] block mt-0.5">{seller.phone}</span>
        </>
      ),
    },
    {
      key: "features",
      label: "Features",
      render: (_, seller) => (
        <div className="flex flex-wrap gap-1.5">
          {seller.features.map((f) => (
            <span key={f} className="px-2 py-0.5 rounded-md text-[11px] font-medium"
              style={{ color: featureColors[f].text, backgroundColor: featureColors[f].bg }}>
              {f}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "joinedOn",
      label: "Joined on",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] text-[#6B6F72]">{value}</span>
      ),
    },
    {
      key: "orders",
      label: "Orders",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] text-[#6B6F72]">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: SellerStatus) => (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusConfig[value].dot }} />
          <span className="text-[13px] font-medium"
            style={{ color: statusConfig[value].text }}>
            {value}
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* ── Modals ── */}
      <AddSellerDrawer
        open={addSellerOpen}
        onClose={() => setAddSellerOpen(false)}
      />
      <ImportSellersModal
        open={importOpen}
        mode={importMode}
        onClose={() => setImportOpen(false)}
      />
      <SellerBulkActionModal
        open={bulkAction !== null}
        actionType={bulkAction}
        onClose={() => setBulkAction(null)}
        onConfirm={(type, reasons, note) => {
          console.log("Action confirmed:", type, reasons, note);
          setBulkAction(null);
        }}
      />

      <div className="w-full font-inter">
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

        {/* ── Data Table ── */}
        <DataTable<Seller>
          columns={columns}
          data={SELLERS}
          rowKey={(seller) => seller.id}
          searchFields={["name", "email", "location"]}
          searchPlaceholder="Search sellers..."
          renderRowActions={(seller) => (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenMenu(openMenu === seller.id ? null : seller.id)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors text-lg"
              >
                ⋮
              </button>
              {openMenu === seller.id && (
                <SellerActionMenu
                  open={true}
                  status={seller.status}
                  onClose={() => setOpenMenu(null)}
                  onViewDetails={() => {
                    setOpenMenu(null);
                    router.push(`/sellers/${seller.id}`);
                  }}
                  onEditDetails={() => { setOpenMenu(null); console.log("Edit", seller.id); }}
                  onUpgradeShowroom={() => { setOpenMenu(null); setBulkAction("upgrade"); }}
                  onDowngradePharmacy={() => { setOpenMenu(null); setBulkAction("downgrade"); }}
                  onMarkInactive={() => { setOpenMenu(null); setBulkAction("inactive"); }}
                  onMarkActive={() => { setOpenMenu(null); setBulkAction("active"); }}
                  onSuspend={() => { setOpenMenu(null); setBulkAction("suspend"); }}
                  onReactivate={() => { setOpenMenu(null); setBulkAction("reactivate"); }}
                />
              )}
            </div>
          )}
          renderBulkActionBar={(selectedCount, clearSelection) => (
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
        {String(selectedCount).padStart(2, "0")} Selection{selectedCount > 1 ? "s" : ""}
      </span>
    </div>

    {/* Right: action buttons */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => { setImportMode("service"); setImportOpen(true); }}
        className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
      >
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
        className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 3 21 3 21 8"/>
          <line x1="4" y1="20" x2="21" y2="3"/>
          <polyline points="21 16 21 21 16 21"/>
          <line x1="15" y1="15" x2="21" y2="21"/>
        </svg>
        Import Products
      </button>

      <div className="relative" ref={bulkActionRef}>
        <button
            onClick={() => setBulkActionOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#1192E8] border border-[#1192E8] rounded-lg hover:bg-blue-50 transition-colors bg-white"
        >
            Action
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
            </svg>
        </button>

        {bulkActionOpen && (
        <div className="absolute right-0 top-10 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[180px]">

            {/* Upgrade to Showroom */}
            <button
            onClick={() => { setBulkActionOpen(false); setBulkAction("upgrade"); }}
            className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>
            </svg>
            Upgrade to Showroom
            </button>

            <div className="mx-3 border-t border-[#F0F2F4]" />

            {/* Mark as Inactive */}
            <button
            onClick={() => { setBulkActionOpen(false); setBulkAction("inactive"); }}
            className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Mark Inactive
            </button>

            <div className="mx-3 border-t border-[#F0F2F4]" />

            {/* Suspend Seller */}
            <button
            onClick={() => { setBulkActionOpen(false); setBulkAction("suspend"); }}
            className="w-full text-left px-4 py-2.5 text-[13px] text-[#DA1E28] hover:bg-red-50 transition-colors flex items-center gap-2.5"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            Suspend Seller
            </button>

        </div>
        )}
        </div>

      <ExportDropdown />

      {/* Clear selection */}
      <button
        onClick={clearSelection}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
        title="Clear selection"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
)}
          customFilter={(seller, query) => {
            const q = query.toLowerCase();
            return (
              seller.name.toLowerCase().includes(q) ||
              seller.email.toLowerCase().includes(q) ||
              seller.location.toLowerCase().includes(q)
            );
          }}
        />
      </div>
    </>
  );
}