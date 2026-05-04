"use client";

import { useState } from "react";

type PaymentStatus = "Paid" | "Pending";
type OrderStatus = "Completed" | "Processing" | "Cancelled";

interface Order {
  orderId: string;
  items: { name: string; image: string };
  user: string;
  seller: string;
  sellerExtra: number;
  amount: string;
  date: string;
  payment: PaymentStatus;
  status: OrderStatus;
}

const orders: Order[] = [
  {
    orderId: "#FD65161516",
    items: { name: "Solar Labs Prot Crp Spf50+", image: "🧴" },
    user: "Mahavir Singh",
    seller: "Binu Pharmacy Milan",
    sellerExtra: 2,
    amount: "€408.80",
    date: "24-04-2026",
    payment: "Paid",
    status: "Completed",
  },
  {
    orderId: "#FD65161517",
    items: { name: "Hydra Boost Moisturizer 24h", image: "💧" },
    user: "Anjali Verma",
    seller: "Crown Health Pharm",
    sellerExtra: 0,
    amount: "€512.25",
    date: "25-04-2026",
    payment: "Pending",
    status: "Processing",
  },
  {
    orderId: "#FD65161518",
    items: { name: "Revitalizing Eye Cream", image: "👁️" },
    user: "Rajesh Kumar",
    seller: "Sunnydale Drugstore",
    sellerExtra: 2,
    amount: "€295.60",
    date: "26-04-2026",
    payment: "Paid",
    status: "Processing",
  },
  {
    orderId: "#FD65161519",
    items: { name: "Night Repair Serum", image: "🌙" },
    user: "Sneha Patel",
    seller: "Green Leaf Pharmac",
    sellerExtra: 0,
    amount: "€740.00",
    date: "27-04-2026",
    payment: "Paid",
    status: "Cancelled",
  },
  {
    orderId: "#FD65161520",
    items: { name: "Gentle Exfoliating Scrub", image: "✨" },
    user: "Vikram Sharma",
    seller: "Wellness Pharmacy",
    sellerExtra: 2,
    amount: "€350.45",
    date: "28-04-2026",
    payment: "Paid",
    status: "Processing",
  },
];

const paymentColors: Record<PaymentStatus, string> = {
  Paid: "#24A148",
  Pending: "#F1A817",
};

const statusColors: Record<OrderStatus, string> = {
  Completed: "#24A148",
  Processing: "#0F62FE",
  Cancelled: "#DA1E28",
};

const statusDotColors: Record<OrderStatus, string> = {
  Completed: "#24A148",
  Processing: "#0F62FE",
  Cancelled: "#DA1E28",
};

const paymentDotColors: Record<PaymentStatus, string> = {
  Paid: "#24A148",
  Pending: "#F1A817",
};

type SortKey = "orderId" | "items" | "user" | "seller" | "amount" | "date" | "payment" | "status";

export default function RecentOrders() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...orders].sort((a, b) => {
    if (!sortKey) return 0;
    const av = sortKey === "items" ? a.items.name : (a[sortKey as keyof Order] as string);
    const bv = sortKey === "items" ? b.items.name : (b[sortKey as keyof Order] as string);
    if (typeof av === "string" && typeof bv === "string") {
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return 0;
  });

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="inline-flex flex-col leading-none opacity-40 ml-auto">
      <span className={`text-[8px] ${sortKey === col && sortDir === "asc" ? "opacity-100 text-blue-500" : ""}`}>▲</span>
      <span className={`text-[8px] ${sortKey === col && sortDir === "desc" ? "opacity-100 text-blue-500" : ""}`}>▼</span>
    </span>
  );

  return (
    <div className="font-inter mb-4 bg-gray-50 mt-2 flex items-start">
      <div className="w-full bg-white rounded-xl border border-[#D6DADD] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6DADD]">
          <h2 className="text-[16px] font-semibold font-inter text-black">Recent Orders</h2>
          <button className="text-[14px] font-inter text-[#1192E8] hover:text-blue-600 font-medium transition-colors">
            View All
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F6FF] border-b border-[#D6DADD]">
                {(
                  [
                    ["orderId", "Order ID"],
                    ["items", "Items"],
                    ["user", "User"],
                    ["seller", "Seller"],
                    ["amount", "Amount"],
                    ["date", "Date"],
                    ["payment", "Payment"],
                    ["status", "Status"],
                    [null, "Action"],
                  ] as [SortKey | null, string][]
                ).map(([key, label]) => (
                  <th
                    key={label}
                    onClick={() => key && handleSort(key)}
                    className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap select-none ${
                      key ? "cursor-pointer hover:text-gray-700" : ""
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>{label}</span>
                      {key && <SortIcon col={key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#1192E8] font-medium font-inter text-[14px]">{order.orderId}</span>
                  </td>

                  {/* Items */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-base flex-shrink-0">
                        {order.items.image}
                      </div>
                      <span className="text-[#6B6F72] font-inter text-[14px] max-w-[120px] leading-tight">
                        {order.items.name}
                      </span>
                    </div>
                  </td>

                  {/* User */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#1192E8] font-inter text-[14px]">{order.user}</span>
                  </td>

                  {/* Seller */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#1192E8] font-inter text-[14px]">
                      {order.seller}
                      {order.sellerExtra > 0 && (
                        <span className="ml-1 text-[#1192E8] font-inter text-[14px]">+{order.sellerExtra}</span>
                      )}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#6B6F72] font-inter text-[14px]">{order.amount}</span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[#6B6F72] font-inter text-[14px]">{order.date}</span>
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, backgroundColor: paymentDotColors[order.payment] }} />
                      <span className="font-inter text-[14px] font-medium" style={{ color: paymentColors[order.payment] }}>
                        {order.payment}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, backgroundColor: statusDotColors[order.status] }} />
                      <span className="font-inter text-[14px] font-medium" style={{ color: statusColors[order.status] }}>
                        {order.status}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === order.orderId ? null : order.orderId)
                      }
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ⋮
                    </button>
                    {openMenu === order.orderId && (
                      <div className="absolute right-4 top-10 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[130px]">
                        {["View Details", "Edit Order", "Cancel Order"].map((item) => (
                          <button
                            key={item}
                            onClick={() => setOpenMenu(null)}
                            className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}