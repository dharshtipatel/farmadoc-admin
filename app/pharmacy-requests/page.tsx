"use client";

import { useState } from "react";
import DataTable, { Column } from "../components/DataTable";
import ExportDropdown from "../components/exportdropdown";
import RejectPharmacyModal from "../components/RejectPharmacyModal";
import ReviewPharmacyDrawer from "../components/ReviewPharmacyDrawer";

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface PharmacyRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  mapUrl: string;
  reqOn: string;
  status: RequestStatus;
}

const REQUESTS: PharmacyRequest[] = [
  { id: "1",  name: "City Pharmacy",      email: "pharmacy@city.com",       phone: "+39 123 4567890", location: "Via Cremona, 25, Bozzolo Mantova, 460..",         mapUrl: "https://www.google...", reqOn: "24-04-2026", status: "Pending" },
  { id: "2",  name: "Health Hub",         email: "hospital@city.com",       phone: "+39 234 5678901", location: "Piazza della Repubblica, 12, Milano, 201..",      mapUrl: "https://www.google...", reqOn: "25-04-2026", status: "Pending" },
  { id: "3",  name: "Wellness Corner",    email: "clinic@city.com",         phone: "+39 345 6789012", location: "Corso Italia, 45, Firenze, 50123.",               mapUrl: "https://www.google...", reqOn: "26-04-2026", status: "Pending" },
  { id: "4",  name: "Urban Care",         email: "doctor@city.com",         phone: "+39 456 7890123", location: "Via Roma, 90, Torino, 10121.",                    mapUrl: "https://www.google...", reqOn: "27-04-2026", status: "Pending" },
  { id: "5",  name: "PharmaPlus",         email: "dentist@city.com",        phone: "+39 567 8901234", location: "Viale dei Mille, 14, Bologna, 40121.",            mapUrl: "https://www.google...", reqOn: "28-04-2026", status: "Pending" },
  { id: "6",  name: "Rx Solutions",       email: "optometrist@city.com",    phone: "+39 678 9012345", location: "Largo di Torre Argentina, 3, Roma, 0018..",       mapUrl: "https://www.google...", reqOn: "29-04-2026", status: "Pending" },
  { id: "7",  name: "Community Health",   email: "veterinary@city.com",     phone: "+39 789 0123456", location: "Via Garibaldi, 7, Genova, 16124.",                mapUrl: "https://www.google...", reqOn: "30-04-2026", status: "Pending" },
  { id: "8",  name: "Pharmacy Express",   email: "nutritionist@city.com",   phone: "+39 890 1234567", location: "Piazza del Campo, 1, Siena, 53100.",             mapUrl: "https://www.google...", reqOn: "01-05-2026", status: "Pending" },
  { id: "9",  name: "Nature's Remedy",    email: "therapist@city.com",      phone: "+39 901 2345678", location: "Via D'Azeglio, 28, Modena, 41121.",              mapUrl: "https://www.google...", reqOn: "02-05-2026", status: "Pending" },
  { id: "10", name: "Family Pharmacy",    email: "chiropractor@city.com",   phone: "+39 012 3456789", location: "Corso Vittorio Emanuele II, 23, Napoli,..",       mapUrl: "https://www.google...", reqOn: "03-05-2026", status: "Pending" },
  { id: "11", name: "Vitality Pharmacy",  email: "pediatrician@city.com",   phone: "+39 135 2467890", location: "Viale della Libertà, 22, Palermo, 90100.",       mapUrl: "https://www.google...", reqOn: "04-05-2026", status: "Pending" },
  { id: "12", name: "CareFirst Pharmacy", email: "physiotherapist@city.com", phone: "+39 246 3578901", location: "Via XX Settembre, 75, Catania, 95100.",         mapUrl: "https://www.google...", reqOn: "05-05-2026", status: "Pending" },
  { id: "13", name: "Nature's Remedy",    email: "therapist@city.com",      phone: "+39 901 2345678", location: "Via D'Azeglio, 28, Modena, 41121.",              mapUrl: "https://www.google...", reqOn: "02-05-2026", status: "Pending" },
  { id: "14", name: "Family Pharmacy",    email: "chiropractor@city.com",   phone: "+39 012 3456789", location: "Corso Vittorio Emanuele II, 23, Napoli,..",       mapUrl: "https://www.google...", reqOn: "03-05-2026", status: "Pending" },
  { id: "15", name: "Vitality Pharmacy",  email: "pediatrician@city.com",   phone: "+39 135 2467890", location: "Viale della Libertà, 22, Palermo, 90100.",       mapUrl: "https://www.google...", reqOn: "04-05-2026", status: "Pending" },
  { id: "16", name: "CareFirst Pharmacy", email: "physiotherapist@city.com", phone: "+39 246 3578901", location: "Via XX Settembre, 75, Catania, 95100.",         mapUrl: "https://www.google...", reqOn: "05-05-2026", status: "Pending" },
];

type DateFilter = "All" | "This Week" | "This Month";

export default function PharmaciesRequestsPage() {
  const [requests, setRequests]             = useState<PharmacyRequest[]>(REQUESTS);
  const [openMenu, setOpenMenu]             = useState<string | null>(null);
  const [dateFilter, setDateFilter]         = useState<DateFilter>("All");
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
  const [bulkCount, setBulkCount]           = useState(0);
  const [viewRequest, setViewRequest] = useState<PharmacyRequest | null>(null);

  const columns: Column<PharmacyRequest>[] = [
    {
      key: "name",
      label: "Pharmacy",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] font-medium text-[#21272A]">{value}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <a href={`mailto:${value}`} className="text-[13px] text-[#1192E8] hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] text-[#1192E8]">{value}</span>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] text-[#6B6F72] line-clamp-1">{value}</span>
      ),
    },
    {
      key: "mapUrl",
      label: "Map URL",
      render: (value) => (
        <a href="#" className="text-[13px] text-[#1192E8] hover:underline">{value}</a>
      ),
    },
    {
      key: "reqOn",
      label: "Req on",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] text-[#6B6F72]">{value}</span>
      ),
    },
  ];

  const getFilteredRequests = () => {
  if (dateFilter === "All") return requests;

  const now = new Date();

  if (dateFilter === "This Week") {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    return requests.filter((r) => {
      const [day, month, year] = r.reqOn.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date >= startOfWeek && date <= now;
    });
  }

  if (dateFilter === "This Month") {
    return requests.filter((r) => {
      const [day, month, year] = r.reqOn.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  }

  return requests;
};

const filteredRequests = getFilteredRequests();

  return (
    <div className="w-full font-inter">
      {/* Page Title */}
      <div className="mb-5">
        <h1 className="text-[18px] font-semibold text-black">Pharmacies Requests</h1>
        <p className="text-[12px] font-medium text-[#6B6F72] mt-1">
          Manage and monitor pharmacies Request
        </p>
      </div>

      <DataTable<PharmacyRequest>
        columns={columns}
        data={filteredRequests}
        rowKey={(r) => r.id}
        searchPlaceholder="Search here..."
        showCheckboxes={true}
        toolbarRight={
          <div className="flex items-center gap-2">
            {(["All", "This Week", "This Month"] as DateFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap border ${
                  dateFilter === f
                    ? "border-[#1192E8] text-[#1192E8] bg-white"
                    : "border-[#D6DADD] text-[#6B6F72] bg-white hover:border-[#1192E8] hover:text-[#1192E8]"
                }`}
              >
                {f}
              </button>
            ))}
            <ExportDropdown />
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
                onClick={() => { setBulkCount(selectedCount); setBulkRejectOpen(true); }}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#DA1E28] border border-[#DA1E28] rounded-lg hover:bg-red-50 transition-colors bg-white"
              >
                Reject Selection
              </button>
              <button
                  onClick={() => console.log("Mark Inactive")}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#1192E8] border border-[#1192E8] rounded-lg hover:bg-blue-50 transition-colors bg-white"
                >
                  Verify & Approved
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
        renderRowActions={(request) => (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenu(openMenu === request.id ? null : request.id)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors text-lg"
            >
              ⋮
            </button>
            {openMenu === request.id && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[170px]">

                <button
                  onClick={() => { setOpenMenu(null); setViewRequest(request); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Details
                </button>

                <div className="mx-3 border-t border-[#F0F2F4]" />

                <button
                  onClick={() => { setOpenMenu(null); setRejectTargetId(request.id); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#DA1E28] hover:bg-red-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Reject Request
                </button>
              </div>
            )}
          </div>
        )}
        customFilter={(request, query) => {
          const q = query.toLowerCase();
          return (
            request.name.toLowerCase().includes(q) ||
            request.email.toLowerCase().includes(q) ||
            request.location.toLowerCase().includes(q) ||
            request.phone.toLowerCase().includes(q)
          );
        }}
      />

      {/* Single Reject Modal */}
      <RejectPharmacyModal
        open={rejectTargetId !== null}
        isBulk={false}
        onClose={() => setRejectTargetId(null)}
        onConfirm={(reasons, note) => {
          console.log("Reject single", rejectTargetId, reasons, note);
          setRejectTargetId(null);
        }}
      />

      {/* Bulk Reject Modal */}
      <RejectPharmacyModal
        open={bulkRejectOpen}
        isBulk={true}
        selectedCount={bulkCount}
        onClose={() => setBulkRejectOpen(false)}
        onConfirm={(reasons, note) => {
          console.log("Bulk reject", reasons, note);
          setBulkRejectOpen(false);
        }}
      />

      <ReviewPharmacyDrawer
        request={viewRequest}
        isOpen={viewRequest !== null}
        onClose={() => setViewRequest(null)}
        onReject={(id) => {
          setViewRequest(null);
          setRejectTargetId(id);
        }}
        onApprove={(id) => {
          console.log("Approve", id);
          setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "Approved" } : r));
        }}
      />
    </div>
  );
}