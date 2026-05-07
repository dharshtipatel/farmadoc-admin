"use client";

import { useState } from "react";
import DataTable, { Column } from "../DataTable";
import ImportSellersModal from "./ImportSeller";
import ProductActionModal from "./ProductActionModal";
import ExportDropdown from "../exportdropdown";
import ProductDetailsDrawer from "./ProductDetailsDrawer";
import EditProductDrawer from "./EditProductDrawer";

type ProductStatus = "Active" | "Inactive";
type ProductActionType = "inactivate" | "activate" | "remove";

interface Product {
  sku: string;
  name: string;
  image: string;
  quantity: number;
  discount: string;
  disValue: string;
  sellingPrice: string;
  promoEnds: string;
  status: ProductStatus;
}

const INITIAL_PRODUCTS: Product[] = [
  { sku: "651615165654", name: "Solar Labo Prot Crp Spf50+",  image: "🧴", quantity: 30, discount: "05%", disValue: "€100.00", sellingPrice: "€95.00",  promoEnds: "2026-04-30", status: "Active"   },
  { sku: "751625175765", name: "Hydra Boost Moisturizer 24h", image: "💧", quantity: 31, discount: "10%", disValue: "€150.00", sellingPrice: "€120.00", promoEnds: "2026-05-31", status: "Inactive" },
  { sku: "851635185876", name: "Revitalizing Eye Cream",      image: "👁️", quantity: 32, discount: "15%", disValue: "€200.00", sellingPrice: "€75.00",  promoEnds: "2026-06-30", status: "Active"   },
  { sku: "951643185887", name: "Night Repair Serum",          image: "🌙", quantity: 33, discount: "20%", disValue: "€250.00", sellingPrice: "€140.00", promoEnds: "2026-07-31", status: "Active"   },
  { sku: "106165206098", name: "Gentle Exfoliating Scrub",    image: "✨", quantity: 34, discount: "25%", disValue: "€300.00", sellingPrice: "€160.00", promoEnds: "2026-08-31", status: "Active"   },
];

export default function ProductsTab({ seller }: { seller: { shortName: string; name: string } }) {
  const [openMenu, setOpenMenu]     = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [products, setProducts]     = useState<Product[]>(INITIAL_PRODUCTS);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // Modal state
  const [modalAction, setModalAction]   = useState<ProductActionType | null>(null);
  const [modalIsBulk, setModalIsBulk]   = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [modalTargetSku, setModalTargetSku] = useState<string | null>(null);

  const hasProducts = products.length > 0;

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

  const handleModalConfirm = () => {
    console.log("Confirmed", modalAction, modalIsBulk ? "bulk" : modalTargetSku);
    setModalAction(null);
  };

  const columns: Column<Product>[] = [
    {
      key: "sku",
      label: "SKU",
      sortable: true,
      render: (value) => (
        <span className="text-[#1192E8] text-[13px] font-medium">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (_, product) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-base flex-shrink-0">
            {product.image}
          </div>
          <span className="text-[13px] text-[#21272A] font-medium">{product.name}</span>
        </div>
      ),
      width: "200px",
    },
    {
      key: "quantity",
      label: "Quantity",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "discount",
      label: "Discount %",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "disValue",
      label: "Dis Value",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "sellingPrice",
      label: "Selling Price",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "promoEnds",
      label: "Promo Ends",
      sortable: true,
      render: (value) => <span className="text-[13px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: ProductStatus) => (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: value === "Active" ? "#24A148" : "#6B6F72" }} />
          <span className="text-[13px] font-medium"
            style={{ color: value === "Active" ? "#24A148" : "#6B6F72" }}>
            {value}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[16px] font-semibold text-black">Products</h1>
          <p className="text-[12px] text-[#6B6F72] mt-0.5">
            Manage all products for this seller, including pricing, stock, expiry, and visibility settings.
          </p>
        </div>
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
          Import Products
        </button>
      </div>

      {!hasProducts ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[15px] font-semibold text-[#21272A] mb-1">No Products Available</p>
          <p className="text-[13px] text-[#6B6F72] max-w-[300px] leading-relaxed">
            Add products for this seller to make them discoverable to users. You can manage pricing,
            stock, expiry, and visibility including Hot Deals.
          </p>
        </div>
      ) : (
        <DataTable<Product>
          columns={columns}
          data={products}
          rowKey={(p) => p.sku}
          searchPlaceholder="Search here..."
          showCheckboxes={true}
          renderBulkActionBar={(selectedCount, clearSelection) => (
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] bg-[#F8FAFF]">
              {/* Left: count */}
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

              {/* Right: actions */}
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
                <ExportDropdown />

                {/* Clear */}
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
                    onClick={() => { setOpenMenu(null); setEditProduct(product); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                      fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Details
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
            return product.sku.toLowerCase().includes(q) || product.name.toLowerCase().includes(q);
          }}
        />
      )}

      <ImportSellersModal
        open={importOpen}
        mode="product"
        onClose={() => setImportOpen(false)}
      />

      <ProductActionModal
        open={modalAction !== null}
        actionType={modalAction}
        isBulk={modalIsBulk}
        onClose={() => setModalAction(null)}
        onConfirm={handleModalConfirm}
      />

      <ProductDetailsDrawer
        key={`seller-${viewProduct?.sku ?? "empty"}`}
        product={viewProduct}
        isOpen={viewProduct !== null}
        onClose={() => setViewProduct(null)}
        />

        <EditProductDrawer
        product={editProduct}
        isOpen={editProduct !== null}
        onClose={() => setEditProduct(null)}
        onSave={(updated) => {
            setProducts((prev) => prev.map((p) => p.sku === updated.sku ? updated : p));
            setEditProduct(null);
        }}
        />
    </div>
  );
}
