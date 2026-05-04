"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  orders: number;
};

type SortField = "name" | "orders";
type SortOrder = "asc" | "desc";

const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Product ${i + 1}`,
    orders: 400 + (i % 20),
  }));
};

const BASE_PRODUCTS = generateProducts(10);

const SortIcon = ({ field, sortField, sortOrder }: { field: SortField; sortField: SortField; sortOrder: SortOrder }) => (
  <span className="inline-flex flex-col leading-none opacity-40 ml-auto">
    <span
      style={{ fontSize: "8px" }}
      className={sortField === field && sortOrder === "asc" ? "opacity-100 text-blue-500" : ""}
    >▲</span>
    <span
      style={{ fontSize: "8px" }}
      className={sortField === field && sortOrder === "desc" ? "opacity-100 text-blue-500" : ""}
    >▼</span>
  </span>
);

export default function TopSellingProducts() {
  const [sortField, setSortField] = useState<SortField>("orders");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const products = useMemo(() => {
    return [...BASE_PRODUCTS].sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc"
          ? a.orders - b.orders
          : b.orders - a.orders;
      }
    });
  }, [sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex h-[398px] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#D6DADD]">

      {/* Header — fixed */}
      <div className="flex-shrink-0 border-b border-[#D6DADD] px-4 py-3">
        <h2 className="text-[16px] font-semibold text-black">Top Selling Products</h2>
      </div>

      {/* Table header — fixed */}
      <div className="flex-shrink-0 grid grid-cols-2 items-center border-b border-[#D6DADD] bg-[#F0F6FF] px-4 py-3 text-[14px] font-medium text-[#6B6F72]">

        <button
          onClick={() => handleSort("name")}
          className="flex items-center justify-between w-full select-none"
        >
          <span>Product</span>
          <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
        </button>

        <button
          onClick={() => handleSort("orders")}
          className="flex items-center justify-between w-full select-none"
        >
          <span>Orders</span>
          <SortIcon field="orders" sortField={sortField} sortOrder={sortOrder} />
        </button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-2 items-center border-b border-[#D6DADD] last:border-b-0 px-4 py-3 text-sm hover:bg-blue-50/40 transition-colors"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gray-200 flex-shrink-0" />
              <span className="truncate text-[#6B6F72] font-inter text-[14px]">
                {product.name}
              </span>
            </div>
            <span className="text-right font-medium text-[#21272A] font-inter text-[14px]">
              {product.orders}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
