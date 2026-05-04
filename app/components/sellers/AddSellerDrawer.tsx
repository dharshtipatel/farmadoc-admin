"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface WorkingHour {
  open: boolean;
  from: string;
  to: string;
}

interface FormData {
  // Step 1: Basic Info
  pharmacyName: string;
  whatsappNumber: string;
  ownerName: string;
  aboutSeller: string;
  sellerType: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;

  // Step 2: Working Hours
  workingHours: Record<string, WorkingHour>;

  // Step 3: Platform Features
  pharmacy: boolean;
  showroom: boolean;
  serviceScheduler: boolean;

  // Step 4: Payment Methods
  cash: boolean;
  creditCard: boolean;
  onlinePayment: boolean;
  loyaltyCards: boolean;
  loyaltyCardAssistant: boolean;
  digitalWallet: boolean;

  // Step 5: Review (read-only)
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

const STEPS = [
  "Basic Information",
  "Working Hours",
  "Platform Features",
  "Payment Methods",
  "Review & Submit",
];

const STEP_LABELS = [
  "Basic Info",
  "Working Hours",
  "Platform Features",
  "Payment Methods",
  "Review & Publish",
];

// ── Icons ────────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className="relative inline-flex items-center flex-shrink-0 h-5 w-9 rounded-full transition-colors duration-200"
    style={{ backgroundColor: checked ? "#1E3862" : "#D6DADD" }}
  >
    <span
      className="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
      style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
    />
  </button>
);

// ── Input ─────────────────────────────────────────────────────────────────────
const Input = ({
  label, value, onChange, placeholder, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[12px] font-medium text-[#6B6F72]">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || label}
      className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white transition-colors"
    />
  </div>
);

// ── Select ────────────────────────────────────────────────────────────────────
const Select = ({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[12px] font-medium text-[#6B6F72]">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] bg-white transition-colors"
    >
      <option value="">{placeholder || `Select ${label}`}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// ── CheckboxCard ──────────────────────────────────────────────────────────────
const CheckboxCard = ({
  checked, onChange, label, description,
}: {
  checked: boolean; onChange: () => void; label: string; description?: string;
}) => (
  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-[#E8EAED] hover:border-[#1192E8] hover:bg-blue-50/30 transition-all">
    <div
      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
      style={{ backgroundColor: checked ? "#1E3862" : "transparent", border: checked ? "none" : "1.5px solid #D6DADD" }}
      onClick={onChange}
    >
      {checked && <CheckIcon />}
    </div>
    <div>
      <p className="text-[13px] font-medium text-[#21272A]">{label}</p>
      {description && <p className="text-[11px] text-[#6B6F72] mt-0.5 leading-relaxed">{description}</p>}
    </div>
  </label>
);

// ── ReviewRow ─────────────────────────────────────────────────────────────────
const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] text-[#6B6F72] font-medium">{label}</span>
    <span className="text-[13px] text-[#21272A] font-medium">{value || "—"}</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
type Props = { open: boolean; onClose: () => void };

export default function AddSellerDrawer({ open, onClose }: Props) {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<FormData>({
    pharmacyName: "",
    whatsappNumber: "",
    ownerName: "",
    aboutSeller: "",
    sellerType: "",
    streetAddress: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    latitude: "",
    longitude: "",
    workingHours: Object.fromEntries(
      DAYS.map((d) => [d, { open: d !== "Sun", from: "09:00", to: "18:00" }])
    ),
    pharmacy: true,
    showroom: false,
    serviceScheduler: false,
    cash: true,
    creditCard: true,
    onlinePayment: false,
    loyaltyCards: false,
    loyaltyCardAssistant: false,
    digitalWallet: false,
  });

  const set = (key: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setWH = (day: string, field: keyof WorkingHour, value: boolean | string) =>
    setForm((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: { ...prev.workingHours[day], [field]: value },
      },
    }));

  const handleClose = () => { setStep(0); onClose(); };

  return (
    <>
      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-50 bg-black/85" onClick={handleClose} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white border-l border-[#E8EAED] flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: "880px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F2F4] flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-[#21272A]">Add New Seller</h2>
            <p className="text-[12px] text-[#6B6F72] mt-0.5">Register a new seller on the plateform</p>
          </div>
          <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* ── Step Indicator ── */}
        <div className="px-5 py-4 border-b border-[#E8EAED] flex-shrink-0">
            <div className="flex items-start">
                {STEP_LABELS.map((label, i) => (
                <div key={i} className="flex items-start flex-1 last:flex-none">

                    {/* Step bubble + label */}
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors flex-shrink-0"
                        style={{
                        backgroundColor: i <= step ? "#1E3862" : "#E8EAED",
                        color: i <= step ? "#fff" : "#A8AAAC",
                        }}
                    >
                        {i < step ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white"
                            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        ) : (
                        `0${i + 1}`
                        )}
                    </div>
                    <span
                        className="text-[10px] font-medium whitespace-nowrap text-center"
                        style={{ color: i <= step ? "#1E3862" : "#A8AAAC" }}
                    >
                        {label}
                    </span>
                    </div>

                    {/* Connector line — centered at circle height (h-7 = 28px, so top 14px = center) */}
                    {i < STEP_LABELS.length - 1 && (
                    <div className="flex-1 flex items-start" style={{ paddingTop: "13px" }}>
                        <div
                        className="w-full h-[2px] rounded"
                        style={{ backgroundColor: i < step ? "#1E3862" : "#E8EAED" }}
                        />
                    </div>
                    )}

                </div>
                ))}
            </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Step 1: Basic Information ── */}
          {step === 0 && (
            <div className="flex flex-col gap-5">

                {/* ── Basic Information ── */}
                <p className="text-[18px] font-semibold text-black font-inter">Basic Information</p>

                {/* Row 1: Seller Name + Phone */}
                <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">
                    Seller Name <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="text"
                    value={form.pharmacyName}
                    onChange={(e) => set("pharmacyName", e.target.value)}
                    placeholder="Enter pharmacy name"
                    className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">
                    Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="tel"
                    value={form.whatsappNumber}
                    onChange={(e) => set("whatsappNumber", e.target.value)}
                    placeholder="Enter phone number"
                    className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                    />
                </div>
                </div>

                {/* Row 2: WhatsApp + Email */}
                <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">WhatsApp Number</label>
                    <input
                    type="tel"
                    value={form.whatsappNumber}
                    onChange={(e) => set("whatsappNumber", e.target.value)}
                    placeholder="Enter WhatsApp number"
                    className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">Email</label>
                    <input
                    type="email"
                    value={form.ownerName}
                    onChange={(e) => set("ownerName", e.target.value)}
                    placeholder="Enter email address"
                    className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                    />
                </div>
                </div>

                {/* Row 3: About Seller + Logo Upload */}
                <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">About Seller</label>
                    <textarea
                    value={form.sellerType}
                    onChange={(e) => set("sellerType", e.target.value)}
                    placeholder="Type here about Seller"
                    rows={4}
                    className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white resize-none"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                    <label className="text-[14px] font-medium text-black font-inter">Seller&apos;s Logo</label>
                    <span className="text-[12px] text-[#A8AAAC]">(Upload 1 X 1 PNG/JPG/JPEG, 1MB Max)</span>
                    </div>
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#D6DADD] rounded-lg cursor-pointer hover:border-[#1192E8] hover:bg-blue-50/20 transition-all"
                    style={{ minHeight: "100px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                        fill="none" stroke="#A8AAAC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                    <span className="text-[11px] text-[#A8AAAC] mt-1.5">Upload Seller&apos;s Logo</span>
                    <input type="file" accept="image/png,image/jpg,image/jpeg" className="hidden" />
                    </label>
                </div>
                </div>

                {/* ── Location ── */}
                <div className="border-t border-[#F0F2F4] pt-4">
                <p className="text-[14px] font-semibold text-[#21272A] mb-3">Location</p>
                <div className="flex flex-col gap-3">

                    {/* Street Address full width */}
                    <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">
                        Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.streetAddress}
                        onChange={(e) => set("streetAddress", e.target.value)}
                        placeholder="Shop, Building, Street,"
                        className="w-full px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                    />
                    </div>

                    {/* City + Region */}
                    <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-medium text-black font-inter">
                        City <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="text"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        placeholder="Enter city name"
                        className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-medium text-black font-inter">
                        Region <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="text"
                        value={form.region}
                        onChange={(e) => set("region", e.target.value)}
                        placeholder="Region"
                        className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                        />
                    </div>
                    </div>

                    {/* Postal Code + Country */}
                    <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-medium text-black font-inter">
                        Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="text"
                        value={form.postalCode}
                        onChange={(e) => set("postalCode", e.target.value)}
                        placeholder="Enter Postal Code"
                        className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-medium text-black font-inter">Country</label>
                        <select
                        value={form.country}
                        onChange={(e) => set("country", e.target.value)}
                        className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] bg-white"
                        >
                        <option value="Italy">Italy</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="Portugal">Portugal</option>
                        </select>
                    </div>
                    </div>
                </div>
                </div>

                {/* ── Lat & Long ── */}
                <div className="border-t border-[#F0F2F4] pt-4">
                <p className="text-[14px] font-semibold text-[#21272A] mb-3">Lat & Long</p>
                <div className="grid grid-cols-2 gap-4">

                    {/* Latitude stepper */}
                    <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">
                        Latitude <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-[#D6DADD] rounded-lg overflow-hidden">
                        <button
                        type="button"
                        onClick={() => set("latitude", String((parseFloat(form.latitude || "4") - 0.000000001).toFixed(9)))}
                        className="w-8 h-9 flex items-center justify-center bg-[#F4F6F8] hover:bg-gray-200 text-[#21272A] text-base flex-shrink-0 transition-colors border-r border-[#D6DADD]"
                        >−</button>
                        <div className="flex-1 flex items-center">
                        <input
                            type="text"
                            value={form.latitude || "4.000000000"}
                            onChange={(e) => set("latitude", e.target.value)}
                            className="flex-1 px-2 py-2 text-[12px] text-[#21272A] outline-none bg-white text-center"
                        />
                        <span className="text-[11px] text-[#6B6F72] pr-2 flex-shrink-0">°N</span>
                        </div>
                        <button
                        type="button"
                        onClick={() => set("latitude", String((parseFloat(form.latitude || "4") + 0.000000001).toFixed(9)))}
                        className="w-8 h-9 flex items-center justify-center bg-[#F4F6F8] hover:bg-gray-200 text-[#21272A] text-base flex-shrink-0 transition-colors border-l border-[#D6DADD]"
                        >+</button>
                    </div>
                    </div>

                    {/* Longitude stepper */}
                    <div className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">
                        Longitude <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-[#D6DADD] rounded-lg overflow-hidden">
                        <button
                        type="button"
                        onClick={() => set("longitude", String((parseFloat(form.longitude || "4") - 0.000000001).toFixed(9)))}
                        className="w-8 h-9 flex items-center justify-center bg-[#F4F6F8] hover:bg-gray-200 text-[#21272A] text-base flex-shrink-0 transition-colors border-r border-[#D6DADD]"
                        >−</button>
                        <div className="flex-1 flex items-center">
                        <input
                            type="text"
                            value={form.longitude || "4.000000000"}
                            onChange={(e) => set("longitude", e.target.value)}
                            className="flex-1 px-2 py-2 text-[12px] text-[#21272A] outline-none bg-white text-center"
                        />
                        <span className="text-[11px] text-[#6B6F72] pr-2 flex-shrink-0">°E</span>
                        </div>
                        <button
                        type="button"
                        onClick={() => set("longitude", String((parseFloat(form.longitude || "4") + 0.000000001).toFixed(9)))}
                        className="w-8 h-9 flex items-center justify-center bg-[#F4F6F8] hover:bg-gray-200 text-[#21272A] text-base flex-shrink-0 transition-colors border-l border-[#D6DADD]"
                        >+</button>
                    </div>
                    </div>

                </div>
                </div>

            </div>
            )}

          {/* ── Step 2: Working Hours ── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
                <p className="text-[18px] font-semibold text-black font-inter">Working Hours</p>

                <div className="flex flex-col gap-0">
                {DAYS.map((day, i) => {
                    const wh = form.workingHours[day];
                    return (
                    <div
                        key={day}
                        className={`flex items-center gap-6 py-4 ${i < DAYS.length - 1 ? "border-b border-[#F0F2F4]" : ""}`}
                    >
                        {/* Day label */}
                        <div className="w-10 flex-shrink-0">
                        <span className="text-[14px] font-medium text-black font-inter">{day}</span>
                        </div>

                        {/* Toggle */}
                        <div className="flex-shrink-0">
                        <Toggle checked={wh.open} onChange={() => setWH(day, "open", !wh.open)} />
                        </div>

                        {/* Open + Close dropdowns — only when open */}
                        {wh.open && (
                        <div className="flex items-end gap-4 flex-1">
                            {/* Open Time */}
                            <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[14px] font-medium text-black font-inter">
                                Open <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                value={wh.from}
                                onChange={(e) => setWH(day, "from", e.target.value)}
                                className="w-full appearance-none px-3 py-2 text-[14px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] bg-white pr-8"
                                >
                                <option value="">Select Time</option>
                                {TIME_OPTIONS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                                </select>
                                <svg
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                            </div>

                            {/* Close Time */}
                            <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[14px] font-medium text-black font-inter">
                                Close <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                value={wh.to}
                                onChange={(e) => setWH(day, "to", e.target.value)}
                                className="w-full appearance-none px-3 py-2 text-[14px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] bg-white pr-8"
                                >
                                <option value="">Select Time</option>
                                {TIME_OPTIONS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                                </select>
                                <svg
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                    );
                })}
                </div>
            </div>
            )}

          {/* ── Step 3: Platform Features ── */}
          {step === 2 && (
            <div className="flex flex-col gap-3">
                <p className="text-[18px] font-semibold text-black font-inter">Platform Features</p>

                {/* Showroom — light green bg when active */}
                <div
                className="flex items-center justify-between px-5 py-4 rounded-xl border"
                style={{
                    backgroundColor: form.showroom ? "#F0FFF4" : "#fff",
                    borderColor: form.showroom ? "#86EFAC" : "#E8EAED",
                }}
                >
                <div>
                    <p className="text-[14px] font-semibold text-black font-inter">Showroom Enabled</p>
                    <p className="text-[14px] text-[#6B6F72] mt-0.5">
                    Allow users to reserve and pickup products from physical location
                    </p>
                </div>
                <Toggle checked={form.showroom} onChange={() => set("showroom", !form.showroom)} />
                </div>

                {/* Service — light purple bg when active */}
                <div
                className="flex items-center justify-between px-5 py-4 rounded-xl border"
                style={{
                    backgroundColor: form.serviceScheduler ? "#FAF5FF" : "#fff",
                    borderColor: form.serviceScheduler ? "#D8B4FE" : "#E8EAED",
                }}
                >
                <div>
                    <p className="text-[14px] font-semibold text-black font-inter">Service Enabled</p>
                    <p className="text-[14px] text-[#6B6F72] mt-0.5">
                    Enable service-based bookings for consultations and appointments
                    </p>
                </div>
                <Toggle checked={form.serviceScheduler} onChange={() => set("serviceScheduler", !form.serviceScheduler)} />
                </div>

            </div>
            )}

          {/* ── Step 4: Payment Methods ── */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
                <p className="text-[18px] font-semibold text-black font-inter">Payment Methods</p>

                {/* Payment Methods list */}
                <div className="flex flex-col gap-0 rounded-xl overflow-hidden">

                {/* Cash */}
                <label
                    className="flex items-start gap-3 py-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                    <div className="flex-shrink-0 mt-0.5">
                    <div
                        onClick={() => set("cash", !form.cash)}
                        className="w-4 h-4 rounded flex items-center justify-center border cursor-pointer transition-colors"
                        style={{
                        backgroundColor: form.cash ? "#1E3862" : "#fff",
                        borderColor: form.cash ? "#1E3862" : "#D6DADD",
                        }}
                    >
                        {form.cash && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        )}
                    </div>
                    </div>
                    <div onClick={() => set("cash", !form.cash)}>
                    <p className="text-[14px] font-semibold text-black font-inter">Cash</p>
                    <p className="text-[14px] text-[#6B6F72] mt-0.5">Sellers receive payments immediately and can track cash transactions easily.</p>
                    </div>
                </label>

                {/* Credit / Debit Cards */}
                <label className="flex items-start gap-3 py-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                    <div
                        onClick={() => set("creditCard", !form.creditCard)}
                        className="w-4 h-4 rounded flex items-center justify-center border cursor-pointer transition-colors"
                        style={{
                        backgroundColor: form.creditCard ? "#1E3862" : "#fff",
                        borderColor: form.creditCard ? "#1E3862" : "#D6DADD",
                        }}
                    >
                        {form.creditCard && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        )}
                    </div>
                    </div>
                    <div onClick={() => set("creditCard", !form.creditCard)}>
                    <p className="text-[14px] font-semibold text-black font-inter">Credit / Debit Cards</p>
                    <p className="text-[14px] text-[#6B6F72] mt-0.5">Accept all major credit and debit cards for seamless transactions.</p>
                    </div>
                </label>

                {/* Digital Wallets */}
                <label className="flex items-start gap-3 py-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                    <div
                        onClick={() => set("digitalWallet", !form.digitalWallet)}
                        className="w-4 h-4 rounded flex items-center justify-center border cursor-pointer transition-colors"
                        style={{
                        backgroundColor: form.digitalWallet ? "#1E3862" : "#fff",
                        borderColor: form.digitalWallet ? "#1E3862" : "#D6DADD",
                        }}
                    >
                        {form.digitalWallet && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        )}
                    </div>
                    </div>
                    <div onClick={() => set("digitalWallet", !form.digitalWallet)}>
                    <p className="text-[14px] font-semibold text-black font-inter">Digital Wallets</p>
                    <p className="text-[14px] text-[#6B6F72] mt-0.5">Enable secure and fast payments through popular digital wallets.</p>
                    </div>
                </label>

                {/* Online Payment */}
                <label className="flex items-start gap-3 py-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                    <div
                        onClick={() => set("onlinePayment", !form.onlinePayment)}
                        className="w-4 h-4 rounded flex items-center justify-center border cursor-pointer transition-colors"
                        style={{
                        backgroundColor: form.onlinePayment ? "#1E3862" : "#fff",
                        borderColor: form.onlinePayment ? "#1E3862" : "#D6DADD",
                        }}
                    >
                        {form.onlinePayment && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        )}
                    </div>
                    </div>
                    <div onClick={() => set("onlinePayment", !form.onlinePayment)}>
                    <p className="text-[14px] font-semibold text-black font-inter">Online Payment</p>
                    <p className="text-[14px] text-[#6B6F72] mt-0.5">Facilitate payments via trusted online payment gateways.</p>
                    </div>
                </label>

                </div>

                {/* ── Loyalty Cards ── */}
                <div className="flex flex-col gap-3">
                <p className="text-[14px] font-semibold text-black font-inter">Loyalty Cards</p>

                <div className="overflow-hidden">
                    {/* Loyalty Cards Accepted */}
                    <label className="flex items-start gap-3 py-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                        <div
                        onClick={() => set("loyaltyCards", !form.loyaltyCards)}
                        className="w-4 h-4 rounded flex items-center justify-center border cursor-pointer transition-colors"
                        style={{
                            backgroundColor: form.loyaltyCards ? "#1E3862" : "#fff",
                            borderColor: form.loyaltyCards ? "#1E3862" : "#D6DADD",
                        }}
                        >
                        {form.loyaltyCards && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        )}
                        </div>
                    </div>
                    <div onClick={() => set("loyaltyCards", !form.loyaltyCards)}>
                        <p className="text-[14px] font-semibold text-black font-inter">Loyalty Cards Accepted</p>
                        <p className="text-[14px] text-[#6B6F72] mt-0.5">Accept loyalty cards to reward customers and encourage repeat business.</p>
                    </div>
                    </label>
                </div>
                </div>

            </div>
            )}

          {/* ── Step 5: Review ── */}
          {step === 4 && (
            <div className="flex flex-col gap-3">
                <p className="text-[18px] font-semibold text-black font-inter">Review</p>

                <div className="overflow-hidden bg-white">

                {/* ── Logo + Name + Address + Contacts + About ── */}
                <div className="">

                    {/* Logo */}
                    <div className="w-[220px] h-[100px] rounded-xl overflow-hidden border border-[#E8EAED] mb-3 bg-[#1a4a2e] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"
                        fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    </div>

                    {/* Seller Name */}
                    <p className="text-[20px] font-semibold text-[#1E3862] font-inter leading-tight">
                    {form.pharmacyName || "Dell'Orso Pharmacy, Milan"}
                    </p>

                    {/* Address line */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                        fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="text-[14px] text-[#6B6F72] font-medium font-inter">
                        {[form.streetAddress, form.city, form.region, form.postalCode].filter(Boolean).join(", ") || "Bear Street, 1, Milan, ME,20121"}
                    </span>
                    </div>

                    {/* Phone + WhatsApp + Email */}
                    <div className="flex items-center gap-8 mt-2 flex-wrap">
                    {/* Phone */}
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="#1E3862" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5 19.79 19.79 0 0 1 1.08 4.82 2 2 0 0 1 3.05 2.63h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
                        </svg>
                        <span className="text-[14px] text-[#1E3862]">{form.whatsappNumber || "+39 333 123 4567"}</span>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="#1E3862" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        <span className="text-[14px] text-[#1E3862]">{form.whatsappNumber || "+39 333 123 4567"}</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="#1E3862" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <polyline points="2,4 12,13 22,4"/>
                        </svg>
                        <span className="text-[14px] text-[#1E3862]">{form.ownerName ? `${form.ownerName.toLowerCase().replace(/\s+/g, "")}@email.com` : "example@email.com"}</span>
                    </div>
                    </div>

                    {/* About Seller */}
                    <div className="mt-3">
                    <p className="text-[14px] font-semibold text-black mb-1">About Seller</p>
                    <p className="text-[14px] text-[#6B6F72] font-medium leading-[1.6]">
                        {form.aboutSeller ||
                        "This is a verified Showroom+ pharmacy offering trusted medicines, professional healthcare services, and exclusive in-store deals. Customers can reserve products online and collect them directly from the pharmacy with expert guidance from qualified professionals."}
                    </p>
                    </div>
                </div>

                {/* ── Working Hours ── */}
                <div className="border border-[#EDF2FB] rounded-xl bg-[#F8F8F8] px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                        fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p className="text-[11px] font-semibold text-[#21272A]">Working Hours</p>
                    </div>

                    {/* Two-column grid: Mon-Thu left, Fri-Sun right */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                    {/* Left column: Mon Tue Wed Thu */}
                    <div className="flex flex-col gap-0.5">
                        {["Mon", "Tue", "Wed", "Thu"].map((day) => {
                        const wh = form.workingHours[day];
                        return (
                            <div key={day} className="flex items-center gap-1">
                            <span className="text-[11px] text-[#6B6F72] w-7 flex-shrink-0">{day}:</span>
                            <span className="text-[11px] text-[#21272A]">
                                {wh.open ? `${wh.from || "09:00 AM"} - ${wh.to || "01:00 PM"}` : "Closed"}
                            </span>
                            </div>
                        );
                        })}
                    </div>
                    {/* Right column: Fri Sat Sun */}
                    <div className="flex flex-col gap-0.5">
                        {["Fri", "Sat", "Sun"].map((day) => {
                        const wh = form.workingHours[day];
                        return (
                            <div key={day} className="flex items-center gap-1">
                            <span className="text-[11px] text-[#6B6F72] w-7 flex-shrink-0">{day}:</span>
                            <span className="text-[11px] text-[#21272A]">
                                {wh.open ? `${wh.from || "09:00 AM"} - ${wh.to || "01:00 PM"}` : "Closed"}
                            </span>
                            </div>
                        );
                        })}
                    </div>
                    </div>

                    {/* Platform Feature badges — inline below working hours */}
                    <div className="flex items-center gap-2 mt-3">
                    {[
                        { label: "Showroom Enable",  val: form.showroom },
                        { label: "Service Enable",   val: form.serviceScheduler },
                    ].map(({ label, val }) => (
                        <span
                        key={label}
                        className="px-3 py-1 border-r border-[#9A9C9E] text-[11px] font-medium"
                        style={{
                            color: "#6B6F72",
                        }}
                        >
                        {label}
                        </span>
                    ))}
                    </div>
                </div>

                {/* ── Payment Methods ── */}
                <div className="py-3">
                    <p className="text-[11px] font-semibold text-[#21272A] mb-2">Payment Methods</p>
                    <div className="flex items-center gap-18 flex-wrap">
                    {[
                        { label: "Cash",                 val: form.cash },
                        { label: "Credit / Debit Cards", val: form.creditCard },
                        { label: "Online Payment",       val: form.onlinePayment },
                        { label: "Digital Wallets",      val: form.digitalWallet },
                    ].map(({ label, val }) => (
                        <div key={label} className="flex items-center gap-1.5">
                        <div
                            className="w-[15px] h-[15px] rounded flex items-center justify-center flex-shrink-0"
                            style={{
                            backgroundColor: val ? "#1E3862" : "#fff",
                            border: val ? "none" : "1.5px solid #D6DADD",
                            }}
                        >
                            {val && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            )}
                        </div>
                        <span className="text-[11px] text-[#21272A]">{label}</span>
                        </div>
                    ))}
                    </div>
                </div>

                {/* ── Loyalty Cards ── */}
                <div className="py-3">
                    <p className="text-[11px] font-semibold text-[#21272A] mb-2">Loyalty Cards</p>
                    <div className="flex items-center gap-1.5">
                    <div
                        className="w-[15px] h-[15px] rounded flex items-center justify-center flex-shrink-0"
                        style={{
                        backgroundColor: form.loyaltyCards ? "#1E3862" : "#fff",
                        border: form.loyaltyCards ? "none" : "1.5px solid #D6DADD",
                        }}
                    >
                        {form.loyaltyCards && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        )}
                    </div>
                    <span className="text-[11px] text-[#21272A]">Loyalty Cards Accepted</span>
                    </div>
                </div>

                </div>
            </div>
            )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F0F2F4] flex-shrink-0 bg-white">
          <button
            onClick={() => step === 0 ? handleClose() : setStep((s) => s - 1)}
            className="px-5 py-2.5 text-[13px] font-medium text-[#6B6F72] hover:text-[#21272A] transition-colors border border-[#D6DADD] rounded-lg hover:bg-gray-50"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#A8AAAC]">{step + 1} / {STEPS.length}</span>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-2 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[12px] font-medium transition-colors"
              >
                Save & Continue
              </button>
            ) : (
              <button
                onClick={() => { console.log("Publish:", form); handleClose(); }}
                className="px-5 py-2 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[13px] font-medium transition-colors"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
