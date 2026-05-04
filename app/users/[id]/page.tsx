"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { INITIAL_USERS } from "../data";
import { use, useState } from "react";
import StatsCard from "../../components/statscard";
import CancelOrderModal from "../../components/cancelorder";
import OrderDetailsModal, { type OrderDetailsData } from "../../components/vieworder";

// ── Icons ────────────────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5 19.79 19.79 0 0 1 1.08 4.82 2 2 0 0 1 3.05 2.63h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="#21272A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const MoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="16" viewBox="0 0 4 16" fill="#6B6F72">
    <circle cx="2" cy="2" r="1.5"/>
    <circle cx="2" cy="8" r="1.5"/>
    <circle cx="2" cy="14" r="1.5"/>
  </svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="#A8AAAC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ColSortIcon = ({ active, dir }: { active: boolean; dir: "asc" | "desc" }) => (
  <span className="inline-flex flex-col leading-none opacity-40 flex-shrink-0">
    <span style={{ fontSize: "7px" }} className={active && dir === "asc" ? "opacity-100 text-blue-500" : ""}>▲</span>
    <span style={{ fontSize: "7px" }} className={active && dir === "desc" ? "opacity-100 text-blue-500" : ""}>▼</span>
  </span>
);

// ── Types ────────────────────────────────────────────────────────────────────
type OrderStatus   = "Completed" | "Processing" | "Cancelled";
type PaymentStatus = "Paid" | "Pending";

interface Order {
  id: string;
  items: string;
  itemImg: string;
  extraItems?: number;
  seller: string;
  extraSellers?: number;
  amount: number;
  date: string;
  payment: PaymentStatus;
  status: OrderStatus;
}

type Stat = {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
};

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { id: "#FD65161516", items: "Solar Labo Prot Crp Spf50+",   itemImg: "🧴", extraItems: 2, seller: "Binu Pharmacy Milan",  extraSellers: 2, amount: 408.80, date: "24-04-2026", payment: "Paid",    status: "Completed"  },
  { id: "#FD65161517", items: "Hydra Boost Moisturizer 24h",   itemImg: "🧴",               seller: "Crown Health Pharm",                    amount: 512.25, date: "25-04-2026", payment: "Pending", status: "Processing" },
  { id: "#FD65161518", items: "Revitalizing Eye Cream",         itemImg: "🧴", extraItems: 2, seller: "Sunnydale Drugstore", extraSellers: 2, amount: 295.60, date: "26-04-2026", payment: "Paid",    status: "Processing" },
  { id: "#FD65161519", items: "Night Repair Serum",             itemImg: "💊",               seller: "Green Leaf Pharmac",                    amount: 740.00, date: "27-04-2026", payment: "Paid",    status: "Cancelled"  },
  { id: "#FD65161520", items: "Gentle Exfoliating Scrub",       itemImg: "🧴", extraItems: 2, seller: "Wellness Pharmacy",  extraSellers: 2,  amount: 350.45, date: "28-04-2026", payment: "Paid",    status: "Processing" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 12, 25, 50];

const statusColors: Record<OrderStatus, { text: string; bg: string; dot: string }> = {
  Completed:  { text: "#24A148", bg: "#EDFBF1", dot: "#24A148" },
  Processing: { text: "#F59E0B", bg: "#FFFBEB", dot: "#F59E0B" },
  Cancelled:  { text: "#DA1E28", bg: "#FFF1F2", dot: "#DA1E28" },
};
const paymentColors: Record<PaymentStatus, { text: string; dot: string }> = {
  Paid:    { text: "#24A148", dot: "#24A148" },
  Pending: { text: "#F59E0B", dot: "#F59E0B" },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderSearch, setOrderSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [sortKey, setSortKey]           = useState<keyof Order | null>(null);
  const [sortDir, setSortDir]           = useState<"asc" | "desc">("asc");
  const [orderPage, setOrderPage]       = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(12);

  const activeTab =
    searchParams.get("tab") === "order-history" ? "order-history" : "overview";

  const user = INITIAL_USERS.find((item) => String(item.id) === id);
  if (!user) notFound();

  const setActiveTab = (tab: "overview" | "order-history") => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (tab === "overview") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tab);
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `/users/${id}?${nextQuery}` : `/users/${id}`);
  };

  const avgOrderValue   = (user.totalSpent / user.orders).toFixed(2);
  const lastActive      = "09-12-2023";
  const joinedOn        = user.joinedOn || "05-12-2023";

  const stats: Stat[] = [
    { title: "Top Orders",        value: 25,      change: "+8.2%",  isPositive: true,  icon: "/images/Users.svg" },
    { title: "Top Spent",         value: 5652.00, change: "+5.1%",  isPositive: true,  icon: "/images/PharmaciesReq.svg" },
    { title: "Avg. Order Value",  value: 56,      change: "+12.5%", isPositive: true,  icon: "/images/star.svg" },
    { title: "Cancellation Rate", value: "0.5%",  change: "-2.4%",  isPositive: false, icon: "/images/Orders.svg" },
  ];

  // ── Order filtering / sorting / pagination ──────────────────────────────
  const filteredOrders = MOCK_ORDERS
    .filter((o) => {
      const q = orderSearch.toLowerCase();
      const matchSearch = o.id.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q) ||
        o.seller.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const orderTotalPages = Math.max(1, Math.ceil(filteredOrders.length / orderPageSize));
  const orderSafePage   = Math.min(orderPage, orderTotalPages);
  const orderPageData   = filteredOrders.slice(
    (orderSafePage - 1) * orderPageSize,
    orderSafePage * orderPageSize
  );

  const handleSort = (key: keyof Order) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const changeOrderPageSize = (dir: 1 | -1) => {
    const idx  = PAGE_SIZE_OPTIONS.indexOf(orderPageSize);
    const next = idx + dir;
    if (next >= 0 && next < PAGE_SIZE_OPTIONS.length) {
      setOrderPageSize(PAGE_SIZE_OPTIONS[next]);
      setOrderPage(1);
    }
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (orderTotalPages <= 7) return Array.from({ length: orderTotalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (orderSafePage > 3) pages.push("...");
    const start = Math.max(2, orderSafePage - 1);
    const end   = Math.min(orderTotalPages - 1, orderSafePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (orderSafePage < orderTotalPages - 2) pages.push("...");
    pages.push(orderTotalPages);
    return pages;
  };

  const orderColumns: { key: keyof Order; label: string }[] = [
    { key: "id",      label: "Order ID" },
    { key: "items",   label: "Items"    },
    { key: "seller",  label: "Seller"   },
    { key: "amount",  label: "Amount"   },
    { key: "date",    label: "Date"     },
    { key: "payment", label: "Payment"  },
    { key: "status",  label: "Status"   },
  ];

  const contactFields = [
    { icon: <EmailIcon />,    label: "Email",        value: user.email   },
    { icon: <PhoneIcon />,    label: "Phone Number", value: user.phone   },
    { icon: <CalendarIcon />, label: "Joined on",    value: joinedOn     },
    { icon: <ClockIcon />,    label: "Last Active",  value: lastActive   },
  ];

  // Add this state at the top of your component with the other states:
const [pageSizeInput, setPageSizeInput] = useState(String(orderPageSize));

const [openOrderMenu, setOpenOrderMenu] = useState<string | null>(null);

const [topMenuOpen, setTopMenuOpen] = useState(false);
const [suspendModalOpen, setSuspendModalOpen] = useState(false);
const [selectedOrder, setSelectedOrder] = useState<OrderDetailsData | null>(null);

const buildOrderDetails = (order: Order): OrderDetailsData => ({
  orderId: order.id,
  date: order.date,
  status: order.status,
  groups: [
    {
      pharmacy: order.seller,
      items: [
        {
          name: order.items,
          qty: order.extraItems ? order.extraItems + 1 : 1,
          price: order.amount,
          img: order.itemImg,
        },
      ],
    },
  ],
  bill: {
    cartTotal: order.amount,
    platformFee: 0,
    totalDiscount: 0,
    couponDiscount: 0,
    paidAmount: order.amount,
    method: order.payment === "Paid" ? "Paid" : "Pending",
  },
});

const [cancelModalOpen, setCancelModalOpen] = useState(false);

  return (
    <div
      className="w-full font-inter bg-white min-h-screen"
      onClick={() => {
        setOpenOrderMenu(null);
        setTopMenuOpen(false);
      }}
    >
      <OrderDetailsModal
        open={selectedOrder !== null}
        order={selectedOrder ?? undefined}
        onClose={() => setSelectedOrder(null)}
      />

      {/* ── Top Nav ── */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EDF2FB] hover:bg-gray-200 transition-colors"
          >
            <BackIcon />
          </button>

          <div className="flex items-center gap-0.5 bg-[#EDF2FB] rounded-full px-1 py-1">
            {(["overview", "order-history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1 rounded-full text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: activeTab === tab ? "#fff" : "transparent",
                  color:           activeTab === tab ? "#21272A" : "#6B6F72",
                  boxShadow:       activeTab === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {tab === "overview" ? "Overview" : "Order History"}
              </button>
            ))}
          </div>
        </div>

   
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setTopMenuOpen((prev) => !prev); }}
            className="w-8 h-8 bg-[#EDF2FB] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreIcon />
          </button>

          {topMenuOpen && (
            <div className="absolute right-0 top-10 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[160px]">
              <button
                onClick={() => { setTopMenuOpen(false); setSuspendModalOpen(true); }}
                className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-[#D62828] hover:bg-amber-50 transition-colors flex items-center gap-2.5 font-inter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="#D62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                  <line x1="10" y1="14" x2="10" y2="20"/>
                  <line x1="14" y1="14" x2="14" y2="20"/>
                </svg>
                Suspend User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div
          className="px-5 pt-4 pb-6"
          onClick={() => {
            setOpenOrderMenu(null);
            setTopMenuOpen(false);
          }}
        >

          {/* Profile card */}
          <div className="p-4 border border-[#E8EAED] rounded-xl mb-5">
            <div className="mb-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[16px] font-bold mb-2"
                style={{ backgroundColor: user.bgColor }}
              >
                {user.initials}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-semibold text-black">{user.name}</p>
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                  style={{
                    color:            user.status === "Active" ? "#24A148" : "#DA1E28",
                    backgroundColor:  user.status === "Active" ? "#EDFBF1" : "#FFF1F2",
                    borderColor:      user.status === "Active" ? "#A7F3C0" : "#FECACA",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: user.status === "Active" ? "#24A148" : "#DA1E28" }}
                  />
                  + {user.status}
                </span>
              </div>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap gap-6 mt-4">
              {contactFields.map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F0F6FF] flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B6F72] font-medium mb-0.5">{label}</p>
                    <p className="text-[13px] font-medium text-[#21272A]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {stats.map((stat, i) => (
              <StatsCard key={i} title={stat.title} value={stat.value} icon={stat.icon} showChange={false} />
            ))}
          </div>
        </div>
      )}

      {/* ── Order History Tab ── */}
      {activeTab === "order-history" && (
        <div className="px-5 pt-4 pb-6">
          <div
            className="bg-white border border-[#D6DADD] rounded-2xl overflow-hidden"
            onClick={() => {
              setOpenOrderMenu(null);
              setTopMenuOpen(false);
            }}
          >

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap">
              <div className="relative w-56">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search here..."
                  value={orderSearch}
                  onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                  className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                {(["All", "Completed", "Processing", "Cancelled"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setOrderPage(1); }}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors"
                    style={{
                      backgroundColor: statusFilter === s ? "#1192E8" : "#fff",
                      color:           statusFilter === s ? "#fff"     : "#6B6F72",
                      borderColor:     statusFilter === s ? "#1192E8"  : "#D6DADD",
                    }}
                  >
                    {s}
                  </button>
                ))}
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white">
                  <ExportIcon />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFF] border-y border-[#D6DADD]">
                    {orderColumns.map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap"
                      >
                        <span className="flex items-center justify-between text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide">
                          {label}
                          <ColSortIcon active={sortKey === key} dir={sortDir} />
                        </span>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#6B6F72] uppercase tracking-wide whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderPageData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#6B6F72]">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orderPageData.map((order) => (
                      <tr key={order.id} className="border-b border-[#F0F2F4] last:border-b-0 hover:bg-blue-50/20 transition-colors">

                        {/* Order ID */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-[13px] font-medium text-[#1192E8]">{order.id}</span>
                        </td>

                        {/* Items */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{order.itemImg}</span>
                            <span className="text-[13px] text-[#21272A]">{order.items}</span>
                            {order.extraItems && (
                              <span className="text-[11px] text-[#6B6F72] bg-[#F4F6F8] px-1.5 py-0.5 rounded-md">
                                +{order.extraItems}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Seller */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] text-[#1192E8]">{order.seller}</span>
                            {order.extraSellers && (
                              <span className="text-[11px] text-[#6B6F72] bg-[#F4F6F8] px-1.5 py-0.5 rounded-md">
                                +{order.extraSellers}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-[13px] text-black">€{order.amount.toFixed(2)}</span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-[13px] text-black">{order.date}</span>
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: paymentColors[order.payment].dot }}
                            />
                            <span
                              className="text-[13px] font-medium"
                              style={{ color: paymentColors[order.payment].text }}
                            >
                              {order.payment}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{
                              color: statusColors[order.status].text,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: statusColors[order.status].dot }}
                            />
                            {order.status}
                          </span>
                        </td>

                        {/* Action */}
                      <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setOpenOrderMenu(openOrderMenu === order.id ? null : order.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] text-lg transition-colors"
                        >
                          ⋮
                        </button>

                        {openOrderMenu === order.id && (
                        <div className="absolute right-4 top-8 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[180px]">

                          {/* View Order */}
                          <button
                            onClick={() => {
                              setOpenOrderMenu(null);
                              setSelectedOrder(buildOrderDetails(order));
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-3"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                              fill="none" stroke="#6B6F72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                              className="flex-shrink-0">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span>View Order</span>
                          </button>

                          {/* Mark as Completed */}
                          <button
                            onClick={() => setOpenOrderMenu(null)}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-3"
                          >
                            {/* Simple checkmark circle */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                              fill="none" stroke="#21272A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                              className="flex-shrink-0">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="8 12 11 15 16 9"/>
                            </svg>
                            <span>Mark as Completed</span>
                          </button>

                          {/* Cancel Order */}
                          <button
                            onClick={() => {
                              setOpenOrderMenu(null);
                              setSelectedOrder(null);
                              setCancelModalOpen(true);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-[#DA1E28] hover:bg-red-50 transition-colors flex items-center gap-3"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                              fill="none" stroke="#DA1E28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                              className="flex-shrink-0">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            <span>Cancel Order</span>
                          </button>

                        </div>
                      )}
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#D6DADD] flex-wrap gap-3">

              {/* Page Entries */}
<div className="flex items-center gap-2 text-[12px] text-[#6B6F72]">
  <span>Page Entries</span>
  <div className="flex items-center border border-[#D6DADD] rounded-lg overflow-hidden">
    <input
      type="text"
      inputMode="numeric"
      value={pageSizeInput}
      onChange={(e) => {
        const raw = e.target.value;
        // Allow empty string or digits only while typing
        if (raw === "" || /^\d+$/.test(raw)) {
          setPageSizeInput(raw);
          const val = parseInt(raw);
          if (!isNaN(val) && val >= 1 && val <= 100) {
            setOrderPageSize(val);
            setOrderPage(1);
          }
        }
      }}
      onBlur={() => {
        // On blur, if empty or invalid, reset to current pageSize
        const val = parseInt(pageSizeInput);
        if (isNaN(val) || val < 1) {
          setPageSizeInput(String(orderPageSize));
        }
      }}
      className="w-12 px-2 py-1.5 text-[12px] text-[#21272A] text-center outline-none bg-white"
    />
    <div className="flex flex-col border-l border-[#D6DADD]">
      <button
        onClick={() => {
          const next = orderPageSize + 1;
          if (next <= 100) {
            setOrderPageSize(next);
            setPageSizeInput(String(next));
            setOrderPage(1);
          }
        }}
        className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72] transition-colors"
      >▲</button>
      <button
        onClick={() => {
          const next = orderPageSize - 1;
          if (next >= 1) {
            setOrderPageSize(next);
            setPageSizeInput(String(next));
            setOrderPage(1);
          }
        }}
        className="px-1.5 py-0.5 hover:bg-gray-100 text-[7px] text-[#6B6F72] border-t border-[#D6DADD] transition-colors"
      >▼</button>
    </div>
  </div>
  <span className="text-[#A8AAAC]">
    {filteredOrders.length === 0
      ? "0"
      : `${(orderSafePage - 1) * orderPageSize + 1}–${Math.min(orderSafePage * orderPageSize, filteredOrders.length)}`
    } of {filteredOrders.length}
  </span>
</div>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                  disabled={orderSafePage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded border border-[#D6DADD] text-[#6B6F72] hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm"
                >‹</button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="text-[#6B6F72] text-[12px] px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setOrderPage(p as number)}
                      className="w-7 h-7 flex items-center justify-center rounded text-[12px] transition-colors"
                      style={{
                        backgroundColor: orderSafePage === p ? "#1192E8" : "transparent",
                        color:           orderSafePage === p ? "#fff"     : "#6B6F72",
                        border:          orderSafePage === p ? "none"     : "1px solid #D6DADD",
                      }}
                    >{p}</button>
                  )
                )}

                <button
                  onClick={() => setOrderPage((p) => Math.min(orderTotalPages, p + 1))}
                  disabled={orderSafePage === orderTotalPages}
                  className="w-7 h-7 flex items-center justify-center rounded border border-[#D6DADD] text-[#6B6F72] hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm"
                >›</button>
              </div>

            </div>
          </div>
          <CancelOrderModal
  open={cancelModalOpen}
  orderId={selectedOrder?.orderId}
  onClose={() => setCancelModalOpen(false)}
  onConfirm={(reasons, note) => {
    console.log("Cancel order:", selectedOrder?.orderId, reasons, note);
    setCancelModalOpen(false);
  }}
/>
        </div>
      )}

    </div>
  );
}
