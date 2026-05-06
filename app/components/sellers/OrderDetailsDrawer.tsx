"use client";

import { useEffect } from "react";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
type OrderStatus = "Completed" | "Processing" | "Cancelled" | "Shipped" | "Delivered" | "Returned";

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

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder?: (orderId: string) => void;
}

const statusConfig: Record<OrderStatus, { text: string; bg: string }> = {
  Completed:  { text: "#fff",     bg: "#24A148" },
  Processing: { text: "#fff",     bg: "#F59E0B" },
  Shipped:    { text: "#fff",     bg: "#0F62FE" },
  Delivered:  { text: "#fff",     bg: "#198038" },
  Cancelled:  { text: "#fff",     bg: "#DA1E28" },
  Returned:   { text: "#fff",     bg: "#FF832B" },
};

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="#1192E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="#1192E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

function formatOrderDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function BillRow({
  label, value, isDiscount, isBold, isDashed,
}: {
  label: string; value: string; isDiscount?: boolean; isBold?: boolean; isDashed?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${isDashed ? "border-b border-dashed border-[#E5E7EB]" : ""}`}>
      <span className={`text-[14px] ${isBold ? "font-bold text-[#1E3862]" : "text-[#6B6F72]"}`}>
        {label}
      </span>
      <span className={`text-[14px] ${isBold ? "font-bold text-[#1E3862]" : isDiscount ? "font-medium text-[#1E3862]" : "font-medium text-[#1E3862]"}`}>
        {value}
      </span>
    </div>
  );
}

export default function OrderDetailsDrawer({ order, isOpen, onClose, onCancelOrder }: OrderDetailsDrawerProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!order) return null;

  const isCancelled = order.status === "Cancelled";
  const isCompleted = order.status === "Completed" || order.status === "Delivered";

  const formattedDate = formatOrderDate(order.date);

  // Bill values
  const cartTotal      = 625.00;
  const platformFee    = 15.00;
  const totalDiscount  = 240.00;
  const couponDiscount = 40.00;
  const paidAmount     = order.amount;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/85 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[873px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[15px] font-bold text-[#21272A]">Order Details</h2>
            <p className="text-[11px] text-[#6B6F72] mt-0.5">Order Overview & Details</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors mt-0.5"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Order ID + status + date */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] text-[#21272A]">Order ID :</span>
                <span className="text-[13px] font-semibold text-[#1192E8]">{order.orderId}</span>
                <button onClick={() => navigator.clipboard.writeText(order.orderId)}>
                  <CopyIcon />
                </button>
              </div>
              <span
                className="px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{ color: statusConfig[order.status].text, backgroundColor: statusConfig[order.status].bg }}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon />
              <span className="text-[12px] text-[#6B6F72]">{formattedDate}</span>
            </div>
          </div>

          {/* ── Order Details ── */}
          <div className="border-t border-[#EEF2F5]">
            <h3 className="text-[13px] font-bold text-[#21272A] mt-2 mb-3">Product Details :</h3>

            <div className="flex gap-3">
              {/* Items list */}
              <div className="flex-1 border border-[#E5E7EB] rounded-xl">
                <p className="text-[14px] text-[#1E3862] leading-snug p-3 bg-[#EDF2FB] rounded-t-xl">
                  {order.seller.name}, {order.seller.location}...
                </p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 p-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-lg flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#1E3862] font-medium font-inter leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#6B6F72]">x {item.quantity}</p>
                    </div>
                    <span className="text-[14px] font-inter font-medium text-[#1E3862] flex-shrink-0">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Summary */}
              <div className="w-[325px] flex-shrink-0 border border-[#1E3862] bg-[#EDF2FB] rounded-xl p-3">
                <h4 className="text-[18px] font-semibold font-inter text-[#1E3862] mb-1">Bill Summary</h4>
                <BillRow label="Cart Total" value={`€${cartTotal.toFixed(2)}`} isDashed />
                <BillRow label="Platform Fee" value={`€${platformFee.toFixed(2)}`} isDashed />
                <BillRow label="Total Discount" value={`-€${totalDiscount.toFixed(2)}`} isDiscount isDashed />
                <BillRow label="Coupon Code Discount" value={`-€${couponDiscount.toFixed(2)}`} isDiscount isDashed />
                <BillRow label="Paid Amount" value={`€${paidAmount.toFixed(2)}`} isBold isDashed />
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#6B6F72]">Method</span>
                  <span className="text-[11px] font-medium text-[#21272A]">
                    {order.paymentMethod.includes("Credit") ? "Visa ••••• 4245" : order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Customer Details ── */}
          <div className="border-t border-b mb-2 border-[#EEF2F5]">
            <h3 className="text-[13px] font-bold text-[#21272A] mb-3 mt-2">Customer Details :</h3>
            <div className="flex items-center gap-70">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#1E3862] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                {order.user.avatar ?? order.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                <p className="text-[13px] font-semibold text-[#21272A]">{order.user.name}</p>
                <a href={`mailto:${order.user.email}`} className="text-[11px] text-[#1192E8] hover:underline block">
                    {order.user.email}
                </a>
                </div>
            </div>
            <div>
                <p className="text-[11px] text-[#6B6F72]">Phone</p>
                <p className="text-[12px] font-semibold text-[#1192E8]">{order.user.phone}</p>
            </div>
            </div>
          </div>

          {/* Reason for Cancellation */}
          {isCancelled && order.notes && (
            <div className="border-b border-[#EEF2F5]">
              <h3 className="text-[13px] font-bold text-[#21272A] mb-1.5">Reason For Cancellation:</h3>
              <p className="text-[12px] text-[#6B6F72] leading-relaxed mb-2">{order.notes}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
                onClick={() => console.log("Download invoice", order.orderId)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-[#1192E8] border border-[#EEF2F5] rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors"
            >
                <DownloadIcon />
                Download Invoice
            </button>

            {!isCancelled && !isCompleted && onCancelOrder && (
                <button
                    onClick={() => onCancelOrder(order.orderId)}
                    className="flex items-center gap-1.5 text-[13px] font-semibold text-[#D62828] border border-[#EEF2F5] rounded-lg px-4 py-2 hover:bg-red-50 transition-colors"
                    >
                    ✕ Cancel Order
                </button>
            )}
            </div>
        </div>
      </div>
    </>
  );
}