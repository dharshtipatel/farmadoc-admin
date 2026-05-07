"use client";

import { useState } from "react";
import CategoryStatusToggle from "../components/categories/CategoryStatusToggle";
import CategorySelect from "../components/categories/CategorySelect";

type SettingsTab = "General" | "Operational" | "Feature Toggle" | "Push Notification";

const tabs: SettingsTab[] = ["General", "Operational", "Feature Toggle", "Push Notification"];
const audienceOptions = [
  { label: "Users", value: "Users" },
  { label: "Sellers", value: "Sellers" },
  { label: "both", value: "both" },
];
const languageOptions = [
  { label: "English", value: "English" },
  { label: "Italian", value: "Italian" },
];

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  const [platformName, setPlatformName] = useState("FarmaDoc");
  const [platformCurrency, setPlatformCurrency] = useState("EUR(Euro)");
  const [timeZone, setTimeZone] = useState("Europe/London (GMT+0)");
  const [language, setLanguage] = useState("English");
  const [orderBookingEmails, setOrderBookingEmails] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("20");
  const [bookingSystemEnabled, setBookingSystemEnabled] = useState(true);
  const [servicesModuleEnabled, setServicesModuleEnabled] = useState(true);
  const [hotDealsEnabled, setHotDealsEnabled] = useState(true);
  const [topDealsEnabled, setTopDealsEnabled] = useState(true);
  const [loyaltyProgramEnabled, setLoyaltyProgramEnabled] = useState(false);
  const [sendCustomNotification, setSendCustomNotification] = useState(true);
  const [targetAudience, setTargetAudience] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  return (
    <div className="min-w-0">
      <h1 className="text-[18px] font-semibold text-black">Platform Settings</h1>
      <p className="mt-1 text-[12px] font-medium text-[#6B6F72]">
        Configure global settings and preferences
      </p>

      <div className="mt-4 inline-flex flex-wrap gap-0.5 rounded-full bg-[#EDF2FB] p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-[10px] font-medium transition-colors ${
              activeTab === tab ? "bg-white text-[#1E3862] shadow-sm" : "text-[#6B6F72] hover:bg-white/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className={`mt-4 bg-white p-4 sm:p-5 ${
          activeTab === "Push Notification" ? "" : "rounded-md border border-[#D6DADD]"
        }`}
      >
        {activeTab === "General" ? (
          <>
            <h2 className="text-[13px] font-semibold text-[#21272A]">Platform Information</h2>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#21272A]">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(event) => setPlatformName(event.target.value)}
                  className="h-9 w-full rounded-md border border-[#D6DADD] bg-[#F5F8FC] px-3 text-[11px] text-[#21272A] outline-none focus:border-[#1E3862]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#21272A]">
                  Platform Currency
                </label>
                <input
                  type="text"
                  value={platformCurrency}
                  onChange={(event) => setPlatformCurrency(event.target.value)}
                  className="h-9 w-full rounded-md border border-[#D6DADD] bg-[#F5F8FC] px-3 text-[11px] text-[#21272A] outline-none focus:border-[#1E3862]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#21272A]">
                  Time Zone
                </label>
                <input
                  type="text"
                  value={timeZone}
                  onChange={(event) => setTimeZone(event.target.value)}
                  className="h-9 w-full rounded-md border border-[#D6DADD] bg-[#F5F8FC] px-3 text-[11px] text-[#21272A] outline-none focus:border-[#1E3862]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#21272A]">
                  Language
                </label>
                <CategorySelect
                  value={language}
                  onChange={setLanguage}
                  options={languageOptions}
                  placeholder="Select Language"
                />
              </div>
            </div>
          </>
        ) : activeTab === "Operational" ? (
          <div className="space-y-4">
            <div className="rounded-md border border-[#D6DADD] bg-white p-4">
              <h2 className="text-[13px] font-semibold text-[#21272A]">Order Management</h2>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-[#21272A]">
                    Order/Booking Confirmation Emails
                  </p>
                  <p className="mt-2 text-[10px] text-[#6B6F72]">
                    Send automatic emails to seller when orders/Bookings are placed
                  </p>
                </div>
                <CategoryStatusToggle
                  checked={orderBookingEmails}
                  onToggle={() => setOrderBookingEmails((prev) => !prev)}
                />
              </div>
            </div>

            <div className="rounded-md border border-[#D6DADD] bg-white p-4">
              <h2 className="text-[13px] font-semibold text-[#21272A]">Inventory Management</h2>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-[#21272A]">Low Stock Alerts</p>
                  <p className="mt-2 text-[10px] text-[#6B6F72]">
                    Notify when inventory falls below threshold
                  </p>
                </div>
                <CategoryStatusToggle
                  checked={lowStockAlerts}
                  onToggle={() => setLowStockAlerts((prev) => !prev)}
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-semibold text-[#21272A]">
                  Low Stock Threshold,(Units)
                </label>
                <input
                  type="text"
                  value={lowStockThreshold}
                  onChange={(event) => setLowStockThreshold(event.target.value)}
                  className="h-9 w-full rounded-md border border-[#D6DADD] bg-[#F5F8FC] px-3 text-[11px] text-[#21272A] outline-none focus:border-[#1E3862]"
                />
                <p className="mt-2 text-[10px] text-[#6B6F72]">
                  Alert when stock falls below this number
                </p>
              </div>
            </div>
          </div>
        ) : activeTab === "Feature Toggle" ? (
          <div className="space-y-4">
            <div className="rounded-md border border-[#D6DADD] bg-white p-4">
              <h2 className="text-[13px] font-semibold text-[#21272A]">Core Features</h2>

              <div className="mt-5 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#21272A]">Booking System</p>
                    <p className="mt-2 text-[10px] text-[#6B6F72]">
                      Allow customers to book and reserve Products
                    </p>
                  </div>
                  <CategoryStatusToggle
                    checked={bookingSystemEnabled}
                    onToggle={() => setBookingSystemEnabled((prev) => !prev)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#21272A]">Services Module</p>
                    <p className="mt-2 text-[10px] text-[#6B6F72]">
                      Enable healthcare services like vaccinations and consultations
                    </p>
                  </div>
                  <CategoryStatusToggle
                    checked={servicesModuleEnabled}
                    onToggle={() => setServicesModuleEnabled((prev) => !prev)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border border-[#D6DADD] bg-white p-4">
              <h2 className="text-[13px] font-semibold text-[#21272A]">Promotional Features</h2>

              <div className="mt-5 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#21272A]">Hot Deals</p>
                    <p className="mt-2 text-[10px] text-[#6B6F72]">
                      Showcase limited-time offers in the navigation to attract user attention instantly.
                    </p>
                  </div>
                  <CategoryStatusToggle
                    checked={hotDealsEnabled}
                    onToggle={() => setHotDealsEnabled((prev) => !prev)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#21272A]">Top Deals</p>
                    <p className="mt-2 text-[10px] text-[#6B6F72]">
                      Display the best-performing and most attractive offers across the platform.
                    </p>
                  </div>
                  <CategoryStatusToggle
                    checked={topDealsEnabled}
                    onToggle={() => setTopDealsEnabled((prev) => !prev)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#21272A]">Loyalty Program</p>
                    <p className="mt-2 text-[10px] text-[#6B6F72]">
                      Reward customers with points for purchases
                    </p>
                  </div>
                  <CategoryStatusToggle
                    checked={loyaltyProgramEnabled}
                    onToggle={() => setLoyaltyProgramEnabled((prev) => !prev)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "Push Notification" ? (
          <div className="flex items-center justify-center py-8">
            <div
              className="max-w-none rounded-xl border border-[#D6DADD] bg-white p-6"
              style={{ width: "641px", minWidth: "641px" }}
            >
              <label className="flex items-center gap-3 text-[13px] font-semibold text-[#21272A]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F9FC] text-[#1E3862]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2 11 13" />
                    <path d="m22 2-7 20-4-9-9-4Z" />
                  </svg>
                </span>
                <input
                  type="checkbox"
                  checked={sendCustomNotification}
                  onChange={() => setSendCustomNotification((prev) => !prev)}
                  className="hidden"
                />
                <span>Send Custom Notification</span>
              </label>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block font-inter text-[14px] font-medium text-black">
                    Target Audience
                  </label>
                  <CategorySelect
                    value={targetAudience}
                    onChange={setTargetAudience}
                    options={audienceOptions}
                    placeholder="Select Audience"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-inter text-[14px] font-medium text-black">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    value={notificationTitle}
                    onChange={(event) => setNotificationTitle(event.target.value)}
                    placeholder="Enter notification title"
                    className="h-10 w-full rounded-md border border-[#D6DADD] bg-white px-3 text-[12px] text-[#21272A] outline-none placeholder:text-[#A8AAAC] focus:border-[#1E3862]"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-inter text-[14px] font-medium text-black">
                    Message
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(event) => setNotificationMessage(event.target.value)}
                    placeholder="Enter notification message"
                    rows={6}
                    className="w-full resize-none rounded-md border border-[#D6DADD] bg-white px-3 py-3 text-[12px] text-[#21272A] outline-none placeholder:text-[#A8AAAC] focus:border-[#1E3862]"
                  />
                </div>

                <button
                  type="button"
                  className="h-10 w-full rounded-md bg-[#1E3862] text-[12px] font-medium text-white transition-colors hover:bg-[#162b4b]"
                >
                  Send Notifications
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8" />
        )}
      </div>

      {activeTab !== "Push Notification" ? (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="rounded-md bg-[#1E3862] px-4 py-2 text-[11px] font-medium text-white transition-colors hover:bg-[#162b4b]"
          >
            Save Changes
          </button>
        </div>
      ) : null}
    </div>
  );
}
