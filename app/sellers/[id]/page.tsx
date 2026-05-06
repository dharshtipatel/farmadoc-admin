"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import StatsCard from "../../components/statscard";
import DataTable, { Column } from "../../components/DataTable";
import OrderDetailsDrawer from "../../components/sellers/OrderDetailsDrawer";
import CancelOrderModal from "../../components/cancelorder";
import ProductsTabComponent from "../../components/sellers/ProductsTab";
import ServicesTabComponent from "../../components/sellers/ServicesTab";

type SellerTab = "overview" | "order-history" | "products" | "services" | "offers";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
type OrderStatus = "Completed" | "Processing" | "Delivered" | "Cancelled" | "Returned";

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

type SellerRecord = {
  id: number;
  name: string;
  shortName: string;
  email: string;
  phone: string;
  whatsapp: string;
  createdOn: string;
  status: "Active" | "Inactive" | "Suspended";
  location: string;
  isPremium: boolean;
  joinedOn: string;
  orders: number;
  revenue: string;
  totalProducts: number;
  services: number;
  activeOffers: number;
  features: string[];
  paymentMethods: string[];
  loyaltyCardsAccepted: boolean;
  workingHours: Record<string, string>;
};

const SELLERS_DATA: Record<number, SellerRecord> = {
  1: {
    id: 1,
    name: "Dell'Orso Pharmacy, Milan",
    shortName: "Dell'Orso Pharmacy",
    email: "email@example.com",
    phone: "+39 1321 65456",
    whatsapp: "05-12-2023",
    createdOn: "05-12-2023",
    status: "Active",
    location: "Bear Street, 1, Milan, ME,20121",
    isPremium: true,
    joinedOn: "24-04-2026",
    orders: 172,
    revenue: "€75,256.00",
    totalProducts: 201,
    services: 8,
    activeOffers: 12,
    features: ["Showroom", "Service", "Pharmacy"],
    paymentMethods: ["Credit / Debit Cards", "Cash", "Digital Wallets", "Online Payment"],
    loyaltyCardsAccepted: true,
    workingHours: {
      Mon: "09:00 AM - 01:00 PM",
      Tue: "09:00 AM - 01:00 PM",
      Wed: "09:00 AM - 01:00 PM",
      Thu: "09:00 AM - 01:00 PM",
      Fri: "09:00 AM - 01:00 PM",
      Sat: "Closed",
      Sun: "Closed",
    },
  },
  2: {
    id: 2,
    name: "Health Hub, Milan",
    shortName: "Health Hub",
    email: "hospital@city.com",
    phone: "+39 234 5678901",
    whatsapp: "05-12-2023",
    createdOn: "05-12-2023",
    status: "Inactive",
    location: "Piazza della Repubblica, 12, Milano, 20124",
    isPremium: true,
    joinedOn: "25-04-2026",
    orders: 25,
    revenue: "€12,500.00",
    totalProducts: 80,
    services: 4,
    activeOffers: 3,
    features: ["Showroom"],
    paymentMethods: ["Credit / Debit Cards", "Cash"],
    loyaltyCardsAccepted: false,
    workingHours: {
      Mon: "09:00 AM - 06:00 PM",
      Tue: "09:00 AM - 06:00 PM",
      Wed: "09:00 AM - 06:00 PM",
      Thu: "09:00 AM - 06:00 PM",
      Fri: "09:00 AM - 06:00 PM",
      Sat: "Closed",
      Sun: "Closed",
    },
  },
};

const TAB_CONFIG: { key: SellerTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "order-history", label: "Order History" },
  { key: "products", label: "Products" },
  { key: "services", label: "Services" },
  { key: "offers", label: "Offers" },
];

const ICONS = {
  totalOrders: "/images/Orders.svg",
  revenue: "/images/revenue.svg",
  totalProducts: "/images/total_products.svg",
  services: "/images/services.svg",
  activeOffers: "/images/OffersPricing.svg",
};

const paymentColors: Record<PaymentStatus, string> = {
  Paid: "#24A148",
  Pending: "#F1A817",
  Failed: "#DA1E28",
  Refunded: "#8A3FFC"
};

const statusColors: Record<OrderStatus, string> = {
  Completed: "#24A148",
  Processing: "#0F62FE",
  Delivered: "#198038",
  Cancelled: "#DA1E28",
  Returned: "#FF832B"
};

const statusDotColors: Record<OrderStatus, string> = {
  Completed: "#24A148",
  Processing: "#0F62FE",
  Delivered: "#198038",
  Cancelled: "#DA1E28",
  Returned: "#FF832B"
};

const paymentDotColors: Record<PaymentStatus, string> = {
  Paid: "#24A148",
  Pending: "#F1A817",
  Failed: "#DA1E28",
  Refunded: "#8A3FFC"
};

const statusConfig: Record<SellerRecord["status"], { text: string; bg: string; dot: string }> = {
  Active: { text: "#24A148", bg: "#EAFCE0", dot: "#24A148" },
  Inactive: { text: "#6B6F72", bg: "#F0F2F4", dot: "#6B6F72" },
  Suspended: { text: "#DA1E28", bg: "#FFEBEE", dot: "#DA1E28" },
};

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const MoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#21272A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CardPaymentIcon = () => (
  <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
    <rect x="0.5" y="0.5" width="31" height="21" rx="3" fill="#fff" stroke="#D6DADD" />
    <rect x="0" y="5" width="32" height="4" fill="#1F2937" />
    <rect x="3" y="13" width="9" height="2" rx="1" fill="#9CA3AF" />
  </svg>
);

const CashIcon = () => (
  <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
    <rect x="0.5" y="0.5" width="31" height="21" rx="3" fill="#86EFAC" stroke="#22C55E" />
    <circle cx="16" cy="11" r="5" fill="#22C55E" />
    <text x="16" y="14" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">$</text>
  </svg>
);

const WalletIcon = () => (
  <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
    <rect x="0.5" y="0.5" width="31" height="21" rx="3" fill="#FCD34D" stroke="#F59E0B" />
    <rect x="20" y="9" width="8" height="5" rx="1" fill="#1E40AF" />
    <circle cx="25" cy="11.5" r="1.2" fill="#FCD34D" />
  </svg>
);

const OnlinePaymentIcon = () => (
  <svg width="22" height="32" viewBox="0 0 22 32" fill="none">
    <rect x="0.5" y="0.5" width="21" height="31" rx="3" fill="#fff" stroke="#D6DADD" />
    <rect x="3" y="3" width="16" height="20" rx="1" fill="#E5E7EB" />
    <circle cx="11" cy="27" r="1.5" fill="#9CA3AF" />
    <path d="M7 11l3 3 5-5" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[41px] w-[41px] flex-shrink-0 items-center justify-center rounded-full bg-[#F0F6FF]">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-[#6B6F72]">{label}</span>
        <p className="text-[13px] font-medium text-[#21272A]">{value}</p>
      </div>
    </div>
  );
}

function PaymentCard({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="min-w-[206px] rounded-lg border border-[#E5E7EB] px-3 py-2.5">
      <div className="flex flex-col items-start gap-2">
        {icon}
        <span className="text-[12px] font-medium text-[#6B6F72]">{label}</span>
      </div>
    </div>
  );
}

function EmptyTabState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
      <h3 className="text-[16px] font-semibold text-[#21272A]">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-[#6B6F72]">{description}</p>
    </div>
  );
}

function OverviewTab({
  seller,
  paymentIcons,
}: {
  seller: SellerRecord;
  paymentIcons: Record<string, React.ReactNode>;
}) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatsCard title="Total Orders" value={seller.orders} icon={ICONS.totalOrders} showChange={false} />
        <StatsCard title="Revenue" value={seller.revenue} icon={ICONS.revenue} showChange={false} />
        <StatsCard title="Total Products" value={seller.totalProducts} icon={ICONS.totalProducts} showChange={false} />
        <StatsCard title="Services" value={String(seller.services).padStart(2, "0")} icon={ICONS.services} showChange={false} />
        <StatsCard title="Active Offers" value={seller.activeOffers} icon={ICONS.activeOffers} showChange={false} />
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-[120px] w-[240px] shrink-0 items-center justify-center rounded-lg bg-[#0F4C3A]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#86EFAC">
                  <path d="M12 2C6 8 6 14 12 22C18 14 18 8 12 2Z" />
                </svg>
                <span className="text-[15px] font-bold text-white">
                  HERB<span className="text-[#86EFAC]">PILL</span>
                </span>
              </div>
              <p className="mt-0.5 text-[8px] tracking-widest text-[#86EFAC]">SUGAR COSTUMER</p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="mb-1.5 text-[18px] font-semibold text-[#1E3862]">{seller.name}</h2>
            <div className="mb-2 flex items-center gap-1.5">
              <LocationIcon />
              <span className="text-[14px] font-medium text-[#1192E8]">{seller.location}</span>
            </div>
            <div className="flex items-center gap-3">
              {seller.features.map((feature) => (
                <span key={feature} className="rounded-xl bg-[#F4FBFF] p-2 text-[12px] font-medium text-[#3B82F6]">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ color: statusConfig[seller.status].text, backgroundColor: statusConfig[seller.status].bg }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusConfig[seller.status].dot }} />
              {seller.status}
            </span>
            {seller.isPremium && (
              <span className="flex items-center gap-1 rounded-full bg-[#FFF8E1] px-2.5 py-1 text-[11px] font-medium text-[#F59E0B]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFF8E6">
                  <path d="M12 2 15 9l7 .8-5.5 4.7L18 22l-6-3.5L6 22l1.5-7.5L2 9.8 9 9z" />
                </svg>
                Premium
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-5 md:grid-cols-4">
          <InfoRow icon={<EmailIcon />} label="Email" value={seller.email} />
          <InfoRow icon={<PhoneIcon />} label="Phone Number" value={seller.phone} />
          <InfoRow icon={<WhatsAppIcon />} label="WhatsApp" value={seller.whatsapp} />
          <InfoRow icon={<CalendarIcon />} label="Created on" value={seller.createdOn} />
        </div>

        <div className="pt-5">
          <h3 className="mb-3 text-[14px] font-semibold text-[#21272A]">Payment Methods</h3>
          <div className="flex flex-wrap gap-3">
            {seller.paymentMethods.map((method) => (
              <PaymentCard key={method} label={method} icon={paymentIcons[method]} />
            ))}
          </div>
        </div>

        <div className="mt-5 pt-5">
          <h3 className="mb-2 text-[14px] font-semibold text-[#21272A]">Loyalty Cards</h3>
          <p className="text-[12px] leading-relaxed text-[#6B6F72]">
            {seller.loyaltyCardsAccepted
              ? "Yes, this pharmacy accepts loyalty cards."
              : "No, this pharmacy does not accept loyalty cards."}
            <br />
            Eligible offers and discounts can be applied at the time of pickup, subject to pharmacy terms.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] p-5">
        <div className="mb-4 flex items-center gap-2">
          <ClockIcon />
          <h3 className="text-[14px] font-semibold text-[#21272A]">Working Hours</h3>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
          {days.slice(0, 4).map((day) => (
            <div key={day} className="flex items-center gap-4 text-[13px]">
              <span className="w-10 font-medium text-[#21272A]">{day}:</span>
              <span className="text-[#6B6F72]">{seller.workingHours[day]}</span>
            </div>
          ))}
          {days.slice(4).map((day) => (
            <div key={day} className="flex items-center gap-4 text-[13px]">
              <span className="w-10 font-medium text-[#21272A]">{day}:</span>
              <span className="text-[#6B6F72]">{seller.workingHours[day]}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-0 pt-4">
          {seller.features.includes("Pharmacy") && (
            <>
              <div className="pr-6">
                <span className="text-[13px] font-medium text-[#21272A]">Pharmacy Enable</span>
              </div>
              <div className="mr-6 h-4 w-px bg-[#D6DADD]" />
            </>
          )}

          {seller.features.includes("Showroom") && (
            <>
              <div className="pr-6">
                <span className="text-[13px] font-medium text-[#21272A]">Showroom Enable</span>
              </div>
              <div className="mr-6 h-4 w-px bg-[#D6DADD]" />
            </>
          )}

          {seller.features.includes("Service") && (
            <div>
              <span className="text-[13px] font-medium text-[#21272A]">Service Enable</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderHistoryTab({ seller }: { seller: SellerRecord }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const sellerOrders: Order[] = [
    {
      orderId: "#FD65161516",
      items: [{ id: "1", name: "Solar Labs Prot Crp Spf50+", image: "🧴", quantity: 1, price: 408.80 }],
      user: { name: "Mahavir Singh", email: "mahavir.singh@email.com", phone: "+91 98765 43210", avatar: "MS" },
      seller: { name: seller.shortName, location: seller.location.split(",")[0], rating: 4.8 },
      amount: 408.80, currency: "EUR", date: "2026-04-24", payment: "Paid", status: "Completed",
      paymentMethod: "Credit Card", shippingAddress: "Via Roma 123, Milan, Italy",
      trackingNumber: "TRK123456789", notes: "Handle with care - fragile items",
    },
    {
      orderId: "#FD65161517",
      items: [{ id: "2", name: "Hydra Boost Moisturizer 24h", image: "💧", quantity: 2, price: 256.12 }],
      user: { name: "Anjali Verma", email: "anjali.verma@email.com", phone: "+91 87654 32109", avatar: "AV" },
      seller: { name: seller.shortName, location: seller.location.split(",")[0], rating: 4.6 },
      amount: 512.25, currency: "EUR", date: "2026-04-25", payment: "Pending", status: "Processing",
      paymentMethod: "PayPal", shippingAddress: "Piazza Navona 45, Rome, Italy",
    },
    {
      orderId: "#FD65161518",
      items: [{ id: "3", name: "Revitalizing Eye Cream", image: "👁️", quantity: 1, price: 295.60 }],
      user: { name: "Rajesh Kumar", email: "rajesh.kumar@email.com", phone: "+91 76543 21098", avatar: "RK" },
      seller: { name: seller.shortName, location: seller.location.split(",")[0], rating: 4.9 },
      amount: 295.60, currency: "EUR", date: "2026-04-26", payment: "Paid", status: "Processing",
      paymentMethod: "Bank Transfer", shippingAddress: "Via dei Medici 78, Florence, Italy",
      trackingNumber: "TRK987654321",
    },
    {
      orderId: "#FD65161519",
      items: [{ id: "4", name: "Night Repair Serum", image: "🌙", quantity: 1, price: 740.00 }],
      user: { name: "Sneha Patel", email: "sneha.patel@email.com", phone: "+91 65432 10987", avatar: "SP" },
      seller: { name: seller.shortName, location: seller.location.split(",")[0], rating: 4.7 },
      amount: 740.00, currency: "EUR", date: "2026-04-27", payment: "Paid", status: "Cancelled",
      paymentMethod: "Credit Card", shippingAddress: "Via Garibaldi 89, Turin, Italy",
      notes: "Customer requested cancellation",
    },
    {
      orderId: "#FD65161520",
      items: [{ id: "5", name: "Gentle Exfoliating Scrub", image: "✨", quantity: 3, price: 116.82 }],
      user: { name: "Vikram Sharma", email: "vikram.sharma@email.com", phone: "+91 54321 09876", avatar: "VS" },
      seller: { name: seller.shortName, location: seller.location.split(",")[0], rating: 4.5 },
      amount: 350.45, currency: "EUR", date: "2026-04-28", payment: "Paid", status: "Processing",
      paymentMethod: "Cash on Delivery", shippingAddress: "Via Toledo 234, Naples, Italy",
    },
  ];

  const displayOrders = useMemo(() => {
    return statusFilter === "All"
      ? sellerOrders
      : sellerOrders.filter((o) => o.status === statusFilter);
  }, [statusFilter]);

  const exportOrders = () => {
    const csvContent = [
      ["Order ID", "Customer", "Amount", "Date", "Payment Status", "Order Status"],
      ...displayOrders.map((order) => [
        order.orderId,
        order.user.name,
        order.amount.toString(),
        order.date,
        order.payment,
        order.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${seller.shortName.replace(/\s+/g, "_")}_orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const columns: Column<Order>[] = [
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
      render: (value) => (
        <span className="text-[#1192E8] font-medium font-inter text-[14px] cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    {
      key: "items",
      label: "Items",
      sortable: false,
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <div className="w-[44px] h-[44px] rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-base flex-shrink-0">
            {order.items[0]?.image || "📦"}
          </div>
          <div>
            <span className="text-[#6B6F72] font-inter text-[13px] max-w-[120px] leading-tight block">
              {order.items[0]?.name}
            </span>
            {order.items.length > 1 && (
              <span className="text-xs text-[#A8AAAC]">+{order.items.length - 1} more</span>
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
          <span className="text-[#1192E8] font-inter text-[13px]">{order.user.name}</span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (_, order) => (
        <span className="text-[#6B6F72] font-inter text-[13px] font-medium">
          €{order.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) => (
        <span className="text-[#6B6F72] font-inter text-[13px]">
          {formatDisplayDate(value as string)}
        </span>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      sortable: true,
      render: (value: PaymentStatus) => (
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: paymentDotColors[value] }}
          />
          <span className="font-inter text-[13px] font-medium" style={{ color: paymentColors[value] }}>
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
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusDotColors[value] }}
          />
          <span className="font-inter text-[13px] font-medium" style={{ color: statusColors[value] }}>
            {value}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      <DataTable<Order>
        columns={columns}
        data={displayOrders}
        rowKey={(order) => order.orderId}
        searchPlaceholder="Search here..."
        showCheckboxes={false}
        toolbarRight={
          <div className="flex items-center gap-2">
            {(["All", "Completed", "Processing", "Cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap border ${
                  statusFilter === f
                    ? "border-[#1192E8] text-[#1192E8] bg-white"
                    : "border-[#D6DADD] text-[#6B6F72] bg-white hover:border-[#1192E8] hover:text-[#1192E8]"
                }`}
              >
                {f}
              </button>
            ))}

            {/* Export button */}
            <button
              onClick={exportOrders}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
          </div>
        }
        onRowClick={(order) => handleViewDetails(order)}
        renderRowActions={(order) => (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenu(openMenu === order.orderId ? null : order.orderId)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors text-lg"
            >
              ⋮
            </button>
            {openMenu === order.orderId && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-1.5 min-w-[180px]">

                {/* View Order — always shown */}
                <button
                  onClick={() => { setOpenMenu(null); handleViewDetails(order); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Order
                </button>

                {/* Only show these if status is Processing or Shipped (not Completed/Cancelled) */}
                {order.status !== "Completed" && order.status !== "Cancelled" && (
                  <>
                    <div className="mx-3 border-t border-[#F0F2F4]" />
                    <button
                      onClick={() => { setOpenMenu(null); console.log("Mark completed", order.orderId); }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-[#21272A] hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                        fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      Mark as Completed
                    </button>

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
            order.user.email.toLowerCase().includes(q) ||
            order.items.some((item) => item.name.toLowerCase().includes(q))
          );
        }}
      />

      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedOrder(null); }}
        onCancelOrder={(orderId) => setCancelOrderId(orderId)}
      />

      <CancelOrderModal
        open={cancelOrderId !== null}
        orderId={cancelOrderId ?? ""}
        onClose={() => setCancelOrderId(null)}
        onConfirm={(reasons, note) => {
          console.log("Cancel order", cancelOrderId, reasons, note);
          setCancelOrderId(null);
        }}
      />
    </div>
  );
}

function ProductsTab({ seller }: { seller: SellerRecord }) {
  return <ProductsTabComponent seller={{ shortName: seller.shortName, name: seller.name }} />;
}

function ServicesTab({ seller }: { seller: SellerRecord }) {
  return <ServicesTabComponent seller={{ shortName: seller.shortName, name: seller.name }} />;
}

function OffersTab({ seller }: { seller: SellerRecord }) {
  return (
    <div className="p-5">
      <EmptyTabState
        title="Offers"
        description={`This tab is ready for ${seller.shortName}'s offers, promotions, and pricing rules so it no longer shares the overview content.`}
      />
    </div>
  );
}

export default function SellerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerId = parseInt(params.id as string, 10);
  const seller = SELLERS_DATA[sellerId] || SELLERS_DATA[1];

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeTabParam = searchParams.get("tab");
  const activeTab: SellerTab =
    activeTabParam === "order-history" ||
    activeTabParam === "products" ||
    activeTabParam === "services" ||
    activeTabParam === "offers"
      ? activeTabParam
      : "overview";

  const paymentIcons: Record<string, React.ReactNode> = {
    "Credit / Debit Cards": <CardPaymentIcon />,
    Cash: <CashIcon />,
    "Digital Wallets": <WalletIcon />,
    "Online Payment": <OnlinePaymentIcon />,
  };

  const setActiveTab = (tab: SellerTab) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (tab === "overview") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tab);
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `/sellers/${sellerId}?${nextQuery}` : `/sellers/${sellerId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "order-history":
        return <OrderHistoryTab seller={seller} />;
      case "products":
        return <ProductsTab seller={seller} />;
      case "services":
        return <ServicesTab seller={seller} />;
      case "offers":
        return <OffersTab seller={seller} />;
      default:
        return <OverviewTab seller={seller} paymentIcons={paymentIcons} />;
    }
  };

  return (
    <div className="min-h-screen w-full font-inter">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-[#EDF2FB] p-2 text-[#6B6F72] transition-colors hover:bg-[#F3F4F6] hover:text-black"
            aria-label="Back"
          >
            <BackIcon />
          </button>

          <div className="flex items-center gap-1 rounded-full bg-[#EDF2FB] p-1">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  activeTab === tab.key ? "bg-white text-[#21272A] shadow-sm" : "text-[#6B6F72] hover:text-[#21272A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className="rounded-full p-2 text-[#6B6F72] transition-colors hover:bg-[#F3F4F6]"
            aria-label="More options"
          >
            <MoreIcon />
          </button>

          {moreOpen && (
            <div className="absolute right-0 top-10 z-20 min-w-[190px] rounded-xl border border-[#D6DADD] bg-white py-1.5 shadow-lg">
              <button
                onClick={() => {
                  setMoreOpen(false);
                  console.log("Edit details");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-[#21272A] transition-colors hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Details
              </button>

              <button
                onClick={() => {
                  setMoreOpen(false);
                  console.log("Downgrade");
                }}
                className="flex w-full items-center gap-2.5 whitespace-nowrap px-4 py-2.5 text-left text-[13px] text-[#21272A] transition-colors hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 13 12 18 7 13" />
                  <polyline points="17 6 12 11 7 6" />
                </svg>
                Downgrade to Pharmacy
              </button>

              <button
                onClick={() => {
                  setMoreOpen(false);
                  console.log("Mark inactive");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-[#21272A] transition-colors hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Mark Inactive
              </button>

              <button
                onClick={() => {
                  setMoreOpen(false);
                  console.log("Suspend");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-[#DA1E28] transition-colors hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                Suspend Seller
              </button>
            </div>
          )}
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
}
