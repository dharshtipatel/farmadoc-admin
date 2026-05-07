"use client";

import { useEffect, useState } from "react";
import DataTable, { Column } from "../DataTable";
import ProductActionModal from "./ProductActionModal";

type ServiceActionType = "inactivate" | "activate" | "remove";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: "Active" | "Inactive";
  brand?: string;
  category?: string;
  duration?: string;
  sellerCount?: number;
  updatedOn?: string;
}

interface ServiceDetailsDrawerProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: "default" | "inventory";
}

type InventorySellerRow = {
  name: string;
  sellingPrice: string;
};

const INVENTORY_SELLERS: InventorySellerRow[] = [
  { name: "Blu Pharmacy, Milan", sellingPrice: "EUR 30.00" },
  { name: "Herba Salus, Rome", sellingPrice: "EUR 31.00" },
  { name: "Wellness Care, Naples", sellingPrice: "EUR 32.50" },
  { name: "Vita Care Farma, Turin", sellingPrice: "EUR 33.00" },
  { name: "MediPlus, Verona", sellingPrice: "EUR 29.00" },
  { name: "Farmacia Sorriso, Genoa", sellingPrice: "EUR 34.00" },
  { name: "GreenAid Pharmacy, Bologna", sellingPrice: "EUR 30.50" },
  { name: "Cura Point, Palermo", sellingPrice: "EUR 28.50" },
];

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function InventorySellerTable({
  openBulkModal,
}: {
  openBulkModal: (action: ServiceActionType) => void;
}) {
  const columns: Column<InventorySellerRow>[] = [
    {
      key: "name",
      label: "Sellers",
      sortable: true,
      width: "72%",
      render: (value) => <span className="text-[#1192E8] text-[12px]">{value}</span>,
    },
    {
      key: "sellingPrice",
      label: "Selling Price",
      sortable: true,
      width: "28%",
      render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
    },
  ];

  return (
    <DataTable<InventorySellerRow>
      columns={columns}
      data={INVENTORY_SELLERS}
      rowKey={(row) => row.name}
      searchFields={["name", "sellingPrice"]}
      searchPlaceholder="Search here..."
      showCheckboxes={true}
      pageSize={8}
      headerBackground="#F7F9FC"
      renderBulkActionBar={(selectedCount, clearSelection) => (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6DADD] bg-[#F8FAFF]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#1192E8] flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
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
              Inactive from Selections
            </button>
            <button
              onClick={() => openBulkModal("remove")}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#DA1E28] border border-[#DA1E28] rounded-lg hover:bg-red-50 transition-colors bg-white"
            >
              Remove from Selections
            </button>
            <button
              onClick={clearSelection}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    />
  );
}

export default function ServiceDetailsDrawer({
  service,
  isOpen,
  onClose,
  variant = "default",
}: ServiceDetailsDrawerProps) {
  const [modalAction, setModalAction] = useState<ServiceActionType | null>(null);
  const [modalIsBulk, setModalIsBulk] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!service) return null;

  const isInventory = variant === "inventory";
  const openBulkModal = (action: ServiceActionType) => {
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
            <h2 className="text-[18px] font-semibold text-black">Service Details</h2>
            <p className="text-[12px] font-medium text-[#6B6F72] mt-0.5">
              {isInventory ? "View full master service information" : "View and manage seller-specific Service information"}
            </p>
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
                  <div className="w-[168px] h-[168px] rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-[72px] flex-shrink-0">
                    {service.image}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-4">
                    <div>
                      <h3 className="text-[22px] font-bold text-[#1E3862] leading-snug mb-2">{service.name}</h3>
                      <p className="text-[13px] font-medium text-[#6B6F72] mb-1">
                        Service ID: <span className="text-[#1192E8]">{service.id}</span>
                      </p>
                    </div>

                    <div className="border border-[#EDF2FB] bg-[#F8F8F8] rounded-xl p-3">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <p className="text-[12px] font-medium text-[#6B6F72] mb-1">Category</p>
                          <p className="text-[14px] font-semibold text-black">{service.category || "General Care Screening"}</p>
                        </div>
                        
                        <div>
                          <p className="text-[12px] font-medium text-[#6B6F72] mb-1">Brand</p>
                          <p className="text-[14px] font-semibold text-black">{service.brand || "Brand Name Here"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <InventorySellerTable openBulkModal={openBulkModal} />
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Description</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  {service.description || "This screening service is designed to offer an easy way to monitor your health with professional guidance and fast results. It supports preventive care by helping customers identify issues early and act with confidence."}
                </p>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed mt-2">
                  The service is delivered by trained pharmacy teams using clear, step-by-step processes that keep the experience fast, safe, and approachable for walk-in customers and routine health monitoring.
                </p>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Main benefits</h4>
                <ul className="space-y-1.5">
                  {[
                    "Quick appointment workflow",
                    "Fast results with pharmacist guidance",
                    "Easy repeat checkups for regular monitoring",
                    "Comfortable and customer-friendly process",
                    "Supports preventive healthcare decisions",
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
                  In-store assisted screening
                  <br />
                  Duration varies by service type and workflow
                  <br />
                  Suitable for recurring wellness checkups
                </p>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Review Details</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  Review ID: {service.id}
                  <br />
                  Last updated: {service.updatedOn ?? "2026-05-30"}
                </p>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-black mb-2">Preparation Information</h4>
                <p className="text-[14px] text-[#6B6F72] leading-relaxed">
                  Preparation requirements may vary depending on the service. Customers should review service-specific guidance before visiting, and pharmacy staff can confirm any precautions at the time of booking.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="w-[160px] h-[160px] rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-6xl flex-shrink-0">
                    {service.image}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[20px] font-semibold text-[#1E3862] mb-1">{service.name}</h3>
                    <p className="text-[14px] font-medium text-[#1E3862] mb-3">Herba Salus Parapharmacy, Via Gramoci, 211/b..</p>

                    <div className="border border-[#F8F8F8] rounded-lg p-3">
                      <p className="text-[12px] font-medium text-[#6B6F72] mb-0.5">Base Price</p>
                      <p className="text-[14px] font-semibold text-black">EUR {service.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#21272A] mb-2">Description</h4>
                <p className="text-[12px] text-[#6B6F72] leading-relaxed">
                  The CardioCheck Cholesterol Screening offers a quick and easy way to monitor your cholesterol levels.
                  This service provides accurate results, helping you stay proactive about your heart health.
                </p>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-[#21272A] mb-2">Main benefits</h4>
                <ul className="space-y-1.5">
                  {[
                    "Comprehensive cholesterol analysis",
                    "Fast results in 10 minutes",
                    "Guidance from certified health professionals",
                    "No fasting required",
                    "Simple finger-prick test",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-[12px] text-[#6B6F72]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#6B6F72] flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {isInventory && (
        <ProductActionModal
          open={modalAction !== null}
          actionType={modalAction}
          isBulk={modalIsBulk}
          itemLabel="Service"
          copyVariant="serviceDetailsInventory"
          onClose={() => setModalAction(null)}
          onConfirm={() => {
            setModalAction(null);
          }}
        />
      )}
    </>
  );
}
