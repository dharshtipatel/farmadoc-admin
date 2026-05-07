"use client";

import { useState, useMemo } from "react";
import DataTable, { Column } from "../components/DataTable";
import ExportDropdown from "../components/exportdropdown";
import OrderDetailsDrawer from "../components/sellers/OrderDetailsDrawer";
import CancelOrderModal from "../components/cancelorder";
import StatsCard from "../components/statscard";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
type OrderStatus = "Completed" | "Processing" | "Cancelled";
type Stat = {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
};

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  user: { name: string; email: string; phone: string; avatar?: string };
  seller: { name: string; location: string; rating: number };
  amount: number;
  currency: string;
  date: string;
  payment: PaymentStatus;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  trackingNumber?: string;
  notes?: string;
}

const ORDERS: Order[] = [
  {
    orderId: "#FMD-24021211", items: [{ id: "1", name: "Solar Labs Prot Crp Spf50+", image: "🧴", quantity: 1, price: 408.80 }],
    user: { name: "Mahavir Singh", email: "mahavir@email.com", phone: "+39 123 4567890", avatar: "MS" },
    seller: { name: "Binu Pharmacy Milan", location: "Milan", rating: 4.8 },
    amount: 408.80, currency: "EUR", date: "2026-04-24", payment: "Paid", status: "Completed",
    paymentMethod: "Credit Card", shippingAddress: "Via Roma 123, Milan",
  },
  {
    orderId: "#FMD-24021212", items: [{ id: "2", name: "Hydra Boost Moisturizer 24h", image: "💧", quantity: 2, price: 256.12 }],
    user: { name: "Anjali Verma", email: "anjali@email.com", phone: "+39 234 5678901", avatar: "AV" },
    seller: { name: "Crown Health Pharm", location: "Rome", rating: 4.6 },
    amount: 512.25, currency: "EUR", date: "2026-04-25", payment: "Pending", status: "Processing",
    paymentMethod: "PayPal", shippingAddress: "Piazza Navona 45, Rome",
  },
  {
    orderId: "#FMD-24021213", items: [{ id: "3", name: "Revitalizing Eye Cream", image: "👁️", quantity: 1, price: 295.60 }],
    user: { name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+39 345 6789012", avatar: "RK" },
    seller: { name: "Sunnydale Drugstore", location: "Florence", rating: 4.9 },
    amount: 295.60, currency: "EUR", date: "2026-04-26", payment: "Paid", status: "Completed",
    paymentMethod: "Bank Transfer", shippingAddress: "Via dei Medici 78, Florence",
  },
  {
    orderId: "#FMD-24021214", items: [{ id: "4", name: "Night Repair Serum", image: "🌙", quantity: 1, price: 740.00 }],
    user: { name: "Sneha Patel", email: "sneha@email.com", phone: "+39 456 7890123", avatar: "SP" },
    seller: { name: "Green Leaf Pharmacy", location: "Turin", rating: 4.7 },
    amount: 740.00, currency: "EUR", date: "2026-04-27", payment: "Paid", status: "Cancelled",
    paymentMethod: "Credit Card", shippingAddress: "Via Garibaldi 89, Turin",
    notes: "Customer requested cancellation",
  },
  {
    orderId: "#FMD-24021215", items: [{ id: "5", name: "Gentle Exfoliating Scrub", image: "✨", quantity: 3, price: 116.82 }],
    user: { name: "Vikram Sharma", email: "vikram@email.com", phone: "+39 567 8901234", avatar: "VS" },
    seller: { name: "Wellness Pharmacy", location: "Naples", rating: 4.5 },
    amount: 350.45, currency: "EUR", date: "2026-04-28", payment: "Paid", status: "Processing",
    paymentMethod: "Cash on Delivery", shippingAddress: "Via Toledo 234, Naples",
  },
  {
    orderId: "#FMD-24021216", items: [{ id: "6", name: "Vitamin C Brightening Serum", image: "🍊", quantity: 1, price: 625.90 }],
    user: { name: "Priya Gupta", email: "priya@email.com", phone: "+39 678 9012345", avatar: "PG" },
    seller: { name: "Metro Health Center", location: "Bologna", rating: 4.8 },
    amount: 625.90, currency: "EUR", date: "2026-04-29", payment: "Paid", status: "Completed",
    paymentMethod: "Credit Card", shippingAddress: "Viale dei Mille 14, Bologna",
  },
  {
    orderId: "#FMD-24021217", items: [{ id: "7", name: "Anti-Aging Face Mask", image: "🎭", quantity: 2, price: 142.87 }],
    user: { name: "Amit Patel", email: "amit@email.com", phone: "+39 789 0123456", avatar: "AP" },
    seller: { name: "City Wellness Store", location: "Siena", rating: 4.3 },
    amount: 285.75, currency: "EUR", date: "2026-04-30", payment: "Pending", status: "Processing",
    paymentMethod: "PayPal", shippingAddress: "Piazza del Campo 1, Siena",
  },
  {
    orderId: "#FMD-24021218", items: [{ id: "8", name: "Hydrating Body Lotion", image: "🧴", quantity: 1, price: 195.40 }],
    user: { name: "Kavita Sharma", email: "kavita@email.com", phone: "+39 890 1234567", avatar: "KS" },
    seller: { name: "Herbal Pharmacy Hub", location: "Modena", rating: 4.7 },
    amount: 195.40, currency: "EUR", date: "2026-05-01", payment: "Paid", status: "Completed",
    paymentMethod: "Credit Card", shippingAddress: "Via D'Azeglio 28, Modena",
  },
  {
    orderId: "#FMD-24021219", items: [{ id: "9", name: "Collagen Boost Supplement", image: "💊", quantity: 1, price: 890.25 }],
    user: { name: "Rohit Kumar", email: "rohit@email.com", phone: "+39 901 2345678", avatar: "RK" },
    seller: { name: "Vital Care Pharmacy", location: "Palermo", rating: 4.6 },
    amount: 890.25, currency: "EUR", date: "2026-05-02", payment: "Paid", status: "Completed",
    paymentMethod: "Bank Transfer", shippingAddress: "Viale della Libertà 22, Palermo",
  },
  {
    orderId: "#FMD-24021220", items: [{ id: "10", name: "Natural Hair Oil", image: "🌿", quantity: 2, price: 72.90 }],
    user: { name: "Meera Singh", email: "meera@email.com", phone: "+39 012 3456789", avatar: "MS" },
    seller: { name: "Organic Health Mart", location: "Catania", rating: 4.4 },
    amount: 145.80, currency: "EUR", date: "2026-05-03", payment: "Paid", status: "Completed",
    paymentMethod: "Credit Card", shippingAddress: "Via XX Settembre 75, Catania",
  },
];

const statusColors: Record<OrderStatus, { text: string; dot: string }> = {
  Completed:  { text: "#24A148", dot: "#24A148" },
  Processing: { text: "#F59E0B", dot: "#F59E0B" },
  Cancelled:  { text: "#DA1E28", dot: "#DA1E28" },
};

const paymentColors: Record<PaymentStatus, string> = {
  Paid:     "#24A148",
  Pending:  "#F59E0B",
  Failed:   "#DA1E28",
  Refunded: "#8A3FFC",
};

type StatusFilter = "All" | OrderStatus;

const STATUS_FILTERS: StatusFilter[] = ["All", "Completed", "Processing", "Cancelled"];
const stats: Stat[] = [
  { title: "Top Orders", value: 1240, change: "+8.2%", isPositive: true, icon: "/images/Orders.svg" },
  { title: "Completed Orders", value: 320, change: "+5.1%", isPositive: true, icon: "/images/Orders.svg" },
  { title: "In Processing", value: "$12,400", change: "+12.5%", isPositive: true, icon: "/images/Orders.svg" },
  { title: "Cancelled Orders", value: 18, change: "-2.4%", isPositive: false, icon: "/images/Orders.svg" },
  { title: "Order Revenue", value: 18, change: "-2.4%", isPositive: false, icon: "/images/revenue.svg" },
];

export default function OrdersManagement() {
  const [orders, setOrders]             = useState<Order[]>(ORDERS);
  const [openMenu, setOpenMenu]         = useState<string | null>(null);
  const [viewOrder, setViewOrder]       = useState<Order | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const displayOrders = useMemo(() => {
    return statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const columns: Column<Order>[] = [
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
      render: (value) => (
        <span className="text-[#1192E8] font-medium text-[13px]">{value}</span>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <div className="w-[44px] h-[44px] rounded-lg bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-base flex-shrink-0">
            {order.items[0]?.image}
          </div>
          <div>
            <p className="text-[13px] text-[#6B6F72] line-clamp-1 max-w-[140px]">{order.items[0]?.name}</p>
            {order.items.length > 1 && (
              <span className="text-[11px] text-[#A8AAAC]">+{order.items.length - 1} more</span>
            )}
          </div>
        </div>
      ),
      width: "200px",
    },
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#1192E8]">{order.user.name}</span>
        </div>
      ),
    },
    {
      key: "seller",
      label: "Seller",
      sortable: true,
      render: (_, order) => (
        <span className="text-[13px] text-[#1192E8]">{order.seller.name}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (_, order) => (
        <span className="text-[13px] font-medium text-[#6B6F72]">€{order.amount.toFixed(2)}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) => (
        <span className="text-[13px] text-[#6B6F72]">
          {new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      sortable: true,
      render: (value: PaymentStatus) => (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: paymentColors[value] }} />
          <span className="text-[13px] font-medium" style={{ color: paymentColors[value] }}>{value}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: OrderStatus) => (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColors[value].dot }} />
          <span className="text-[13px] font-medium" style={{ color: statusColors[value].text }}>{value}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full font-inter">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-semibold text-black">Orders Management</h1>
          <p className="text-[12px] font-medium text-[#6B6F72] mt-1">Track, manage, and process all pharmacy orders across the platform in real time.</p>
        </div>
      </div>

      <div className="mt-6 mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            showChange={false}
          />
        ))}
      </div>

      <DataTable<Order>
        columns={columns}
        data={displayOrders}
        rowKey={(o) => o.orderId}
        searchPlaceholder="Search here..."
        showCheckboxes={true}
        onRowClick={(order) => setViewOrder(order)}
        toolbarRight={
          <div className="flex items-center gap-2">
            {/* Status filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap border ${
                    statusFilter === f
                      ? "border-[#1192E8] text-[#1192E8] bg-white"
                      : "border-[#D6DADD] text-[#6B6F72] bg-white hover:border-[#1192E8] hover:text-[#1192E8]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
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
                onClick={() => setCancelOrderId("bulk")}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#DA1E28] border border-[#DA1E28] rounded-lg hover:bg-red-50 transition-colors bg-white"
              >
                Cancel Selection
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
        renderRowActions={(order) => (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenu(openMenu === order.orderId ? null : order.orderId)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors text-lg"
            >
              ⋮
            </button>
            {openMenu === order.orderId && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[160px]">

                <button
                  onClick={() => { setOpenMenu(null); setViewOrder(order); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Details
                </button>

                {order.status !== "Cancelled" && order.status !== "Completed" && (
                  <>
                    <div className="mx-3 border-t border-[#F0F2F4]" />
                    <button
                      onClick={() => { setOpenMenu(null); setCancelOrderId(order.orderId); }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-[#DA1E28] hover:bg-red-50 transition-colors flex items-center gap-2.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      Cancel Order
                    </button>
                  </>
                )}

              </div>
            )}
          </div>
        )}
        customFilter={(order, query) => {
          const q = query.toLowerCase();
          return (
            order.orderId.toLowerCase().includes(q) ||
            order.user.name.toLowerCase().includes(q) ||
            order.seller.name.toLowerCase().includes(q) ||
            order.items.some((i) => i.name.toLowerCase().includes(q))
          );
        }}
      />

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={viewOrder}
        isOpen={viewOrder !== null}
        onClose={() => setViewOrder(null)}
        onCancelOrder={(orderId) => {
          setViewOrder(null);
          setCancelOrderId(orderId);
        }}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        open={cancelOrderId !== null}
        orderId={cancelOrderId ?? ""}
        onClose={() => setCancelOrderId(null)}
        onConfirm={(reasons, note) => {
          if (cancelOrderId && cancelOrderId !== "bulk") {
            setOrders((prev) =>
              prev.map((o) =>
                o.orderId === cancelOrderId
                  ? { ...o, status: "Cancelled", notes: note }
                  : o
              )
            );
          }
          setCancelOrderId(null);
        }}
      />
    </div>
  );
}