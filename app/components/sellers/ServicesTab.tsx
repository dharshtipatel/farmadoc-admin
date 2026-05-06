"use client";

import { useState } from "react";
import DataTable, { Column } from "../DataTable";
import ImportSellersModal from "./ImportSeller";
import ProductActionModal from "./ProductActionModal";
import ExportDropdown from "../exportdropdown";
import ServiceDetailsDrawer from "./ServiceDetailsDrawer";
import EditServiceDrawer from "./EditServiceDrawer";

type ServiceStatus = "Active" | "Inactive";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: ServiceStatus;
}

const INITIAL_SERVICES: Service[] = [
  { id: "svc-001", name: "Cholesterol Screening", description: "Simple finger prick test for diabetes screening...", image: "🩸", price: 30, status: "Active"   },
  { id: "svc-002", name: "Blood Glucose Test",    description: "Simple finger prick test for diabetes screening...", image: "💉", price: 31, status: "Inactive" },
  { id: "svc-003", name: "ECG Test",              description: "Simple finger prick test for diabetes screening...", image: "🏥", price: 32, status: "Active"   },
  { id: "svc-004", name: "Sugar Test",            description: "Simple finger prick test for diabetes screening...", image: "🔬", price: 23, status: "Active"   },
  { id: "svc-005", name: "Blood Glucose Test",    description: "Simple finger prick test for diabetes screening...", image: "💉", price: 34, status: "Active"   },
];

export default function ServicesTab({ seller }: { seller: { shortName: string; name: string } }) {
  const [services, setServices]     = useState<Service[]>(INITIAL_SERVICES);
  const [openMenu, setOpenMenu]     = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"inactivate" | "activate" | "remove" | null>(null);
const [modalIsBulk, setModalIsBulk] = useState(false);
const [modalTargetId, setModalTargetId] = useState<string | null>(null);
const [viewService, setViewService] = useState<Service | null>(null);
const [editService, setEditService] = useState<Service | null>(null);

const openSingleModal = (action: "inactivate" | "activate" | "remove", id: string) => {
  setModalAction(action);
  setModalIsBulk(false);
  setModalTargetId(id);
};

const openBulkModal = (action: "inactivate" | "activate" | "remove") => {
  setModalAction(action);
  setModalIsBulk(true);
  setModalTargetId(null);
};

  const hasServices = services.length > 0;

  const columns: Column<Service>[] = [
    {
      key: "name",
      label: "Service",
      sortable: true,
      render: (_, service) => (
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-lg flex-shrink-0">
            {service.image}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#21272A]">{service.name}</p>
            <p className="text-[11px] text-[#6B6F72] line-clamp-1">{service.description}</p>
          </div>
        </div>
      ),
      width: "280px",
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] text-[#6B6F72]">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: ServiceStatus) => (
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: value === "Active" ? "#24A148" : "#6B6F72" }}
          />
          <span
            className="text-[13px] font-medium"
            style={{ color: value === "Active" ? "#24A148" : "#6B6F72" }}
          >
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
          <h1 className="text-[16px] font-semibold text-black">Seller Services</h1>
          <p className="text-[12px] text-[#6B6F72] mt-0.5">
            Manage all services offered by this seller, including pricing, discounts, and availability settings.
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
          Import Services
        </button>
      </div>

      {!hasServices ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[15px] font-semibold text-[#21272A] mb-1">No Services Available</p>
          <p className="text-[13px] text-[#6B6F72] max-w-[300px] leading-relaxed">
            Add services for this seller so they are visible in the seller profile and available for customers.
          </p>
        </div>
      ) : (
        <DataTable<Service>
  columns={columns}
  data={services}
  rowKey={(s) => s.id}
  searchPlaceholder="Search here..."
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
            onClick={() => { setOpenMenu(null); setEditService(service); }}
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
    return service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q);
  }}
/>
      )}

      <ImportSellersModal
        open={importOpen}
        mode="service"
        onClose={() => setImportOpen(false)}
        />

        <ProductActionModal
        open={modalAction !== null}
        actionType={modalAction}
        isBulk={modalIsBulk}
        onClose={() => setModalAction(null)}
        onConfirm={() => {
            console.log("Confirmed", modalAction, modalIsBulk ? "bulk" : modalTargetId);
            setModalAction(null);
        }}
        />

        <ServiceDetailsDrawer
  service={viewService}
  isOpen={viewService !== null}
  onClose={() => setViewService(null)}
/>

<EditServiceDrawer
  service={editService}
  isOpen={editService !== null}
  onClose={() => setEditService(null)}
  onSave={(updated) => {
    setServices((prev) => prev.map((s) => s.id === updated.id ? updated : s));
    setEditService(null);
  }}
/>
    </div>
  );
}