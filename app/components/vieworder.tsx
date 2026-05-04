"use client";

import { useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface OrderItem {
  name: string;
  qty: number;
  price: number;
  img: string;
}

interface OrderGroup {
  pharmacy: string;
  items: OrderItem[];
}

interface BillSummary {
  cartTotal: number;
  platformFee: number;
  totalDiscount: number;
  couponDiscount: number;
  paidAmount: number;
  method: string;
}

export interface OrderDetailsData {
  orderId: string;
  date: string;
  status: "Completed" | "Processing" | "Cancelled";
  groups: OrderGroup[];
  bill: BillSummary;
}

const MOCK_ORDER: OrderDetailsData = {
  orderId: "#FMD-24021211",
  date: "Apr 04, 2026",
  status: "Completed",
  groups: [
    {
      pharmacy: "Cedar Creek Pharmacy, Maple Avenue 12, Florence..",
      items: [
        { name: "ColdAway Tablets 24",            qty: 3, price: 45.00, img: "💊" },
        { name: "Flu-Ex Com Foundation Spf15 33",  qty: 2, price: 74.00, img: "🧴" },
      ],
    },
    {
      pharmacy: "Cedar Creek Pharmacy, Maple Avenue 12, Florence..",
      items: [
        { name: "PainRelief Gel 50g", qty: 1, price: 32.00, img: "🧴" },
      ],
    },
    {
      pharmacy: "Cedar Creek Pharmacy, Maple Avenue 12, Florence..",
      items: [
        { name: "Omega-3 Fish Oil 120", qty: 3, price: 40.00, img: "💊" },
      ],
    },
  ],
  bill: {
    cartTotal:      625.00,
    platformFee:     15.00,
    totalDiscount:  240.00,
    couponDiscount:  40.00,
    paidAmount:     360.00,
    method:         "Visa ••••• 4245",
  },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  Completed:  { bg: "#24A148", text: "#fff" },
  Processing: { bg: "#F59E0B", text: "#fff" },
  Cancelled:  { bg: "#DA1E28", text: "#fff" },
};

// ── Icons ────────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="#1192E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
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
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="#1192E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────
type Props = {
  open: boolean;
  onClose: () => void;
  order?: OrderDetailsData;
};

export default function OrderDetailsModal({ open, onClose, order = MOCK_ORDER }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const status = statusStyles[order.status];
  useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
}, [open]);

  return (
    <>
      {/* ── Backdrop ── */}
    {open && (
    <div
        className="fixed inset-0 z-40 bg-black/85"
        onClick={onClose}
    />
    )}

      {/* ── Side Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white border-l border-[#E8EAED] flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "873px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#F0F2F4] flex-shrink-0">
          <div>
            <h2 className="text-[18px] font-semibold text-black font-inter">Order Details</h2>
            <p className="text-[12px] font-inter font-medium text-[#6B6F72] mt-0.5">Order Overview & Details</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mt-0.5"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* Order ID row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#21272A]">Order ID :</span>
              <span className="text-[13px] font-semibold text-[#1192E8]">{order.orderId}</span>
              <button onClick={handleCopy} title={copied ? "Copied!" : "Copy"} className="hover:opacity-70 transition-opacity">
                <CopyIcon />
              </button>
            </div>
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {order.status}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 mb-6 pb-5 border-b border-[#F0F2F4]">
            <CalendarIcon />
            <span className="text-[13px] text-[#6B6F72]">{order.date}</span>
          </div>

          {/* Order Details label */}
          <p className="text-[14px] font-semibold text-[#21272A] mb-4">Product Details :</p>

          {/* Two-column layout */}
          <div className="flex gap-4 items-start ">

            {/* ── Left: Item Groups ── */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {order.groups.map((group, gi) => (
                <div key={gi} className="border border-[#E8EAED] rounded-xl overflow-hidden">
                  {/* Pharmacy header */}
                  <div className="px-4 py-2.5 bg-[#F8FAFF] border-b border-[#E8EAED]">
                    <p className="text-[12px] text-[#6B6F72] font-medium truncate">{group.pharmacy}</p>
                  </div>
                  {/* Items */}
                  <div className="divide-y divide-[#F4F6F8]">
                    {group.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-lg flex-shrink-0">
                          {item.img}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#21272A] truncate">{item.name}</p>
                          <p className="text-[11px] text-[#6B6F72] mt-0.5">X {item.qty}</p>
                        </div>
                        <span className="text-[13px] font-semibold text-[#21272A] flex-shrink-0">
                          €{item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right: Bill Summary ── */}
            <div className="w-[325px] flex-shrink-0 border border-[#E8EAED] rounded-xl overflow-hidden bg-[#F8FAFF]">
              <div className="px-4 py-3 border-b border-[#E8EAED]">
                <p className="text-[13px] font-semibold text-[#21272A]">Bill Summary</p>
              </div>
              <div className="px-4 py-4 flex flex-col gap-3">
                <BillRow label="Cart Total"           value={`€${order.bill.cartTotal.toFixed(2)}`} />
                <BillRow label="Platform Fee"         value={`€${order.bill.platformFee.toFixed(2)}`} />
                <BillRow label="Total Discount"       value={`-€${order.bill.totalDiscount.toFixed(2)}`} valueColor="#DA1E28" />
                <BillRow label="Coupon Code Discount" value={`-€${order.bill.couponDiscount.toFixed(2)}`} valueColor="#DA1E28" />
                <div className="border-t border-[#E8EAED] pt-3">
                  <BillRow label="Paid Amount" value={`€${order.bill.paidAmount.toFixed(2)}`} bold />
                </div>
                <div className="border-t border-[#E8EAED] pt-3">
                  <BillRow label="Method" value={order.bill.method} valueColor="#6B6F72" small />
                </div>
              </div>
            </div>

          </div>
          <div className="border-t mt-4 border-[#E8EAED]" />
          {/* Reason for Cancellation — only for Cancelled */}
          {order.status === "Cancelled" && (
            <div className="mt-6 mb-4">
              <p className="text-[13px] font-semibold text-[#21272A] mb-1">Reason For Cancellations:</p>
              <p className="text-[13px] text-[#6B6F72]">User not arrived to pickup the order</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-6">
            

            {/* Cancel Order — only for Processing */}
            {order.status === "Processing" && (
              <button className="flex items-center border border-[#FECACA] rounded-md px-4 py-3 gap-1.5 text-[13px] font-medium text-[#DA1E28] hover:bg-red-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#DA1E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Cancel Order
              </button>
            )}
            {/* Download Invoice — always shown */}
            <button className="flex items-center border border-[#EEF2F5] rounded-md px-4 py-3 gap-1.5 text-[13px] font-medium text-[#1192E8] hover:bg-blue-50 transition-colors">
              <DownloadIcon />
              Download Invoice
            </button>
          </div>
          

        </div>
      </div>
    </>
  );
}

// ── Bill Row ─────────────────────────────────────────────────────────────────
function BillRow({
  label,
  value,
  valueColor = "#21272A",
  bold = false,
  small = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
  small?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={`${small ? "text-[11px]" : "text-[12px]"} text-[#6B6F72]`}>{label}</span>
      <span
        className={`${small ? "text-[11px]" : "text-[12px]"} ${bold ? "font-bold" : "font-medium"} text-right`}
        style={{ color: valueColor }}
      >
        {value}
      </span>
    </div>
  );
}