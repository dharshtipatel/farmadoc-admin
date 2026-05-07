"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Offer } from "./types";

type OfferType = "Flat Discount" | "Percentage Discount" | "Cart Value";
type Step = 1 | 2 | 3 | 4 | 5;
type ScopeOption = string | { name: string; image: string };

const STEPS = [
  { num: "01", label: "Basic Info" },
  { num: "02", label: "Apply Scope" },
  { num: "03", label: "Conditions" },
  { num: "04", label: "Rule & Priority" },
  { num: "05", label: "Review & Publish" },
];

const OFFER_TYPES: { type: OfferType; emoji: string; desc: string; color: string; bg: string }[] = [
  { type: "Flat Discount",       emoji: "🏷️", desc: "Apply a fixed amount discount",     bg: "#F6F4FF", color: "#8470BC" },
  { type: "Percentage Discount", emoji: "🔥", desc: "Apply a fixed percentage discount", bg: "#FFFBEA", color: "#FFB12A" },
  { type: "Cart Value",          emoji: "🛒", desc: "Apply discount on cart value",      bg: "#FFF6F7", color: "#FD4755" },
];

const OFFER_FIELDS: Record<OfferType, { label: string; placeholder: string }[]> = {
  "Flat Discount":       [{ label: "Discount Amount *",     placeholder: "Enter amount" }],
  "Percentage Discount": [{ label: "Discount Percentage *", placeholder: "Enter percentage" }, { label: "Max Discount Amount", placeholder: "Enter max discount amount" }],
  "Cart Value":          [{ label: "Minimum Cart Value *",  placeholder: "Enter minimum cart value" }, { label: "Discount Amount *", placeholder: "Enter discount amount" }],
};

const SCOPE_TABS = [
  { label: "Showrooms",  icon: "/images/showrooms.svg" },
  { label: "Products",   icon: "/images/product.svg" },
  { label: "Categories", icon: "/images/categories.svg" },
  { label: "Global",     icon: "/images/global.svg" },
];

const SCOPE_ITEMS: Record<string, ScopeOption[]> = {
  Showrooms:  ["City Pharmacy, Milan", "Health Hub, Siena", "Wellness Corner, Naples", "Urban Care, Florence", "PharmaPlus, Turin", "Rx Solutions, Bologna", "Community Health, Genoa", "Pharmacy Express, Venice"],
  Products:   [
    { name: "Solar Labo Prot Crp Spf50+", image: "/images/product.svg" },
    { name: "Hydra Boost Moisturizer 24h", image: "/images/product.svg" },
    { name: "Revitalizing Eye Cream", image: "/images/product.svg" },
    { name: "Night Repair Serum", image: "/images/product.svg" },
    { name: "Gentle Exfoliating Scrub", image: "/images/product.svg" },
    { name: "Vitamin C Tablets", image: "/images/product.svg" },
    { name: "Reusable Mask", image: "/images/product.svg" },
    { name: "First Aid Kit", image: "/images/product.svg" },
  ],
  Categories: ["Pain Relief & Analgesics", "Antibiotics & Antibacterials", "Vitamins & Supplements", "Skin Care & Dermatology", "Digestive Health", "Respiratory Care", "Cardiac & Blood Pressure", "Diabetes Care"],
  Global:     ["All Sellers", "All Products", "All Categories", "Platform Wide"],
};

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const getScopeItemLabel = (item: ScopeOption) =>
  typeof item === "string" ? item : item.name;

const DEFAULT_OFFER_TYPE: OfferType = "Flat Discount";
const DEFAULT_SCOPE_TAB = "Showrooms";

const buildFieldValues = (type: OfferType, discount: string) => {
  const normalizedDiscount = discount.replace("EUR", "").replace("%", "").trim();
  const values: Record<string, string> = {};

  if (type === "Percentage Discount") {
    values["Discount Percentage *"] = normalizedDiscount;
    values["Max Discount Amount"] = "";
    return values;
  }

  if (type === "Cart Value") {
    values["Minimum Cart Value *"] = "";
    values["Discount Amount *"] = normalizedDiscount;
    return values;
  }

  values["Discount Amount *"] = normalizedDiscount;
  return values;
};

const buildOfferDiscount = (type: OfferType, values: Record<string, string>) => {
  if (type === "Percentage Discount") {
    const percentage = values["Discount Percentage *"]?.trim();
    return percentage ? `${percentage}%` : "0%";
  }

  const amount = values["Discount Amount *"]?.trim();
  return amount ? `EUR${amount}` : "EUR0.00";
};

export default function AddOfferDrawer({
  open,
  onClose,
  mode = "add",
  initialOffer = null,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  initialOffer?: Offer | null;
  onSubmit?: (offer: Offer) => void;
}) {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1
  const [offerName, setOfferName]       = useState("");
  const [description, setDescription]   = useState("");
  const [offerType, setOfferType]       = useState<OfferType>("Flat Discount");
  const [fieldValues, setFieldValues]   = useState<Record<string, string>>({});

  // Step 2
  const [scopeTab, setScopeTab]                   = useState("Showrooms");
  const [scopeSelected, setScopeSelected]         = useState<string[]>([]);
  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);
  const [scopeSearch, setScopeSearch]             = useState("");
  const scopeRef = useRef<HTMLDivElement>(null);

  // Step 3
  const [priority, setPriority]         = useState("");
  const [couponType, setCouponType]     = useState("Auto Apply");
  const [taskName, setTaskName]         = useState("");
  const [minUses, setMinUses]           = useState("");
  const [perUserLimit, setPerUserLimit] = useState("");
  const [offerLabel, setOfferLabel]     = useState("");

  // Step 4
  const [offerImage, setOfferImage]     = useState("");
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const offerImageRef                   = useRef<HTMLInputElement>(null);
  const [highPriority, setHighPriority] = useState(true);
  const [autoApply, setAutoApply]       = useState(false);
  const [couponCode, setCouponCode]     = useState("");

  const resetForm = () => {
    setCurrentStep(1);
    setOfferName("");
    setDescription("");
    setOfferType(DEFAULT_OFFER_TYPE);
    setFieldValues({});
    setScopeTab(DEFAULT_SCOPE_TAB);
    setScopeSelected([]);
    setScopeSearch("");
    setScopeDropdownOpen(false);
    setPriority("");
    setCouponType("Auto Apply");
    setTaskName("");
    setMinUses("");
    setPerUserLimit("");
    setOfferLabel("");
    setOfferImage("");
    setStartDate("");
    setEndDate("");
    setHighPriority(true);
    setAutoApply(false);
    setCouponCode("");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (scopeRef.current && !scopeRef.current.contains(e.target as Node)) {
        setScopeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!initialOffer) {
      resetForm();
      return;
    }

    const mappedType = (["Flat Discount", "Percentage Discount", "Cart Value"].includes(initialOffer.type)
      ? initialOffer.type
      : DEFAULT_OFFER_TYPE) as OfferType;
    const mappedScopeTab = SCOPE_TABS.some((tab) => tab.label === initialOffer.appliedOn)
      ? initialOffer.appliedOn
      : DEFAULT_SCOPE_TAB;

    setCurrentStep(1);
    setOfferName(initialOffer.name);
    setDescription("");
    setOfferType(mappedType);
    setFieldValues(buildFieldValues(mappedType, initialOffer.discount));
    setScopeTab(mappedScopeTab);
    setScopeSelected([]);
    setScopeSearch("");
    setScopeDropdownOpen(false);
    setPriority("");
    setCouponType("Auto Apply");
    setTaskName("");
    setMinUses(String(initialOffer.usage));
    setPerUserLimit("");
    setOfferLabel("");
    setOfferImage("");
    setStartDate(initialOffer.validFrom);
    setEndDate(initialOffer.validTo);
    setHighPriority(true);
    setAutoApply(false);
    setCouponCode("");
  }, [open, initialOffer]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFieldChange = (label: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleTypeChange = (type: OfferType) => {
    setOfferType(type);
    setFieldValues({});
  };

  const currentFields = OFFER_FIELDS[offerType];

  const filteredScopeItems = useMemo(
    () =>
      SCOPE_ITEMS[scopeTab].filter((item) =>
        getScopeItemLabel(item).toLowerCase().includes(scopeSearch.toLowerCase())
      ),
    [scopeSearch, scopeTab]
  );

  const handleSubmit = () => {
    const nextOffer: Offer = {
      id: initialOffer?.id ?? `offer-${Date.now()}`,
      name: offerName || initialOffer?.name || "UNTITLED OFFER",
      type: offerType,
      appliedOn: scopeTab,
      discount: buildOfferDiscount(offerType, fieldValues),
      validFrom: startDate || initialOffer?.validFrom || "",
      validTo: endDate || initialOffer?.validTo || "",
      usage: Number(minUses) || initialOffer?.usage || 0,
      status: initialOffer?.status ?? "Active",
      art:
        initialOffer?.art ??
        (offerType === "Flat Discount"
          ? "summer"
          : offerType === "Percentage Discount"
            ? "winter"
            : "spring"),
    };

    onSubmit?.(nextOffer);
    handleClose();
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/85" onClick={handleClose} />}

      <div className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[880px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#E8EAED] flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-[#21272A]">Add New Offer</h2>
            <p className="mt-0.5 text-[11px] text-[#6B6F72]">
              Create a promotional offer by defining scope, discount rules, and validity to boost sales across products, categories, or sellers.
            </p>
          </div>
          <button onClick={handleClose} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Step Progress */}
        <div className="px-5 py-4 flex-shrink-0">
          <div className="relative flex items-start justify-between">
            <div className="absolute left-0 right-0 top-4 h-px bg-[#D6DADD] z-0" />
            {STEPS.map((step, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStep;
              const isDone   = stepNum < currentStep;
              return (
                <div key={step.num} className="relative flex flex-col items-center gap-1.5 z-10 bg-white px-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border-2 ${
                      isActive || isDone
                        ? "border-[#1E3862] text-white"
                        : "bg-white border-[#D6DADD] text-[#6B6F72]"
                    }`}
                    style={(isActive || isDone) ? { backgroundColor: "#1E3862" } : {}}
                  >
                    {isDone ? "✓" : step.num}
                  </div>
                  <span className={`text-[10px] font-medium text-center whitespace-nowrap ${
                    isActive || isDone ? "text-[#1E3862] font-semibold" : "text-[#6B6F72]"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* ── STEP 1 ── */}
          {currentStep === 1 && (
            <>
              <h3 className="text-[14px] font-bold text-[#21272A]">Basic Information</h3>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-black font-inter">
                  Offer Name <span className="text-[#DA1E28]">*</span>
                </label>
                <input
                  type="text" value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  placeholder="Enter Offer Name"
                  className="rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] text-[#21272A] outline-none focus:border-[#1E3862] placeholder-[#A8AAAC] bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-black font-inter">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type here about Offer" rows={3}
                  className="resize-none rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] text-[#21272A] outline-none focus:border-[#1E3862] placeholder-[#A8AAAC] bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-black font-inter">Offer Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {OFFER_TYPES.map(({ type, emoji, desc, color, bg }) => {
                    const selected = offerType === type;
                    return (
                      <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className="rounded-xl border px-3 py-3 text-left transition-all"
                      style={{ borderColor: selected ? color : "#D6DADD", backgroundColor: selected ? bg : "#fff" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-[44px] h-[44px] rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: selected ? "#fff" : "#F3F4F6" }}
                        >
                          {emoji}
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-[#21272A] leading-snug">{type}</p>
                          <p className="text-[10px] text-[#6B6F72] mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    </button>
                    );
                  })}
                </div>
              </div>

              <div className={`grid gap-4 ${currentFields.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {currentFields.map(({ label, placeholder }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label className="text-[14px] font-medium text-black font-inter">
                      {label.replace(" *", "")}
                      {label.includes("*") && <span className="text-[#DA1E28] ml-0.5">*</span>}
                    </label>
                    <input
                      type="text" value={fieldValues[label] ?? ""}
                      onChange={(e) => handleFieldChange(label, e.target.value)}
                      placeholder={placeholder}
                      className="rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] text-[#21272A] outline-none focus:border-[#1E3862] placeholder-[#A8AAAC] bg-white"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {currentStep === 2 && (
            <>
              <h3 className="text-[18px] font-semibold text-black font-inter">Apply Scope</h3>

              <div className="space-y-4">
                <p className="text-[14px] font-medium text-black font-inter mb-2">Apply on</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {SCOPE_TABS.map(({ label, icon }) => {
                    const active = scopeTab === label;
                    return (
                      <button
                        key={label} type="button"
                        onClick={() => { setScopeTab(label); setScopeSelected([]); setScopeSearch(""); setScopeDropdownOpen(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[14px] font-semibold font-inter transition-all ${
                          active
                            ? "border-[#1E3862] bg-[#EFF4FF] text-[#1E3862]"
                            : "border-[#D6DADD] bg-white text-[#6B6F72] hover:border-[#1E3862]"
                        }`}
                      >
                        <img
                          src={icon}
                          alt={label}
                          width={22}
                          height={22}
                          className={`flex-shrink-0 ${active ? "opacity-100" : "opacity-50"}`}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {scopeTab !== "Global" && <div className="pt-2">
                <p className="text-[14px] font-medium text-black font-inter mb-1.5">
                  Select {scopeTab} <span className="text-[#DA1E28]">*</span>
                </p>
                <div className="relative" ref={scopeRef}>
                  <button
                    type="button"
                    onClick={() => setScopeDropdownOpen((p) => !p)}
                    className="w-full flex min-h-[42px] items-center justify-between rounded-lg border border-[#D6DADD] bg-white px-3 py-2.5 text-[13px] hover:border-[#1192E8] transition-colors"
                  >
                    <span className={scopeSelected.length > 0 ? "text-[#21272A]" : "text-[#A8AAAC]"}>
                      {scopeSelected.length > 0 ? `${scopeSelected.length} selected` : `Select ${scopeTab}`}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform ${scopeDropdownOpen ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {scopeDropdownOpen && (
                    <div className="absolute left-0 mt-2 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-[#D6DADD] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                      <div className="sticky top-0 z-10 border-b border-[#E8EAED] bg-white px-3 py-3">
                        <div className="relative">
                          
                          <input
                            type="text" value={scopeSearch}
                            onChange={(e) => setScopeSearch(e.target.value)}
                            placeholder={`Search ${scopeTab.toLowerCase()}...`}
                            className="w-full rounded-lg border border-[#D6DADD] px-2 py-2 pl-8 pr-3 text-[12px] outline-none focus:border-[#1192E8] placeholder-[#A8AAAC]"
                          />
                        </div>
                      </div>
                      <div className="max-h-[240px] overflow-y-auto py-1.5">
                        {filteredScopeItems.map((item) => {
                          const label = getScopeItemLabel(item);
                          return (
                            <label key={label} className="flex min-h-[44px] items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={scopeSelected.includes(label)}
                                onChange={() => setScopeSelected((prev) =>
                                  prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
                                )}
                                className="w-[14px] h-[14px] accent-[#1E3862] cursor-pointer flex-shrink-0"
                              />
                              {typeof item === "string" ? (
                                <span className="text-[13px] text-[#21272A]">{label}</span>
                              ) : (
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E8EAED] bg-[#F8FAFC]">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={18}
                                      height={18}
                                    />
                                  </div>
                                  <span className="text-[13px] text-[#21272A]">{label}</span>
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {scopeSelected.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {scopeSelected.map((item) => (
                      <span key={item} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-[#1192E8] border border-[#D6DADD] bg-white">
                        {item}
                        <button
                          onClick={() => setScopeSelected((prev) => prev.filter((x) => x !== item))}
                          className="hover:text-[#DA1E28] transition-colors font-medium"
                        >×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>}
            </>
          )}

          {/* ── STEP 3 ── */}
{currentStep === 3 && (
  <>

    {/* Validity */}
    <div>
      <h4 className="text-[18px] font-semibold text-black font-inter mb-3">Validity</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[14px] font-inter font-medium text-black">
            Start Date <span className="text-[#DA1E28]">*</span>
          </label>
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] outline-none focus:border-[#1192E8] placeholder-[#A8AAAC] bg-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[14px] font-inter font-medium text-black">
            End Date <span className="text-[#DA1E28]">*</span>
          </label>
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] outline-none focus:border-[#1192E8] placeholder-[#A8AAAC] bg-white"
          />
        </div>
      </div>
    </div>

    {/* Usages Limit */}
    <div>
      <h4 className="text-[13px] font-semibold text-[#21272A] mb-3">Usages Limit</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[14px] font-inter font-medium text-black">Total Usage Limit</label>
          <input
            type="text"
            value={minUses}
            onChange={(e) => setMinUses(e.target.value)}
            placeholder="Total Usage Limit"
            className="rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] outline-none focus:border-[#1192E8] placeholder-[#A8AAAC] bg-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[14px] font-inter font-medium text-black">Per User Limit</label>
          <input
            type="text"
            value={perUserLimit}
            onChange={(e) => setPerUserLimit(e.target.value)}
            placeholder="Per User Limit"
            className="rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] outline-none focus:border-[#1192E8] placeholder-[#A8AAAC] bg-white"
          />
        </div>
      </div>
    </div>
  </>
)}

          {/* ── STEP 4 ── */}
{currentStep === 4 && (
  <>

    {/* Priority */}
    <div>
      <h4 className="text-[13px] font-semibold text-[#21272A] mb-3">Priority</h4>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={highPriority}
          onChange={() => setHighPriority((p) => !p)}
          className="w-[15px] h-[15px] accent-[#1E3862] cursor-pointer"
        />
        <span className="text-[13px] text-[#21272A]">Higher priority overrides lower offers</span>
      </label>
    </div>

    {/* Coupon Type */}
    <div>
      <h4 className="text-[13px] font-semibold text-[#21272A] mb-3">Coupon Type</h4>

      {/* Auto Apply toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-[13px] text-[#21272A]">Auto Apply</span>
        <button
          type="button"
          onClick={() => setAutoApply((p) => !p)}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
            autoApply ? "bg-[#1E3862]" : "bg-[#D1D5DB]"
          }`}
        >
          
          <span
            className={`absolute top-[3px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
              autoApply ? "translate-x-[20px]" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {!autoApply && (
        <div className="flex flex-col gap-1 mt-3">
          <label className="text-[13px] text-[#21272A]">Coupon Code</label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter Coupon Code"
            className="rounded-lg border border-[#D6DADD] px-3 py-2.5 text-[13px] outline-none focus:border-[#1192E8] placeholder-[#A8AAAC] bg-white"
          />
        </div>
      )}
    </div>
  </>
)}

          {/* ── STEP 5 ── */}
{currentStep === 5 && (
  <>
    <h3 className="text-[14px] font-bold text-[#21272A]">Review</h3>

    {/* Offer type pill */}
    <div className="inline-flex items-center gap-2.5 border border-[#E8EAED] rounded-xl px-3 py-2.5 bg-white">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: OFFER_TYPES.find((o) => o.type === offerType)?.bg }}
      >
        {OFFER_TYPES.find((o) => o.type === offerType)?.emoji}
      </div>
      <div>
        <p className="text-[12px] font-semibold text-[#21272A]">{offerType}</p>
        <p className="text-[10px] text-[#6B6F72]">{OFFER_TYPES.find((o) => o.type === offerType)?.desc}</p>
      </div>
    </div>

    {/* Offer Name */}
    <h2 className="text-[22px] font-bold text-[#21272A]">{offerName || "Untitled Offer"}</h2>

    {/* Row 1 */}
    <div className="grid grid-cols-2 gap-x-6">
      <div>
        <p className="text-[12px] text-[#6B6F72] mb-0.5">Discount Amount</p>
        <p className="text-[13px] font-medium text-[#21272A]">{Object.values(fieldValues)[0] || "—"}</p>
      </div>
      <div>
        <p className="text-[12px] text-[#6B6F72] mb-0.5">Applied on</p>
        <p className="text-[13px] font-medium text-[#21272A]">{scopeTab}</p>
      </div>
    </div>

    {/* Row 2 */}
    <div className="grid grid-cols-2 gap-x-6">
      <div>
        <p className="text-[12px] text-[#6B6F72] mb-0.5">Validity</p>
        <p className="text-[13px] font-medium text-[#21272A]">
          {startDate && endDate ? `${startDate} to ${endDate}` : "—"}
        </p>
      </div>
      <div>
        <p className="text-[12px] text-[#6B6F72] mb-0.5">Total Usages Limit</p>
        <p className="text-[13px] font-medium text-[#21272A]">{minUses || "—"}</p>
      </div>
    </div>

    {/* Row 3 */}
    <div className="grid grid-cols-2 gap-x-6">
      <div>
        <p className="text-[12px] text-[#6B6F72] mb-0.5">Per User Limit</p>
        <p className="text-[13px] font-medium text-[#21272A]">{perUserLimit || "—"}</p>
      </div>
    </div>

    {/* Row 4 */}
    <div className="grid grid-cols-2 gap-x-6">
      <div>
        <p className="text-[12px] text-[#6B6F72] mb-0.5">Priority</p>
        <p className="text-[13px] font-medium text-[#21272A]">
          {highPriority ? "Higher priority overrides lower offers" : "Standard priority"}
        </p>
      </div>
      <div>
        <p className="text-[12px] text-[#6B6F72] mb-0.5">Auto Apply</p>
        <p className="text-[13px] font-medium text-[#21272A]">{autoApply ? "Yes" : "No"}</p>
      </div>
    </div>

    {/* Coupon Code */}
    <div>
      <p className="text-[12px] text-[#6B6F72] mb-0.5">Coupon Code</p>
      <p className="text-[13px] font-medium text-[#21272A]">{couponCode || "—"}</p>
    </div>

    {/* Description */}
    <div>
      <p className="text-[12px] text-[#6B6F72] mb-1">Description</p>
      <p className="text-[13px] text-[#21272A] leading-relaxed">{description || "—"}</p>
    </div>
  </>
)}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E8EAED] bg-white px-5 py-4 flex-shrink-0">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep((s) => (s - 1) as Step) : handleClose()}
            className="rounded-lg px-4 py-2 text-[12px] font-medium text-[#6B6F72] hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? "Cancel" : "← Back"}
          </button>
          <button
            onClick={() => currentStep < 5 ? setCurrentStep((s) => (s + 1) as Step) : handleSubmit()}
            className="rounded-lg bg-[#1E3862] px-5 py-2 text-[12px] font-medium text-white hover:bg-[#16305a] transition-colors"
          >
            {currentStep === 5 ? (mode === "edit" ? "Update Offer" : "Publish Offer") : "Save & Continue"}
          </button>
        </div>
      </div>
    </>
  );
}
