"use client";

import { useEffect, useMemo } from "react";
import DataTable, { Column } from "../DataTable";
import { CategoryNode } from "./types";

type CategoryProduct = {
  id: string;
  sku: string;
  product: string;
  image: string;
  category: string;
  group: string;
  navigation: string;
};

interface CategoryProductsDrawerProps {
  open: boolean;
  category: CategoryNode | null;
  categories: CategoryNode[];
  onClose: () => void;
}

const PRODUCT_ROWS: CategoryProduct[] = [
  { id: "1", sku: "1031651562", product: "Solar Labo Prot Crp Spf50+", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=80&q=80", category: "Pain Relief", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "2", sku: "1031651563", product: "Hydra Boost Moisturizer 24h", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=80&q=80", category: "Headache Relief", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "3", sku: "1031651564", product: "Revitalizing Eye Cream", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=80&q=80", category: "Muscle Pain", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "4", sku: "1031651565", product: "Night Repair Serum", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=80&q=80", category: "Joint Pain", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "5", sku: "1031651566", product: "Gentle Exfoliating Scrub", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=80&q=80", category: "Back Pain", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "6", sku: "1031651567", product: "Solar Labo Prot Crp Spf50", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=80&q=80", category: "Post-Surgery", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "7", sku: "1031651568", product: "Hydra Boost Moisturizer 24h", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=80&q=80", category: "Chronic Pain", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "8", sku: "1031651569", product: "Revitalizing Eye Cream", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=80&q=80", category: "Menstrual Cramps", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "9", sku: "1031651570", product: "Night Repair Serum", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=80&q=80", category: "Arthritis Support", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "10", sku: "1031651571", product: "Gentle Exfoliating Scrub", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=80&q=80", category: "Fibromyalgia Relief", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "11", sku: "1031651572", product: "Solar Labo Prot Crp Spf50+", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=80&q=80", category: "Sore Throat", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "12", sku: "1031651573", product: "Hydra Boost Moisturizer 24h", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=80&q=80", category: "Injury Recovery", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "13", sku: "1031651574", product: "Revitalizing Eye Cream", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=80&q=80", category: "Fibromyalgia Relief", group: "Homeopathy", navigation: "Self-Medication" },
  { id: "14", sku: "1031651575", product: "Night Repair Serum", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=80&q=80", category: "Sore Throat", group: "Homeopathy", navigation: "Self-Medication" },
];

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function CategoryProductsDrawer({
  open,
  category,
  categories,
  onClose,
}: CategoryProductsDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const categoryTrail = useMemo(() => {
    if (!category) {
      return { navigation: "", group: "", category: "" };
    }

    if (category.level === 0) {
      return { navigation: category.name, group: "", category: "" };
    }

    if (category.level === 1) {
      const parentNavigation = categories.find((item) => item.id === category.parentId);
      return {
        navigation: parentNavigation?.name ?? "",
        group: category.name,
        category: "",
      };
    }

    const parentGroup = categories.find((item) => item.id === category.parentId);
    const parentNavigation = categories.find((item) => item.id === parentGroup?.parentId);

    return {
      navigation: parentNavigation?.name ?? "",
      group: parentGroup?.name ?? "",
      category: category.name,
    };
  }, [categories, category]);

  const columns: Column<CategoryProduct>[] = [
    {
      key: "sku",
      label: "SKU",
      sortable: false,
      width: "18%",
      render: (value) => <span className="text-[12px] font-medium text-[#1192E8]">{value}</span>,
    },
    {
      key: "product",
      label: "Product",
      sortable: false,
      width: "28%",
      render: (value, row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.image}
            alt={row.product}
            className="h-[44px] w-[44px] rounded-md border border-[#E8EAED] object-cover"
          />
          <span className="text-[12px] font-semibold text-[#21272A]">{value}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: false,
      width: "18%",
      render: (value) => <span className="text-[12px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "group",
      label: "Group",
      sortable: false,
      width: "18%",
      render: (value) => <span className="text-[12px] text-[#6B6F72]">{value}</span>,
    },
    {
      key: "navigation",
      label: "Navigation",
      sortable: false,
      width: "18%",
      render: (value) => <span className="text-[12px] text-[#6B6F72]">{value}</span>,
    },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[880px] flex-col border-l border-[#E8EAED] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[#E8EAED] px-5 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#21272A]">Products List</h2>
            <p className="mt-0.5 text-[11px] text-[#6B6F72]">
              View and manage all products assigned under this
              {categoryTrail.category ? ` Category (${categoryTrail.category})` : ""}
              {categoryTrail.group ? ` Group (${categoryTrail.group})` : ""}
              {categoryTrail.navigation ? ` Navigation (${categoryTrail.navigation})` : ""}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <DataTable<CategoryProduct>
            columns={columns}
            data={PRODUCT_ROWS}
            rowKey={(row) => row.id}
            searchFields={[]}
            hideSearch={true}
            showCheckboxes={false}
            pageSize={14}
            headerBackground="#F7F9FC"
          />
        </div>
      </div>
    </>
  );
}
