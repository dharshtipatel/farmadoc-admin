"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import DataTable, { Column } from "../components/DataTable";
import ProductActionModal from "../components/sellers/ProductActionModal";
import StatsCard from "../components/statscard";
import ImportSellersModal from "../components/sellers/ImportSeller";
import SelectCategoriesDrawer from "../components/SelectCategoriesDrawer";
import AddProductDrawer, { ProductDrawerValues } from "../components/AddProductDrawer";
import InventoryProductDetailsDrawer from "../components/sellers/ProductDetailsDrawer";

type ProductStatus = "Active" | "Inactive";
type ProductActionType = "inactivate" | "activate" | "remove";

interface Product {
  sku: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  seller: string;
  quantity: number;
  updatedOn: string;
  status: ProductStatus;
}

const stats: Stat[] = [
  { title: "Top Products", value: 1240, change: "+8.2%", isPositive: true, icon: "/images/Orders.svg" },
  { title: "Active Products", value: 320, change: "+5.1%", isPositive: true, icon: "/images/Orders.svg" },
  { title: "Inactive Products", value: "$12,400", change: "+12.5%", isPositive: true, icon: "/images/Orders.svg" },
];

type Stat = {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
};

const PRODUCTS: Product[] = [
  { sku: "651615165654", name: "Solar Labo Prot Crp Spf50+",  image: "🧴", category: "Pain Relief & Analgesics",      brand: "Chiesi Farmaceutici",  seller: "City Pharmacy",      quantity: 30, updatedOn: "2026-04-30", status: "Active"   },
  { sku: "751625175765", name: "Hydra Boost Moisturizer 24h", image: "💧", category: "Antibiotics & Antibacterials",  brand: "Menarini Group",       seller: "Health Hub",         quantity: 31, updatedOn: "2026-05-31", status: "Inactive" },
  { sku: "851635185876", name: "Revitalizing Eye Cream",      image: "👁️", category: "Cold, Cough & Flu",            brand: "Recordati",            seller: "Wellness Corner",    quantity: 32, updatedOn: "2026-06-30", status: "Active"   },
  { sku: "951643185887", name: "Night Repair Serum",          image: "🌙", category: "Vitamins & Supplements",        brand: "Zambon",               seller: "Urban Care",         quantity: 33, updatedOn: "2026-07-31", status: "Active"   },
  { sku: "106165206098", name: "Gentle Exfoliating Scrub",    image: "✨", category: "Diabetes Care",                 brand: "Bracco",               seller: "PharmaPlus",         quantity: 34, updatedOn: "2026-08-31", status: "Active"   },
  { sku: "651615165655", name: "Solar Labo Prot Crp Spf50+",  image: "🧴", category: "Cardiac & Blood Pressure",      brand: "Angelini Pharma",      seller: "Rx Solutions",       quantity: 30, updatedOn: "2026-04-30", status: "Active"   },
  { sku: "751625175766", name: "Hydra Boost Moisturizer 24h", image: "💧", category: "Digestive Health",              brand: "Italfarmaco",          seller: "Community Health",   quantity: 31, updatedOn: "2026-05-31", status: "Active"   },
  { sku: "851635185877", name: "Revitalizing Eye Cream",      image: "👁️", category: "Skin Care & Dermatology",       brand: "Dompe",                seller: "Pharmacy Express",   quantity: 32, updatedOn: "2026-06-30", status: "Active"   },
  { sku: "951643185888", name: "Night Repair Serum",          image: "🌙", category: "Respiratory Care",              brand: "Molteni Farmaceutici", seller: "Nature's Remedy",    quantity: 33, updatedOn: "2026-07-31", status: "Active"   },
  { sku: "106165206099", name: "Gentle Exfoliating Scrub",    image: "✨", category: "Women's Health",                brand: "Abiogen Pharma",       seller: "Family Pharmacy",    quantity: 34, updatedOn: "2026-08-31", status: "Active"   },
  { sku: "651615185656", name: "Solar Labo Prot Crp Spf50+",  image: "🧴", category: "Skin Care & Dermatology",       brand: "Alfasigma",            seller: "Vitality Pharmacy",  quantity: 33, updatedOn: "2026-07-31", status: "Active"   },
  { sku: "751625206098", name: "Hydra Boost Moisturizer 24h", image: "💧", category: "Respiratory Care",              brand: "Pierrel",              seller: "CareFirst Pharmacy", quantity: 34, updatedOn: "2026-08-31", status: "Active"   },
];

const statusColors: Record<ProductStatus, string> = {
  Active:   "#24A148",
  Inactive: "#6B6F72",
};

// ── Dual Range Slider ─────────────────────────────────────────────────────────
function DualRangeSlider({
  min, max, valueMin, valueMax, padStart = false, onChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  padStart?: boolean;
  onChange: (min: number, max: number) => void;
}) {
  const leftPct  = ((valueMin - min) / (max - min)) * 100;
  const rightPct = ((valueMax - min) / (max - min)) * 100;

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), valueMax - 1);
    onChange(val, valueMax);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), valueMin + 1);
    onChange(valueMin, val);
  };

  const fmt = (v: number) => padStart ? String(v).padStart(2, "0") : String(v);

  return (
    <>
      <style>{`
        .dual-range-input {
          position: absolute;
          width: 100%;
          height: 4px;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          pointer-events: none;
        }
        .dual-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #1E3862;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: grab;
          pointer-events: all;
        }
        .dual-range-input::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #1E3862;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: grab;
          pointer-events: all;
        }
        .dual-range-input::-webkit-slider-thumb:active {
          cursor: grabbing;
        }
      `}</style>

      <div className="relative flex h-5 items-center">
        {/* Track background */}
        <div className="absolute h-[4px] w-full rounded-full bg-[#E0E4EA]" />
        {/* Active fill */}
        <div
          className="absolute h-[4px] rounded-full bg-[#1E3862] pointer-events-none"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={handleMin}
          className="dual-range-input"
          style={{ zIndex: valueMin >= valueMax - 10 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={handleMax}
          className="dual-range-input"
          style={{ zIndex: valueMin >= valueMax - 10 ? 3 : 5 }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[12px] text-[#6B6F72]">
        <span>From <strong className="font-semibold text-[#21272A]">{fmt(valueMin)}</strong></span>
        <span>To <strong className="font-semibold text-[#21272A]">{fmt(valueMax)}</strong></span>
      </div>
    </>
  );
}

// ── Filters Panel ─────────────────────────────────────────────────────────────
function FiltersPanel({
  open, onClose, onApply, categories,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { status: string; selectedCategories: string[] }) => void;
  categories: string[];
}) {
  const [status, setStatus]                             = useState("All");
  const [selectedCategories, setSelectedCategories]     = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [minVal, setMinVal]                             = useState(1);
  const [maxVal, setMaxVal]                             = useState(400);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const toggleCategory = (c: string) =>
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const removeCategory = (c: string) =>
    setSelectedCategories((prev) => prev.filter((x) => x !== c));

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-10 z-50 bg-white border border-[#D6DADD] rounded-xl shadow-2xl w-[532px] flex flex-col max-h-[80vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E5E7EB] flex-shrink-0">
        <h3 className="text-[14px] font-bold text-[#21272A]">Filters</h3>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Status */}
        <div>
          <p className="text-[11px] font-semibold text-[#21272A] mb-2">Status</p>
          <div className="flex items-center gap-4">
            {["All", "Active", "Inactive"].map((s) => (
              <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="w-[14px] h-[14px] accent-[#1E3862] cursor-pointer"
                />
                <span className="text-[12px] text-[#21272A]">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB]" />

        {/* Sellers Count */}
        <div>
          <p className="text-[11px] font-semibold text-[#21272A] mb-3">Sellers Count</p>
          <DualRangeSlider
            min={1}
            max={400}
            valueMin={minVal}
            valueMax={maxVal}
            padStart={true}
            onChange={(mn, mx) => { setMinVal(mn); setMaxVal(mx); }}
          />
        </div>

        <div className="border-t border-[#E5E7EB]" />

        {/* Categories */}
{/* Categories */}
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

  {/* Selected tags */}
  {selectedCategories.length > 0 && (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {selectedCategories.map((c) => (
        <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-[#1192E8] border border-[#D6DADD] bg-white">
          {c}
          <button onClick={() => removeCategory(c)} className="hover:text-[#DA1E28] transition-colors font-medium">×</button>
        </span>
      ))}
    </div>
  )}
</div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB] flex-shrink-0">
        <button
          onClick={() => { setStatus("All"); setSelectedCategories([]); setMinVal(1); setMaxVal(400); }}
          className="text-[12px] text-[#6B6F72] hover:text-[#21272A] transition-colors"
        >
          Clear all
        </button>
        <button
          onClick={() => { onApply({ status, selectedCategories }); onClose(); }}
          className="px-4 py-2 bg-[#1E3862] text-white text-[12px] font-medium rounded-lg hover:bg-[#16305a] transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductMasterInventory() {
  const [products, setProducts]             = useState<Product[]>(PRODUCTS);
  const [openMenu, setOpenMenu]             = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [modalAction, setModalAction]       = useState<ProductActionType | null>(null);
  const [modalIsBulk, setModalIsBulk]       = useState(false);
  const [modalTargetSku, setModalTargetSku] = useState<string | null>(null);
  const [activeFilters, setActiveFilters]   = useState<{
    status: string;
    selectedCategories: string[];
  }>({ status: "All", selectedCategories: [] });

  const [importOpen, setImportOpen] = useState(false);
  const [importMode, setImportMode] = useState<"seller" | "service" | "product">("product");
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = useMemo(() => [...new Set(PRODUCTS.map((p) => p.category))], []);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const drawerInitialProduct = useMemo(() => {
    if (!editingProduct) return null;

    return {
      sku: editingProduct.sku,
      productName: editingProduct.name,
      brand: editingProduct.brand,
      description: "",
      composition: "",
      category: editingProduct.category,
      photos: [null, null, null, null, null],
    };
  }, [editingProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const statusMatch   = activeFilters.status === "All" || p.status === activeFilters.status;
      const categoryMatch = activeFilters.selectedCategories.length === 0 ||
        activeFilters.selectedCategories.includes(p.category);
      return statusMatch && categoryMatch;
    });
  }, [products, activeFilters]);

  const openSingleModal = (action: ProductActionType, sku: string) => {
    setModalAction(action);
    setModalIsBulk(false);
    setModalTargetSku(sku);
  };

  const openBulkModal = (action: ProductActionType) => {
    setModalAction(action);
    setModalIsBulk(true);
    setModalTargetSku(null);
  };

  const closeProductDrawer = () => {
    setAddProductOpen(false);
    setEditingProduct(null);
  };

  const handleProductSave = (product: ProductDrawerValues) => {
    const imageValue = product.photos.find(Boolean) ?? editingProduct?.image ?? "P";

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.sku === editingProduct.sku
            ? {
                ...item,
                sku: product.sku,
                name: product.productName,
                category: product.category,
                brand: product.brand,
                image: imageValue,
                updatedOn: new Date().toISOString().slice(0, 10),
              }
            : item
        )
      );
    } else {
      setProducts((prev) => [
        {
          sku: product.sku,
          name: product.productName,
          image: imageValue,
          category: product.category,
          brand: product.brand,
          seller: "Unassigned",
          quantity: 0,
          updatedOn: new Date().toISOString().slice(0, 10),
          status: "Active",
        },
        ...prev,
      ]);
    }

    closeProductDrawer();
  };

  const columns: Column<Product>[] = [
    {
      key: "sku",
      label: "SKU",
      sortable: true,
      render: (value) => <span className="text-[#1192E8] text-[13px] font-medium">{value}</span>,
    },
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (_, product) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-base flex-shrink-0">
            {product.image.startsWith("blob:") || product.image.startsWith("http") || product.image.startsWith("/")
              ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              : product.image}
          </div>
          <span className="text-[13px] text-[#21272A] font-medium line-clamp-1 max-w-[120px]">
            {product.name}
          </span>
        </div>
      ),
      width: "180px",
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (_, product) => (
        <span className="text-[13px] text-[#1192E8] line-clamp-1 max-w-[160px] block">{product.category}</span>
      ),
    },
    {
      key: "brand",
      label: "Brand",
      sortable: true,
      render: (_, product) => (
        <span className="text-[13px] text-[#1192E8]">{product.brand}</span>
      ),
    },
    {
      key: "seller",
      label: "Sellers",
      sortable: true,
      render: (_, product) => (
        <span className="text-[13px] text-[#6B6F72]">{product.seller}</span>
      ),
    },
    {
      key: "updatedOn",
      label: "Updated on",
      sortable: true,
      render: (_, product) => (
        <span className="text-[13px] text-[#6B6F72]">{product.updatedOn}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_, product) => (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColors[product.status] }} />
          <span className="text-[13px] font-medium" style={{ color: statusColors[product.status] }}>
            {product.status}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full font-inter">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-semibold text-black">Inventory Management</h1>
          <p className="text-[12px] font-medium text-[#6B6F72] mt-1">
            View and manage all products across all sellers on the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-[#D6DADD] rounded-lg text-[13px] font-medium text-[#21272A] bg-white hover:bg-gray-50 transition-colors"
            onClick={() => { setImportMode("product"); setImportOpen(true); }}
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8"/>
                <line x1="4" y1="20" x2="21" y2="3"/>
                <polyline points="21 16 21 21 16 21"/>
                <line x1="15" y1="15" x2="21" y2="21"/>
            </svg>
            Import Product
            </button>   
          <button
            onClick={() => {
              setEditingProduct(null);
              setAddProductOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Add Product
            </button>
        </div>
      </div>

      {/* Stats */}
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

      {/* Table */}
      <DataTable<Product>
        columns={columns}
        data={filteredProducts}
        rowKey={(p) => p.sku}
        searchPlaceholder="Search products..."
        showCheckboxes={true}
        toolbarRight={
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
              onClick={() => console.log("Export")}
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
            <FiltersPanel
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              onApply={setActiveFilters}
              categories={categories}
            />
          </div>
        }
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
                onClick={() => console.log("Export")}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Selection
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
        renderRowActions={(product) => (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenu(openMenu === product.sku ? null : product.sku)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors text-lg"
            >
              ⋮
            </button>
            {openMenu === product.sku && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[170px]">
                <button
                onClick={() => { setOpenMenu(null); setViewProduct(product); }}
                className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
                View Product
                </button>
                <div className="mx-3 border-t border-[#F0F2F4]" />
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setEditingProduct(product);
                    setAddProductOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Product
                </button>
                <div className="mx-3 border-t border-[#F0F2F4]" />
                {product.status === "Inactive" ? (
                  <button
                    onClick={() => { setOpenMenu(null); openSingleModal("activate", product.sku); }}
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
                    onClick={() => { setOpenMenu(null); openSingleModal("inactivate", product.sku); }}
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
                  onClick={() => { setOpenMenu(null); openSingleModal("remove", product.sku); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#DA1E28] hover:bg-red-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Remove Product
                </button>
              </div>
            )}
          </div>
        )}
        customFilter={(product, query) => {
          const q = query.toLowerCase();
          return (
            product.sku.toLowerCase().includes(q) ||
            product.name.toLowerCase().includes(q) ||
            product.seller.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q)
          );
        }}
      />

      <ProductActionModal
        open={modalAction !== null}
        actionType={modalAction}
        isBulk={modalIsBulk}
        onClose={() => setModalAction(null)}
        onConfirm={() => {
          if (!modalIsBulk && modalTargetSku && modalAction === "remove") {
            setProducts((prev) => prev.filter((p) => p.sku !== modalTargetSku));
          } else if (!modalIsBulk && modalTargetSku) {
            setProducts((prev) => prev.map((p) =>
              p.sku === modalTargetSku
                ? { ...p, status: modalAction === "activate" ? "Active" : "Inactive" }
                : p
            ));
          }
          setModalAction(null);
        }}
      />
      <ImportSellersModal
        open={importOpen}
        mode={importMode}
        onClose={() => setImportOpen(false)}
        />

      <AddProductDrawer
        key={`${editingProduct?.sku ?? "new"}-${addProductOpen ? "open" : "closed"}`}
        open={addProductOpen}
        onClose={closeProductDrawer}
        categories={categories}
        mode={editingProduct ? "edit" : "add"}
        initialProduct={drawerInitialProduct}
        onSave={handleProductSave}
        />

        <InventoryProductDetailsDrawer
        key={`inventory-${viewProduct?.sku ?? "empty"}`}
        product={viewProduct}
        isOpen={viewProduct !== null}
        onClose={() => setViewProduct(null)}
        variant="inventory"
        />
    </div>
  );
}
