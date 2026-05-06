"use client";

import { useMemo, useState } from "react";
import DataTable, { Column } from "../components/DataTable";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
type OrderStatus = "Completed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

function formatDisplayDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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
  user: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  seller: {
    name: string;
    location: string;
    rating: number;
  };
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

const orders: Order[] = [
  {
    orderId: "#FD65161516",
    items: [
      { id: "1", name: "Solar Labs Prot Crp Spf50+", image: "🧴", quantity: 1, price: 408.8 }
    ],
    user: {
      name: "Mahavir Singh",
      email: "mahavir.singh@email.com",
      phone: "+91 98765 43210",
      avatar: "MS",
    },
    seller: {
      name: "Binu Pharmacy Milan",
      location: "Milan, Italy",
      rating: 4.8,
    },
    amount: 408.8,
    currency: "EUR",
    date: "2026-04-24",
    payment: "Paid",
    status: "Completed",
    paymentMethod: "Credit Card",
    shippingAddress: "Via Roma 123, Milan, Italy",
    trackingNumber: "TRK123456789",
    notes: "Handle with care - fragile items.",
  },
  {
    orderId: "#FD65161517",
    items: [
      { id: "2", name: "Hydra Boost Moisturizer 24h", image: "💧", quantity: 2, price: 256.12 }
    ],
    user: {
      name: "Anjali Verma",
      email: "anjali.verma@email.com",
      phone: "+91 87654 32109",
      avatar: "AV",
    },
    seller: {
      name: "Crown Health Pharm",
      location: "Rome, Italy",
      rating: 4.6,
    },
    amount: 512.25,
    currency: "EUR",
    date: "2026-04-25",
    payment: "Pending",
    status: "Processing",
    paymentMethod: "PayPal",
    shippingAddress: "Piazza Navona 45, Rome, Italy",
  },
  {
    orderId: "#FD65161518",
    items: [
      { id: "3", name: "Revitalizing Eye Cream", image: "👁️", quantity: 1, price: 295.6 }
    ],
    user: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 76543 21098",
      avatar: "RK",
    },
    seller: {
      name: "Sunnydale Drugstore",
      location: "Florence, Italy",
      rating: 4.9,
    },
    amount: 295.6,
    currency: "EUR",
    date: "2026-04-26",
    payment: "Paid",
    status: "Shipped",
    paymentMethod: "Bank Transfer",
    shippingAddress: "Via dei Medici 78, Florence, Italy",
    trackingNumber: "TRK987654321",
  },
  {
    orderId: "#FD65161519",
    items: [
      { id: "4", name: "Night Repair Serum", image: "🌙", quantity: 1, price: 740.0 }
    ],
    user: {
      name: "Sneha Patel",
      email: "sneha.patel@email.com",
      phone: "+91 65432 10987",
      avatar: "SP",
    },
    seller: {
      name: "Green Leaf Pharmac",
      location: "Venice, Italy",
      rating: 4.7,
    },
    amount: 740.0,
    currency: "EUR",
    date: "2026-04-27",
    payment: "Paid",
    status: "Cancelled",
    paymentMethod: "Credit Card",
    shippingAddress: "Canal Grande 156, Venice, Italy",
    notes: "Customer requested cancellation.",
  },
  {
    orderId: "#FD65161520",
    items: [
      { id: "5", name: "Gentle Exfoliating Scrub", image: "✨", quantity: 3, price: 116.82 }
    ],
    user: {
      name: "Vikram Sharma",
      email: "vikram.sharma@email.com",
      phone: "+91 54321 09876",
      avatar: "VS",
    },
    seller: {
      name: "Wellness Pharmacy",
      location: "Naples, Italy",
      rating: 4.5,
    },
    amount: 350.45,
    currency: "EUR",
    date: "2026-04-28",
    payment: "Paid",
    status: "Processing",
    paymentMethod: "Cash on Delivery",
    shippingAddress: "Via Toledo 234, Naples, Italy",
  },
  {
    orderId: "#FD65161521",
    items: [
      { id: "6", name: "Vitamin C Brightening Serum", image: "🍊", quantity: 1, price: 625.9 },
      { id: "7", name: "Hydrating Face Mask", image: "🎭", quantity: 2, price: 45.0 }
    ],
    user: {
      name: "Priya Gupta",
      email: "priya.gupta@email.com",
      phone: "+91 43210 98765",
      avatar: "PG",
    },
    seller: {
      name: "Metro Health Center",
      location: "Turin, Italy",
      rating: 4.8,
    },
    amount: 715.9,
    currency: "EUR",
    date: "2026-04-29",
    payment: "Paid",
    status: "Delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "Via Garibaldi 89, Turin, Italy",
    trackingNumber: "TRK456789123",
  },
  {
    orderId: "#FD65161522",
    items: [
      { id: "8", name: "Anti-Aging Face Mask", image: "🎭", quantity: 1, price: 285.75 }
    ],
    user: {
      name: "Amit Patel",
      email: "amit.patel@email.com",
      phone: "+91 32109 87654",
      avatar: "AP",
    },
    seller: {
      name: "City Wellness Store",
      location: "Bologna, Italy",
      rating: 4.6,
    },
    amount: 285.75,
    currency: "EUR",
    date: "2026-04-30",
    payment: "Pending",
    status: "Processing",
    paymentMethod: "PayPal",
    shippingAddress: "Via dell'Indipendenza 67, Bologna, Italy",
  },
  {
    orderId: "#FD65161523",
    items: [
      { id: "9", name: "Hydrating Body Lotion", image: "🧴", quantity: 4, price: 48.85 }
    ],
    user: {
      name: "Kavita Sharma",
      email: "kavita.sharma@email.com",
      phone: "+91 21098 76543",
      avatar: "KS",
    },
    seller: {
      name: "Herbal Pharmacy Hub",
      location: "Genoa, Italy",
      rating: 4.7,
    },
    amount: 195.4,
    currency: "EUR",
    date: "2026-05-01",
    payment: "Paid",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    shippingAddress: "Via XX Settembre 12, Genoa, Italy",
    trackingNumber: "TRK789123456",
  },
  {
    orderId: "#FD65161524",
    items: [
      { id: "10", name: "Collagen Boost Supplement", image: "💊", quantity: 1, price: 890.25 }
    ],
    user: {
      name: "Rohit Kumar",
      email: "rohit.kumar@email.com",
      phone: "+91 10987 65432",
      avatar: "RK",
    },
    seller: {
      name: "Vital Care Pharmacy",
      location: "Palermo, Italy",
      rating: 4.9,
    },
    amount: 890.25,
    currency: "EUR",
    date: "2026-05-02",
    payment: "Paid",
    status: "Shipped",
    paymentMethod: "Credit Card",
    shippingAddress: "Via Maqueda 45, Palermo, Italy",
    trackingNumber: "TRK321654987",
  },
  {
    orderId: "#FD65161525",
    items: [
      { id: "11", name: "Natural Hair Oil", image: "🧴", quantity: 2, price: 72.9 }
    ],
    user: {
      name: "Meera Singh",
      email: "meera.singh@email.com",
      phone: "+91 09876 54321",
      avatar: "MS",
    },
    seller: {
      name: "Organic Health Mart",
      location: "Catania, Italy",
      rating: 4.5,
    },
    amount: 145.8,
    currency: "EUR",
    date: "2026-05-03",
    payment: "Paid",
    status: "Returned",
    paymentMethod: "PayPal",
    shippingAddress: "Via Etnea 78, Catania, Italy",
    notes: "Product returned due to quality issues.",
  },
];

const paymentColors: Record<PaymentStatus, string> = {
  Paid: "#24A148",
  Pending: "#F1A817",
  Failed: "#DA1E28",
  Refunded: "#8A3FFC",
};

const statusColors: Record<OrderStatus, string> = {
  Completed: "#24A148",
  Processing: "#0F62FE",
  Shipped: "#1192E8",
  Delivered: "#198038",
  Cancelled: "#DA1E28",
  Returned: "#FF832B",
};

const statusDotColors: Record<OrderStatus, string> = {
  Completed: "#24A148",
  Processing: "#0F62FE",
  Shipped: "#1192E8",
  Delivered: "#198038",
  Cancelled: "#DA1E28",
  Returned: "#FF832B",
};

const paymentDotColors: Record<PaymentStatus, string> = {
  Paid: "#24A148",
  Pending: "#F1A817",
  Failed: "#DA1E28",
  Refunded: "#8A3FFC",
};

const OrderDetailsModal = ({ order, isOpen, onClose }: { order: Order | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#D6DADD]">
          <div>
            <h2 className="text-xl font-semibold text-black">Order Details</h2>
            <p className="text-sm text-[#6B6F72]">{order.orderId}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#6B6F72]">
            ✕
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Order Date</p>
              <p className="text-sm text-[#21272A]">{formatDisplayDate(order.date)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Payment Status</p>
              <p className="text-sm font-semibold" style={{ color: paymentColors[order.payment] }}>{order.payment}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Order Status</p>
              <p className="text-sm font-semibold" style={{ color: statusColors[order.status] }}>{order.status}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-3xl p-4">
              <h3 className="text-sm font-medium text-[#21272A] mb-3">Customer</h3>
              <p className="font-medium text-[#21272A]">{order.user.name}</p>
              <p className="text-sm text-[#6B6F72]">{order.user.email}</p>
              <p className="text-sm text-[#6B6F72]">{order.user.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-4">
              <h3 className="text-sm font-medium text-[#21272A] mb-3">Shipping</h3>
              <p className="text-sm text-[#6B6F72]">{order.shippingAddress}</p>
              {order.trackingNumber && <p className="text-sm text-[#21272A] mt-2">Tracking: {order.trackingNumber}</p>}
            </div>
          </div>
          <div className="bg-gray-50 rounded-3xl p-4">
            <h3 className="text-sm font-medium text-[#21272A] mb-3">Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-2xl p-3 border border-[#E6E8EB]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">{item.image}</div>
                    <div>
                      <p className="font-medium text-[#21272A]">{item.name}</p>
                      <p className="text-xs text-[#6B6F72]">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-[#21272A]">€{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-3xl p-4">
              <h3 className="text-sm font-medium text-[#21272A] mb-3">Seller</h3>
              <p className="font-medium text-[#21272A]">{order.seller.name}</p>
              <p className="text-sm text-[#6B6F72]">{order.seller.location}</p>
              <p className="text-sm text-[#6B6F72]">Rating: {order.seller.rating}</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-4">
              <h3 className="text-sm font-medium text-[#21272A] mb-3">Payment</h3>
              <p className="text-sm text-[#21272A]">Method: {order.paymentMethod}</p>
              <p className="text-sm text-[#6B6F72]">Total: €{order.amount.toFixed(2)}</p>
            </div>
          </div>
          {order.notes && (
            <div className="bg-yellow-50 rounded-3xl p-4 border border-yellow-200">
              <h3 className="text-sm font-medium text-[#21272A] mb-2">Notes</h3>
              <p className="text-sm text-[#21272A]">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
    <input
      type="date"
      value={startDate}
      onChange={(e) => onStartDateChange(e.target.value)}
      className="w-full sm:w-auto px-3 py-2 text-sm border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8]"
    />
    <span className="text-[#6B6F72]">to</span>
    <input
      type="date"
      value={endDate}
      onChange={(e) => onEndDateChange(e.target.value)}
      className="w-full sm:w-auto px-3 py-2 text-sm border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8]"
    />
  </div>
);

const StatusFilter = ({
  selectedStatuses,
  onStatusChange,
}: {
  selectedStatuses: OrderStatus[];
  onStatusChange: (statuses: OrderStatus[]) => void;
}) => {
  const statuses: OrderStatus[] = ["Completed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

  const toggleStatus = (status: OrderStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const active = selectedStatuses.includes(status);
        return (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              active ? "text-white" : "text-[#6B6F72] border border-[#D6DADD] bg-white hover:bg-gray-50"
            }`}
            style={{
              backgroundColor: active ? statusColors[status] : "transparent",
            }}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
};

export default function OrderHistoryPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<PaymentStatus[]>([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const dateMatch = (!start || orderDate >= start) && (!end || orderDate <= end);
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(order.status);
      const paymentMatch = selectedPaymentStatuses.length === 0 || selectedPaymentStatuses.includes(order.payment);
      return dateMatch && statusMatch && paymentMatch;
    });
  }, [startDate, endDate, selectedStatuses, selectedPaymentStatuses]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const completedOrders = filteredOrders.filter((order) => order.status === "Completed").length;
    const pendingPayments = filteredOrders.filter((order) => order.payment === "Pending").length;
    return { totalOrders, totalRevenue, completedOrders, pendingPayments };
  }, [filteredOrders]);

  const columns: Column<Order>[] = [
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
      render: (value) => <span className="text-[#1192E8] font-medium text-[14px]">{value}</span>,
    },
    {
      key: "items",
      label: "Items",
      sortable: false,
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-lg">
            {order.items[0]?.image}
          </div>
          <div>
            <p className="text-[#21272A] text-sm font-medium">{order.items[0]?.name}</p>
            {order.items.length > 1 && <p className="text-xs text-[#6B6F72]">+{order.items.length - 1} more</p>}
          </div>
        </div>
      ),
      width: "220px",
    },
    {
      key: "user",
      label: "Customer",
      sortable: true,
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
            {order.user.avatar || order.user.name.split(" ").map((part) => part[0]).join("")}
          </div>
          <span className="text-[#1192E8] text-sm">{order.user.name}</span>
        </div>
      ),
    },
    {
      key: "seller",
      label: "Seller",
      sortable: true,
      render: (_, order) => (
        <div>
          <p className="text-[#1192E8] text-sm font-medium">{order.seller.name}</p>
          <p className="text-xs text-[#6B6F72]">{order.seller.location}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (_, order) => <span className="text-[#21272A] font-medium text-sm">€{order.amount.toFixed(2)}</span>,
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) => <span className="text-[#6B6F72] text-sm">{formatDisplayDate(value as string)}</span>,
    },
    {
      key: "payment",
      label: "Payment",
      sortable: true,
      render: (value: PaymentStatus) => (
        <div className="flex items-center gap-2">
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: paymentDotColors[value],
              display: "inline-block",
            }}
          />
          <span className="text-sm font-medium" style={{ color: paymentColors[value] }}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: OrderStatus) => (
        <div className="flex items-center gap-2">
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: statusDotColors[value],
              display: "inline-block",
            }}
          />
          <span className="text-sm font-medium" style={{ color: statusColors[value] }}>
            {value}
          </span>
        </div>
      ),
    },
  ];

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const exportOrders = () => {
    const csvRows = [
      ["Order ID", "Customer", "Seller", "Amount", "Date", "Payment", "Status"],
      ...filteredOrders.map((order) => [
        order.orderId,
        order.user.name,
        order.seller.name,
        order.amount.toFixed(2),
        order.date,
        order.payment,
        order.status,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full font-inter">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-black">Order History</h1>
          <p className="text-sm text-[#6B6F72] mt-1">Orders table, filters, and actions for Dell'Orso Pharmacy.</p>
        </div>
        <button
          type="button"
          onClick={exportOrders}
          className="inline-flex items-center justify-center rounded-xl bg-[#1192E8] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-3xl border border-[#D6DADD] bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Total Orders</p>
          <p className="text-2xl font-semibold text-black">{stats.totalOrders}</p>
        </div>
        <div className="rounded-3xl border border-[#D6DADD] bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Total Revenue</p>
          <p className="text-2xl font-semibold text-black">€{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-[#D6DADD] bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Completed Orders</p>
          <p className="text-2xl font-semibold text-black">{stats.completedOrders}</p>
        </div>
        <div className="rounded-3xl border border-[#D6DADD] bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Pending Payments</p>
          <p className="text-2xl font-semibold text-black">{stats.pendingPayments}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#D6DADD] bg-white p-6 mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 flex-1">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Date Range</p>
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Order Status</p>
              <StatusFilter selectedStatuses={selectedStatuses} onStatusChange={setSelectedStatuses} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B6F72] mb-2">Payment Status</p>
              <div className="flex flex-wrap gap-2">
                {(["Paid", "Pending", "Failed", "Refunded"] as PaymentStatus[]).map((status) => {
                  const active = selectedPaymentStatuses.includes(status);
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedPaymentStatuses((prev) =>
                          prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]
                        );
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        active ? "text-white" : "text-[#6B6F72] border border-[#D6DADD] bg-white hover:bg-gray-50"
                      }`}
                      style={{ backgroundColor: active ? paymentColors[status] : "transparent" }}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {(startDate || endDate || selectedStatuses.length > 0 || selectedPaymentStatuses.length > 0) && (
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSelectedStatuses([]);
                setSelectedPaymentStatuses([]);
              }}
              className="text-sm font-medium text-[#1192E8] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <DataTable<Order>
        columns={columns}
        data={filteredOrders}
        rowKey={(order) => order.orderId}
        searchFields={["orderId"]}
        searchPlaceholder="Search orders..."
        onRowClick={handleViewDetails}
        onBulkAction={(action, selectedIds) => console.log(action, selectedIds)}
        bulkActions={[
          { label: "Mark as Completed", value: "complete", icon: "✅" },
          { label: "Mark as Shipped", value: "ship", icon: "🚚" },
          { label: "Cancel Orders", value: "cancel", icon: "❌", color: "text-red-600" },
          { label: "Export Selected", value: "export", icon: "📊" },
        ]}
        renderBulkActionBar={(selectedCount, onClear) => (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 border-b border-[#D6DADD] bg-[#F8FAFF]">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#21272A]">{selectedCount} order{selectedCount !== 1 ? "s" : ""} selected</span>
              <button
                type="button"
                onClick={() => console.log("Mark completed")}
                className="rounded-full bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
              >
                Mark Completed
              </button>
              <button
                type="button"
                onClick={() => console.log("Mark shipped")}
                className="rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                Mark Shipped
              </button>
              <button
                type="button"
                onClick={() => console.log("Cancel orders")}
                className="rounded-full bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              >
                Cancel Orders
              </button>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="w-9 h-9 rounded-full border border-[#D6DADD] text-[#6B6F72] hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        )}
        renderRowActions={(order) => (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedOrder(order)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#6B6F72]"
            >
              ⋮
            </button>
          </div>
        )}
        customFilter={(order, query) => {
          const q = query.toLowerCase();
          return (
            order.orderId.toLowerCase().includes(q) ||
            order.user.name.toLowerCase().includes(q) ||
            order.user.email.toLowerCase().includes(q) ||
            order.seller.name.toLowerCase().includes(q) ||
            order.items.some((item) => item.name.toLowerCase().includes(q))
          );
        }}
      />

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
