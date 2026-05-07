"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DataTable, { Column } from "../components/DataTable";
import StatsCard from "../components/statscard";
import ImportSellersModal from "../components/sellers/ImportSeller";
import ProductActionModal from "../components/sellers/ProductActionModal";
import ServiceDetailsDrawer from "../components/sellers/ServiceDetailsDrawer";
import EditServiceDrawer from "../components/sellers/EditServiceDrawer";
import SelectCategoriesDrawer from "../components/SelectCategoriesDrawer";

type ServiceStatus = "Active" | "Inactive";
type ServiceActionType = "inactivate" | "activate" | "remove";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  duration: string;
  sellerCount: number;
  updatedOn: string;
  status: ServiceStatus;
}

type Stat = {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
};

const stats: Stat[] = [
  { title: "Top Services", value: 1240, change: "+8.2%", isPositive: true, icon: "/images/Orders.svg" },
  { title: "Active Services", value: 458, change: "+5.1%", isPositive: true, icon: "/images/Orders.svg" },
  { title: "Inactive Services", value: 58, change: "-2.4%", isPositive: false, icon: "/images/Orders.svg" },
];

const SERVICES: Service[] = [
  { id: "SVC1719373165", name: "Cholesterol Screening", description: "Fast walk-in blood profile and heart-health screening.", image: "🩸", price: 30, category: "Heart Health & Monitoring", duration: "30Min", sellerCount: 30, updatedOn: "2026-05-20", status: "Active" },
  { id: "SVC1719373166", name: "Blood Glucose Test", description: "Quick sugar monitoring with pharmacy guidance.", image: "💉", price: 31, category: "Antibiotics & Wellness", duration: "30Min", sellerCount: 31, updatedOn: "2026-05-21", status: "Inactive" },
  { id: "SVC1719373167", name: "ECG Test", description: "Basic cardiac rhythm check for early screening.", image: "🏥", price: 32, category: "Care Capability", duration: "45Min", sellerCount: 32, updatedOn: "2026-05-22", status: "Active" },
  { id: "SVC1719373168", name: "Sugar Test", description: "Simple finger prick for regular diabetic monitoring.", image: "🔬", price: 23, category: "Wellness Support", duration: "15Min", sellerCount: 33, updatedOn: "2026-05-23", status: "Active" },
  { id: "SVC1719373169", name: "Blood Pressure Test", description: "Quick blood pressure reading and pharmacist note.", image: "🩺", price: 24, category: "Clinical Blood Pressure", duration: "30Min", sellerCount: 30, updatedOn: "2026-05-24", status: "Active" },
  { id: "SVC1719373170", name: "Bone Density Test", description: "Rapid bone strength estimate for preventive care.", image: "🦴", price: 31, category: "Skeletal Health", duration: "45Min", sellerCount: 31, updatedOn: "2026-05-25", status: "Active" },
  { id: "SVC1719373171", name: "BMI Test", description: "Body mass and lifestyle assessment service.", image: "⚖️", price: 18, category: "General Care Screening", duration: "20Min", sellerCount: 29, updatedOn: "2026-05-26", status: "Active" },
  { id: "SVC1719373172", name: "Oxygen Test", description: "Pulse oximeter assessment with quick consultation.", image: "🫁", price: 16, category: "Respiratory Care", duration: "10Min", sellerCount: 28, updatedOn: "2026-05-27", status: "Inactive" },
];

const statusColors: Record<ServiceStatus, string> = {
  Active: "#24A148",
  Inactive: "#6B6F72",
};

function DualRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const leftPct = ((valueMin - min) / (max - min)) * 100;
  const rightPct = ((valueMax - min) / (max - min)) * 100;

  return (
    <>
      <style>{`
        .services-range-input {
          position: absolute;
          width: 100%;
          height: 4px;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          pointer-events: none;
        }
        .services-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #1E3862;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          pointer-events: all;
        }
        .services-range-input::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #1E3862;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          pointer-events: all;
        }
      `}</style>
      <div className="relative flex h-5 items-center">
        <div className="absolute h-[4px] w-full rounded-full bg-[#E0E4EA]" />
        <div
          className="absolute h-[4px] rounded-full bg-[#1E3862]"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={(e) => onChange(Math.min(Number(e.target.value), valueMax - 1), valueMax)}
          className="services-range-input"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={(e) => onChange(valueMin, Math.max(Number(e.target.value), valueMin + 1))}
          className="services-range-input"
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#6B6F72]">
        <span>From <strong className="text-[#21272A]">{String(valueMin).padStart(2, "0")}</strong></span>
        <span>To <strong className="text-[#21272A]">{valueMax}</strong></span>
      </div>
    </>
  );
}

function ServicesFiltersPanel({
  open,
  onClose,
  onApply,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    status: string;
    selectedCategories: string[];
    selectedDurations: string[];
    sellerCountRange: [number, number];
  }) => void;
  categories: string[];
}) {
  const [status, setStatus] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [sellerCountRange, setSellerCountRange] = useState<[number, number]>([1, 400]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const toggleCategory = (category: string) =>
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );

  const toggleDuration = (duration: string) =>
    setSelectedDurations((prev) =>
      prev.includes(duration) ? prev.filter((item) => item !== duration) : [...prev, duration]
    );

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-10 z-50 bg-white border border-[#D6DADD] rounded-xl shadow-2xl w-[340px] flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[14px] font-bold text-[#21272A]">Filters</h3>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div>
          <p className="text-[11px] font-semibold text-[#21272A] mb-2">Status</p>
          <div className="flex items-center gap-4">
            {["All", "Active", "Inactive"].map((value) => (
              <label key={value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={status === value}
                  onChange={() => setStatus(value)}
                  className="w-[14px] h-[14px] accent-[#1E3862] cursor-pointer"
                />
                <span className="text-[12px] text-[#21272A]">{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB]" />

        <div>
          <p className="text-[11px] font-semibold text-[#21272A] mb-2">Duration</p>
          <div className="grid grid-cols-2 gap-y-2">
            {["15Min", "30Min", "45Min", "1Hr"].map((value) => (
              <label key={value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDurations.includes(value)}
                  onChange={() => toggleDuration(value)}
                  className="w-[14px] h-[14px] accent-[#1E3862] cursor-pointer"
                />
                <span className="text-[12px] text-[#21272A]">{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB]" />

        <div>
          <p className="text-[11px] font-semibold text-[#21272A] mb-3">Sellers Count</p>
          <DualRangeSlider
            min={1}
            max={400}
            valueMin={sellerCountRange[0]}
            valueMax={sellerCountRange[1]}
            onChange={(min, max) => setSellerCountRange([min, max])}
          />
        </div>

        <div className="border-t border-[#E5E7EB]" />

        <div>
          <p className="text-[11px] font-semibold text-[#21272A] mb-2">Categories</p>
          <div className="relative">
            <button
              onClick={() => setCategoryDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2 border border-[#D6DADD] rounded-lg text-[12px] text-[#6B6F72] bg-white hover:border-[#1192E8] transition-colors"
            >
              <span>Select Categories</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <SelectCategoriesDrawer
              open={categoryDropdownOpen}
              categories={categories}
              selected={selectedCategories}
              onToggle={toggleCategory}
            />
          </div>

          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-[#1192E8] border border-[#D6DADD]"
                >
                  {category}
                  <button onClick={() => toggleCategory(category)} className="font-medium">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
        <button
          onClick={() => {
            setStatus("All");
            setSelectedCategories([]);
            setSelectedDurations([]);
            setSellerCountRange([1, 400]);
          }}
          className="text-[12px] text-[#6B6F72] hover:text-[#21272A] transition-colors"
        >
          Clear all
        </button>
        <button
          onClick={() => {
            onApply({ status, selectedCategories, selectedDurations, sellerCountRange });
            onClose();
          }}
          className="px-4 py-2 bg-[#1E3862] text-white text-[12px] font-medium rounded-lg hover:bg-[#16305a] transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default function ServiceInventoryManagement() {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ServiceActionType | null>(null);
  const [modalIsBulk, setModalIsBulk] = useState(false);
  const [modalTargetId, setModalTargetId] = useState<string | null>(null);
  const [viewService, setViewService] = useState<Service | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("edit");
  const [activeFilters, setActiveFilters] = useState<{
    status: string;
    selectedCategories: string[];
    selectedDurations: string[];
    sellerCountRange: [number, number];
  }>({
    status: "All",
    selectedCategories: [],
    selectedDurations: [],
    sellerCountRange: [1, 400],
  });

  const categories = useMemo(() => [...new Set(SERVICES.map((service) => service.category))], []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const statusMatch = activeFilters.status === "All" || service.status === activeFilters.status;
      const categoryMatch = activeFilters.selectedCategories.length === 0 ||
        activeFilters.selectedCategories.includes(service.category);
      const durationMatch = activeFilters.selectedDurations.length === 0 ||
        activeFilters.selectedDurations.includes(service.duration);
      const sellerCountMatch =
        service.sellerCount >= activeFilters.sellerCountRange[0] &&
        service.sellerCount <= activeFilters.sellerCountRange[1];
      return statusMatch && categoryMatch && durationMatch && sellerCountMatch;
    });
  }, [services, activeFilters]);

  const openSingleModal = (action: ServiceActionType, id: string) => {
    setModalAction(action);
    setModalIsBulk(false);
    setModalTargetId(id);
  };

  const openBulkModal = (action: ServiceActionType) => {
    setModalAction(action);
    setModalIsBulk(true);
    setModalTargetId(null);
  };

  const columns: Column<Service>[] = [
    {
      key: "id",
      label: "Service ID",
      sortable: true,
      render: (value) => <span className="text-[#1192E8] text-[13px] font-medium">{value}</span>,
      width: "160px",
    },
    {
      key: "name",
      label: "Service",
      sortable: true,
      width: "260px",
      render: (_, service) => (
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-lg flex-shrink-0">
            {service.image}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#21272A] line-clamp-1">{service.name}</p>
            <p className="text-[11px] text-[#6B6F72] line-clamp-1 max-w-[180px]">{service.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#1192E8]">{value}</span>,
    },
    {
      key: "duration",
      label: "Duration",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "sellerCount",
      label: "Sellers",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "updatedOn",
      label: "Updated On",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_, service) => (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[service.status] }} />
          <span className="text-[13px] font-medium" style={{ color: statusColors[service.status] }}>
            {service.status}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full font-inter">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-semibold text-black">Service Inventory Management</h1>
          <p className="text-[12px] font-medium text-[#6B6F72] mt-1">
            View and manage all services offered across every seller on the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#D6DADD] rounded-lg text-[13px] font-medium text-[#21272A] bg-white hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
            </svg>
            Import Services
          </button>
          <button
            onClick={() => {
              setDrawerMode("add");
              setEditService({
                id: `svc-${Date.now()}`,
                name: "",
                description: "",
                image: "",
                price: 0,
                category: "",
                duration: "",
                sellerCount: 0,
                updatedOn: new Date().toISOString().slice(0, 10),
                status: "Active",
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[13px] font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Add Service
          </button>
        </div>
      </div>

      <div className="mt-6 mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            showChange={false}
          />
        ))}
      </div>

      <DataTable<Service>
        columns={columns}
        data={filteredServices}
        rowKey={(service) => service.id}
        searchFields={["id", "name", "description", "category"]}
        searchPlaceholder="Search services..."
        showCheckboxes={true}
        toolbarRight={(
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters
            </button>
            <button
              onClick={() => console.log("Export services")}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
            <ServicesFiltersPanel
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              onApply={setActiveFilters}
              categories={categories}
            />
          </div>
        )}
        renderBulkActionBar={(selectedCount, clearSelection) => (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] bg-[#F8FAFF]">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#1192E8] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                  fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-[13px] font-medium text-[#21272A]">
                {String(selectedCount).padStart(2, "0")} Selection{selectedCount > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openBulkModal("remove")}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#DA1E28] border border-[#DA1E28] rounded-lg hover:bg-red-50 transition-colors bg-white"
              >
                Remove Selection
              </button>
              <button
                onClick={() => openBulkModal("activate")}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#1192E8] border border-[#1192E8] rounded-lg hover:bg-blue-50 transition-colors bg-white"
              >
                Active Selection
              </button>
              <button
                onClick={() => openBulkModal("inactivate")}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#1192E8] border border-[#1192E8] rounded-lg hover:bg-blue-50 transition-colors bg-white"
              >
                Inactive Selection
              </button>
              <button
                onClick={clearSelection}
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
        )}
        renderRowActions={(service) => (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenu(openMenu === service.id ? null : service.id)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors text-lg"
            >
              ⋮
            </button>
            {openMenu === service.id && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[170px]">
                <button
                  onClick={() => { setOpenMenu(null); setViewService(service); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Service
                </button>
                <div className="mx-3 border-t border-[#F0F2F4]" />
                <button
                  onClick={() => { setOpenMenu(null); setDrawerMode("edit"); setEditService(service); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Service
                </button>
                <div className="mx-3 border-t border-[#F0F2F4]" />
                {service.status === "Inactive" ? (
                  <button
                    onClick={() => { setOpenMenu(null); openSingleModal("activate", service.id); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#24A148] hover:bg-green-50 transition-colors flex items-center gap-2.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                      fill="none" stroke="#24A148" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Mark Active
                  </button>
                ) : (
                  <button
                    onClick={() => { setOpenMenu(null); openSingleModal("inactivate", service.id); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                      fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Mark Inactive
                  </button>
                )}
                <div className="mx-3 border-t border-[#F0F2F4]" />
                <button
                  onClick={() => { setOpenMenu(null); openSingleModal("remove", service.id); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#DA1E28] hover:bg-red-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Remove Service
                </button>
              </div>
            )}
          </div>
        )}
        customFilter={(service, query) => {
          const q = query.toLowerCase();
          return (
            service.id.toLowerCase().includes(q) ||
            service.name.toLowerCase().includes(q) ||
            service.description.toLowerCase().includes(q) ||
            service.category.toLowerCase().includes(q)
          );
        }}
      />

      <ProductActionModal
        open={modalAction !== null}
        actionType={modalAction}
        isBulk={modalIsBulk}
        itemLabel="Service"
        copyVariant="servicesInventory"
        onClose={() => setModalAction(null)}
        onConfirm={() => {
          if (!modalIsBulk && modalTargetId && modalAction === "remove") {
            setServices((prev) => prev.filter((service) => service.id !== modalTargetId));
          } else if (!modalIsBulk && modalTargetId) {
            setServices((prev) => prev.map((service) =>
              service.id === modalTargetId
                ? { ...service, status: modalAction === "activate" ? "Active" : "Inactive" }
                : service
            ));
          }
          setModalAction(null);
        }}
      />

      <ImportSellersModal
        open={importOpen}
        mode="serviceInventory"
        onClose={() => setImportOpen(false)}
      />

      <ServiceDetailsDrawer
        key={`service-view-${viewService?.id ?? "empty"}`}
        service={viewService}
        isOpen={viewService !== null}
        variant="inventory"
        onClose={() => setViewService(null)}
      />

      <EditServiceDrawer
        key={`service-edit-${editService?.id ?? "empty"}-${drawerMode}`}
        service={editService}
        isOpen={editService !== null}
        mode={drawerMode}
        categories={categories}
        onClose={() => setEditService(null)}
        onSave={(updated) => {
          setServices((prev) =>
            drawerMode === "add"
              ? [{ ...updated, updatedOn: new Date().toISOString().slice(0, 10) }, ...prev]
              : prev.map((service) => service.id === updated.id ? { ...service, ...updated, updatedOn: new Date().toISOString().slice(0, 10) } : service)
          );
          setEditService(null);
        }}
      />
    </div>
  );
}
