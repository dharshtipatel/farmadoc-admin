"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import StatsCard from "../components/statscard";
import ChatbotQueriesChart from "../components/aichatbot/ChatbotQueriesChart";
import DataTable, { Column } from "../components/DataTable";
import CategoryStatusToggle from "../components/categories/CategoryStatusToggle";

type ChatbotStat = {
  title: string;
  value: string;
  icon: string;
  description: string;
  valueSuffix?: string;
};

type TabKey = "Chat Bot Analytics" | "Allowed Categories" | "Settings";

type AllowedCategoryRow = {
  id: string;
  category: string;
  allowed: boolean;
  products: number;
  updatedOn: string;
};

const stats: ChatbotStat[] = [
  {
    title: "Current Usage",
    value: "1,248",
    icon: "/images/Users.svg",
    description: "Total queries processed this month",
  },
  {
    title: "Estimated Cost Today",
    value: "EUR 2.37",
    icon: "/images/revenue.svg",
    description: "AI usage cost for today",
  },
  {
    title: "Tokens Used",
    value: "186,420",
    icon: "/images/Orders.svg",
    description: "Total tokens consumed",
  },
  {
    title: "Remaining Budget",
    value: "EUR 18.63",
    valueSuffix: "/ EUR 30.00",
    icon: "/images/SupportTickets.svg",
    description: "Available budget left for this month",
  },
  {
    title: "Chatbot Status",
    value: "Active",
    icon: "/images/Services.svg",
    description: "Chatbot is currently live on platform",
  },
];

const tabs: TabKey[] = ["Chat Bot Analytics", "Allowed Categories", "Settings"];

const initialAllowedCategories: AllowedCategoryRow[] = [
  { id: "cat-1", category: "Lectic Ferments", allowed: true, products: 12, updatedOn: "2026-04-30" },
  { id: "cat-2", category: "Swelling", allowed: true, products: 14, updatedOn: "2026-05-31" },
  { id: "cat-3", category: "Regularity & Purification", allowed: false, products: 20, updatedOn: "2026-06-30" },
  { id: "cat-4", category: "Haemorrhoids", allowed: true, products: 80, updatedOn: "2026-07-31" },
  { id: "cat-5", category: "Laxatives", allowed: true, products: 10, updatedOn: "2026-04-30" },
  { id: "cat-6", category: "Diarrhea", allowed: false, products: 10, updatedOn: "2026-05-31" },
  { id: "cat-7", category: "Stomach Problem", allowed: true, products: 10, updatedOn: "2026-06-30" },
  { id: "cat-8", category: "Reflux", allowed: false, products: 10, updatedOn: "2026-07-31" },
  { id: "cat-9", category: "Lectic Ferments", allowed: true, products: 10, updatedOn: "2026-04-30" },
  { id: "cat-10", category: "Swelling", allowed: true, products: 10, updatedOn: "2026-05-31" },
  { id: "cat-11", category: "Regularity & Purification", allowed: false, products: 10, updatedOn: "2026-06-30" },
  { id: "cat-12", category: "Haemorrhoids", allowed: true, products: 10, updatedOn: "2026-07-31" },
  { id: "cat-13", category: "Laxatives", allowed: false, products: 30, updatedOn: "2026-04-30" },
  { id: "cat-14", category: "Diarrhea", allowed: true, products: 30, updatedOn: "2026-05-31" },
  { id: "cat-15", category: "Stomach Problem", allowed: true, products: 70, updatedOn: "2026-06-30" },
  { id: "cat-16", category: "Reflux", allowed: false, products: 70, updatedOn: "2026-07-31" },
  { id: "cat-17", category: "Stomach Problem", allowed: true, products: 20, updatedOn: "2026-06-30" },
  { id: "cat-18", category: "Reflux", allowed: false, products: 40, updatedOn: "2026-07-31" },
];

export default function AIChatbotPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("Chat Bot Analytics");
  const [allowedCategories, setAllowedCategories] = useState<AllowedCategoryRow[]>(initialAllowedCategories);
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState("€30.00");
  const [medicinesToShow, setMedicinesToShow] = useState("03");
  const [showOnlyInStock, setShowOnlyInStock] = useState(true);
  const [showNearbyOnly, setShowNearbyOnly] = useState(true);
  const [maxDistanceRadius, setMaxDistanceRadius] = useState("07");

  const allowedCategoryColumns: Column<AllowedCategoryRow>[] = useMemo(
    () => [
      {
        key: "category",
        label: "Categories",
        sortable: false,
        width: "62%",
        render: (value) => (
          <div className="flex items-center gap-2 text-[12px] text-[#21272A]">
            <Image src="/images/Categories.svg" alt="" width={14} height={14} />
            <span>{value}</span>
          </div>
        ),
      },
      {
        key: "allowed",
        label: "Allowed",
        sortable: false,
        width: "14%",
        render: (value, row) => (
          <div className="flex justify-start">
            <CategoryStatusToggle
              checked={Boolean(value)}
              onToggle={() =>
                setAllowedCategories((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, allowed: !item.allowed } : item
                  )
                )
              }
            />
          </div>
        ),
      },
      {
        key: "products",
        label: "Products",
        sortable: false,
        width: "12%",
        render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
      },
      {
        key: "updatedOn",
        label: "Updated on",
        sortable: false,
        width: "12%",
        render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
      },
    ],
    []
  );

  return (
    <div className="min-w-0">
      <h1 className="text-[18px] font-semibold text-black">AI Chatbot</h1>
      <p className="mt-1 text-[12px] font-medium text-[#6B6F72]">
        Monitor chatbot usage, performance, and AI cost in real time.
      </p>

      <div className="mt-4 inline-flex flex-wrap gap-1 rounded-full bg-[#F7F9FC] p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-[11px] font-medium transition-colors ${
              activeTab === tab ? "bg-white text-[#1E3862] shadow-sm" : "text-[#6B6F72] hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "Chat Bot Analytics" ? (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5">
              {stats.map((stat) => (
                <StatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  valueSuffix={stat.valueSuffix}
                  icon={stat.icon}
                  description={stat.description}
                  showChange={false}
                />
              ))}
            </div>
            <ChatbotQueriesChart />
          </>
        ) : activeTab === "Allowed Categories" ? (
          <DataTable<AllowedCategoryRow>
            columns={allowedCategoryColumns}
            data={allowedCategories}
            rowKey={(row) => row.id}
            searchFields={["category", "updatedOn"]}
            showCheckboxes={false}
            hideSearch={true}
            hidePagination={true}
            headerBackground="#F0F6FF"
          />
        ) : (
          <div className="rounded-xl border border-[#D6DADD] bg-white p-4 sm:p-5">
            <h2 className="text-[14px] font-semibold text-[#21272A]">Response Settings</h2>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#21272A]">
                  Monthly Budget Limit
                </label>
                <input
                  type="text"
                  value={monthlyBudgetLimit}
                  onChange={(event) => setMonthlyBudgetLimit(event.target.value)}
                  className="w-full rounded-md border border-[#D6DADD] px-3 py-2 text-[12px] text-[#21272A] outline-none focus:border-[#1E3862]"
                />
                <p className="mt-2 text-[10px] text-[#6B6F72]">
                  Set the maximum AI usage budget for the current month. The chatbot may be disabled once the limit is reached
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#21272A]">
                  Number of Medicines to Show
                </label>
                <input
                  type="text"
                  value={medicinesToShow}
                  onChange={(event) => setMedicinesToShow(event.target.value)}
                  className="w-full rounded-md border border-[#D6DADD] px-3 py-2 text-[12px] text-[#21272A] outline-none focus:border-[#1E3862]"
                />
                <p className="mt-2 text-[10px] text-[#6B6F72]">
                  Define how many medicine suggestions the chatbot should return per query
                </p>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-[#21272A]">Show Only In-Stock Products</p>
                  <p className="mt-2 text-[10px] text-[#6B6F72]">
                    Display only medicines that are currently available for purchase
                  </p>
                </div>
                <CategoryStatusToggle
                  checked={showOnlyInStock}
                  onToggle={() => setShowOnlyInStock((prev) => !prev)}
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-[#21272A]">Show Nearby Pharmacies Only</p>
                  <p className="mt-2 text-[10px] text-[#6B6F72]">
                    Limit results to pharmacies near the user&apos;s selected location
                  </p>
                </div>
                <CategoryStatusToggle
                  checked={showNearbyOnly}
                  onToggle={() => setShowNearbyOnly((prev) => !prev)}
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#21272A]">
                  Max Distance Radius
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={maxDistanceRadius}
                    onChange={(event) => setMaxDistanceRadius(event.target.value)}
                    className="w-full rounded-[4px] border border-[#D6DADD] px-3 py-2 pr-12 text-[12px] text-[#21272A] outline-none focus:border-[#1E3862]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#21272A]">
                    Kms
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-[#6B6F72]">
                  Set the maximum distance to filter nearby pharmacies (in kilometers)
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="rounded-md bg-[#1E3862] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#162b4b]"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
