"use client";

import { useEffect, useState } from "react";
import DataTable, { Column } from "../DataTable";
import ProductActionModal from "./ProductActionModal";

type ProductActionType = "inactivate" | "activate" | "remove";

interface Product {
  sku: string;
  name: string;
  image: string;
  quantity: number;
  status: "Active" | "Inactive";
  discount?: string;
  disValue?: string;
  sellingPrice?: string;
  promoEnds?: string;
  category?: string;
  brand?: string;
  seller?: string;
  updatedOn?: string;
}

interface ProductDetailsDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: "default" | "inventory";
}

type InventorySellerRow = {
  name: string;
  sellingPrice: string;
  tax: string;
  expDate: string;
  promoEnds: string;
};

const INVENTORY_SELLERS = [
  { name: "Blu Pharmacy, Milan", sellingPrice: "€50.00", tax: "23.00", expDate: "2026-01-05", promoEnds: "2026-09-05" },
  { name: "Medilux Net, Rome", sellingPrice: "€55.00", tax: "21.00", expDate: "2026-01-09", promoEnds: "2026-09-08" },
  { name: "Cura Pharmacy, Naples", sellingPrice: "€60.00", tax: "22.00", expDate: "2026-01-17", promoEnds: "2026-09-12" },
  { name: "Wellness Care, Florence", sellingPrice: "€45.00", tax: "20.00", expDate: "2026-02-03", promoEnds: "2026-09-16" },
  { name: "Vita Care Farma, Turin", sellingPrice: "€70.00", tax: "19.00", expDate: "2026-02-11", promoEnds: "2026-09-20" },
  { name: "GreenAid Pharmacy, Bologna", sellingPrice: "€59.00", tax: "18.00", expDate: "2026-02-18", promoEnds: "2026-09-23" },
  { name: "MediPlus, Verona", sellingPrice: "€63.00", tax: "21.00", expDate: "2026-03-02", promoEnds: "2026-09-25" },
  { name: "Farmacia Sorrisi, Genoa", sellingPrice: "€51.50", tax: "20.00", expDate: "2026-03-11", promoEnds: "2026-09-28" },
  { name: "Life Pharmacy, Bari", sellingPrice: "€42.00", tax: "20.00", expDate: "2026-03-19", promoEnds: "2026-09-30" },
];

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6F72"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium font-inter text-[#6B6F72] mb-1">{label}</p>
      <p className="text-[14px] font-inter font-semibold text-[#000000]">{value}</p>
    </div>
  );
}

function ProductMedia({
  allImages,
  activeIdx,
  setActiveIdx,
  showAll,
  setShowAll,
  largeHeight = "h-[256px]",
}: {
  allImages: string[];
  activeIdx: number;
  setActiveIdx: (index: number) => void;
  showAll: boolean;
  setShowAll: (value: boolean) => void;
  largeHeight?: string;
}) {
  const visibleCount = 4;
  const visibleThumbs = showAll ? allImages : allImages.slice(0, visibleCount);
  const hiddenCount = allImages.length - visibleCount;

  return (
    <div className="flex flex-col gap-2 flex-shrink-0">
      <div className={`w-[300px] ${largeHeight} rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-6xl overflow-hidden`}>
        {allImages[activeIdx]?.startsWith("blob:") || allImages[activeIdx]?.startsWith("http") || allImages[activeIdx]?.startsWith("/")
          ? <img src={allImages[activeIdx]} alt="" className="w-full h-full object-cover" />
          : allImages[activeIdx]}
      </div>

      <div className="flex items-center gap-1.5">
        {visibleThumbs.map((img, i) => (
          <button
            key={`${img}-${i}`}
            onClick={() => setActiveIdx(i)}
            className={`w-[54px] h-[54px] rounded-lg border flex items-center justify-center text-lg flex-shrink-0 transition-all overflow-hidden ${
              activeIdx === i
                ? "border-[#1192E8] bg-blue-50"
                : "border-[#E5E7EB] bg-gradient-to-br from-orange-50 to-red-100"
            }`}
          >
            {img.startsWith("blob:") || img.startsWith("http") || img.startsWith("/")
              ? <img src={img} alt="" className="w-full h-full object-cover" />
              : img}
          </button>
        ))}
        {!showAll && hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-[54px] h-[54px] rounded-lg bg-black/85 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
          >
            +{hiddenCount}
          </button>
        )}
      </div>
    </div>
  );
}

function InventorySellerTable({
  openBulkModal,
}: {
  openBulkModal: (action: ProductActionType) => void;
}) {
  const columns: Column<InventorySellerRow>[] = [
    {
      key: "name",
      label: "Sellers",
      sortable: true,
      width: "38%",
      render: (value) => <span className="text-[#1192E8] text-[12px]">{value}</span>,
    },
    {
      key: "sellingPrice",
      label: "Selling Price",
      sortable: true,
      width: "16%",
      render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
    },
    {
      key: "expDate",
      label: "Exp Date",
      sortable: true,
      width: "18%",
      render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
    },
    {
      key: "promoEnds",
      label: "Promo Ends",
      sortable: true,
      width: "18%",
      render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
    },
  ];

  return (
    <DataTable<InventorySellerRow>
      columns={columns}
      data={INVENTORY_SELLERS}
      rowKey={(row) => row.name}
      searchFields={["name", "sellingPrice", "expDate", "promoEnds"]}
      searchPlaceholder="Search sellers..."
      showCheckboxes={true}
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
              onClick={() => openBulkModal("inactivate")}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Inactive from Selections
            </button>
            <button
              onClick={() => openBulkModal("remove")}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#DA1E28] border border-[#DA1E28] rounded-lg hover:bg-red-50 transition-colors bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Remove From Selections
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
      pageSize={9}
      headerBackground="#F7F9FC"
    />
  );
}

export default function ProductDetailsDrawer({
  product,
  isOpen,
  onClose,
  variant = "default",
}: ProductDetailsDrawerProps) {
  const allImages = product ? [
    product.image,
    "🧴",
    "💊",
    "💉",
    "🧬",
    "🩺",
  ] : [];

  const [activeIdx, setActiveIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [modalAction, setModalAction] = useState<ProductActionType | null>(null);
  const [modalIsBulk, setModalIsBulk] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!product) return null;

  const isInventory = variant === "inventory";
  const detailTitle = isInventory ? "View full master product information" : "View and manage seller-specific product information";
  const basePrice = product.disValue ?? "€100.00";
  const sellingPrice = product.sellingPrice ?? "€95.00";
  const discount = product.discount ?? "05%";
  const promoEnds = product.promoEnds ?? product.updatedOn ?? "2026-09-30";
  const sellerName = product.seller ?? "Herba Salus Parapharmacy, Via Gramoci, 211/b..";
  const category = product.category ?? "Pain Relief";
  const brand = product.brand ?? "Brand Name here";

  const openBulkModal = (action: ProductActionType) => {
    setModalAction(action);
    setModalIsBulk(true);
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/85 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[880px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[18px] font-semibold text-black">Product Details</h2>
            <p className="text-[12px] font-medium font-inter text-[#6B6F72] mt-0.5">{detailTitle}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {isInventory ? (
            <>
              <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4">
                <div className="flex gap-5">
                  <ProductMedia
                    allImages={allImages}
                    activeIdx={activeIdx}
                    setActiveIdx={setActiveIdx}
                    showAll={showAll}
                    setShowAll={setShowAll}
                    largeHeight="h-[220px]"
                  />

                  <div className="flex-1 min-w-0 flex flex-col gap-4">
                    <div>
                      <h3 className="text-[22px] font-bold text-[#1E3862] leading-snug mb-2">
                        {product.name}
                      </h3>
                      <p className="text-[13px] font-medium text-[#6B6F72] mb-2">
                        SKU: <span className="text-[#1192E8]">{product.sku}</span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <LocationIcon />
                        <span className="text-[13px] text-[#1E3862] font-medium">{sellerName}</span>
                      </div>
                    </div>

                    <div className="border border-[#EDF2FB] bg-[#F8F8F8] rounded-xl p-3">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <InfoCell label="Category" value={category} />
                        <InfoCell label="Brand" value={brand} />
                      </div>
                    </div>

                  </div>
                </div>

                <InventorySellerTable openBulkModal={openBulkModal} />
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Description</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  Fillerina Extra Comfort Fluid Foundation SPF15 is an advanced makeup treatment that combines
                  coverage, hydration, and sun protection in a single formula. It contains the patented complex
                  of 6 hyaluronic acids, for a smoothing, plumping, and hydrating action visible from the first application.
                </p>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed mt-2">
                  The creamy, fluid texture blends seamlessly with the skin, leaving a light, silky finish that evens
                  out the complexion and softens the appearance of visible discoloration and imperfections without
                  weighing the skin down.
                </p>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Main benefits</h4>
                <ul className="space-y-1.5">
                  {[
                    "Medium buildable coverage",
                    "Formula with 6 patented Hyaluronic Acids",
                    "Deep and long-lasting hydration",
                    "SPF 15 sun protection",
                    "Fluid, light and silky texture",
                    "Hypoallergenic and non-comedogenic",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-[14px] text-[#6B6F72]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#6B6F72] flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Format and variants</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  30 ml tube
                  <br />
                  Available in 6 shades to suit every skin tone.
                  <br />
                  Codes: 03032, 03033, 03034, 03035, 03036, 03037
                </p>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Directions Of Use</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  Apply the fluid foundation in a circular motion using a sponge, brush, or fingertips.
                  Build coverage gradually and blend evenly from the center of the face outward.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex gap-5">
                  <ProductMedia
                    allImages={allImages}
                    activeIdx={activeIdx}
                    setActiveIdx={setActiveIdx}
                    showAll={showAll}
                    setShowAll={setShowAll}
                  />

                  <div className="flex-1 min-w-0 flex flex-col gap-4">
                    <div>
                      <h3 className="text-[20px] font-bold text-[#1E3862] leading-snug mb-2">
                        {product.name}
                      </h3>
                      <p className="text-[14px] font-medium text-[#6B6F72] mb-1.5">
                        SKU: <span className="text-[#1192E8] font-medium">{product.sku}</span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <LocationIcon />
                        <span className="text-[14px] text-[#1E3862] font-medium">
                          {sellerName}
                        </span>
                      </div>
                    </div>

                    <div className="border border-[#EDF2FB] bg-[#F8F8F8] rounded-xl mt-2 p-3">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                        <InfoCell label="Base Price" value={basePrice} />
                        <InfoCell label="Discount Value" value={product.disValue ?? "€100.00"} />
                        <InfoCell label="Discount %" value={discount} />
                        <InfoCell label="Selling Price %" value={sellingPrice} />
                        <InfoCell label="Quantity" value={String(product.quantity)} />
                        <InfoCell label="Promotion Ends" value={promoEnds} />
                        <InfoCell label="Bookable" value="Yes" />
                        <InfoCell label="Category" value={category} />
                        <InfoCell label="Brand" value={brand} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Description</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  Filterina Extra Comfort Fluid Foundation SPF15 is an advanced makeup treatment that combines
                  coverage, hydration, and sun protection in a single formula. It contains the patented complex
                  of 6 hyaluronic acids, for a smoothing, plumping, and hydrating action visible from the first application.
                </p>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed mt-2">
                  The creamy, fluid texture blends seamlessly with the skin, leaving a light, silky film that evens
                  out skin tone and reduces discolorations and imperfections without weighing it down. Ideal for daily
                  use, even on sensitive skin, thanks to the hypoallergenic, non-comedogenic formula, tested for nickel,
                  chromium, and cobalt.
                </p>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Main benefits</h4>
                <ul className="space-y-1.5">
                  {[
                    "Medium buildable coverage",
                    "Formula with 6 patented Hyaluronic Acids",
                    "Deep and long-lasting hydration",
                    "SPF 15 sun protection",
                    "Fluid, light and silky texture",
                    "Hypoallergenic and non-comedogenic",
                    "Nickel, chromium and cobalt tested",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-[14px] text-[#6B6F72]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#6B6F72] flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Format and variants</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  30 ml tube
                  <br />
                  Available in 6 shades to suit every skin tone:
                  <br />
                  Cod: 03032, 03033, 03034, 03035, 03036, 03037
                  <br />
                  Validity after opening: 6 months
                </p>
              </div>
              
            </>
          )}
        </div>
      </div>
      <ProductActionModal
        open={modalAction !== null}
        actionType={modalAction}
        isBulk={modalIsBulk}
        isInventory={true}
        onClose={() => setModalAction(null)}
        onConfirm={() => { setModalAction(null); }}
      />
    </>
  );
}
