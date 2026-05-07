"use client";

import { useEffect, useState, useRef } from "react";
import SelectCategoriesDropdown from "./SelectCategoriesDrawer";

export interface ProductDrawerValues {
  sku: string;
  productName: string;
  brand: string;
  description: string;
  composition: string;
  category: string;
  photos: (string | null)[];
}

interface AddProductDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  onSave: (product: ProductDrawerValues) => void;
  mode?: "add" | "edit";
  initialProduct?: Partial<ProductDrawerValues> | null;
}

const createInitialFormValues = (
  initialProduct?: Partial<ProductDrawerValues> | null
): ProductDrawerValues => ({
  sku: initialProduct?.sku ?? "",
  productName: initialProduct?.productName ?? "",
  brand: initialProduct?.brand ?? "",
  description: initialProduct?.description ?? "",
  composition: initialProduct?.composition ?? "",
  category: initialProduct?.category ?? "",
  photos: initialProduct?.photos ?? [null, null, null, null, null],
});

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="#A8AAAC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

function InputField({
  label, placeholder, value, onChange, required,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-[#21272A]">
        {label} {required && <span className="text-[#DA1E28]">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
      />
    </div>
  );
}

export default function AddProductDrawer({
  open, onClose, categories, onSave, mode = "add", initialProduct = null,
}: AddProductDrawerProps) {
  const [form, setForm] = useState<ProductDrawerValues>(() => createInitialFormValues(initialProduct));
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const fileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleReset = () => {
    setForm(createInitialFormValues());
    setCategoryDropdownOpen(false);
  };

  const handleClose = () => { handleReset(); onClose(); };

  const handlePhotoUpload = (index: number, file: File) => {
    const url = URL.createObjectURL(file);
    setForm((prev) => {
      const photos = [...prev.photos];
      photos[index] = url;
      return { ...prev, photos };
    });
  };

  const handleSave = () => {
    onSave(form);
    handleClose();
  };

  const selectCategory = (category: string) => {
    setForm((prev) => ({ ...prev, category }));
    setCategoryDropdownOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[880px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[15px] font-bold text-[#21272A]">
              {mode === "edit" ? "Edit Product" : "Add Product"}
            </h2>
            <p className="text-[11px] text-[#6B6F72] mt-0.5">
              {mode === "edit"
                ? "Update the selected master product for the inventory"
                : "Create a new master product for the inventory"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <h3 className="text-[14px] font-bold text-[#21272A] mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="SKU / MINSAN"
                  placeholder="Enter SKU / MINSAN"
                  value={form.sku}
                  onChange={(value) => setForm((prev) => ({ ...prev, sku: value }))}
                  required
                />
                <InputField
                  label="Product Name"
                  placeholder="Enter Product Name"
                  value={form.productName}
                  onChange={(value) => setForm((prev) => ({ ...prev, productName: value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#21272A]">
                    Select Category <span className="text-[#DA1E28]">*</span>
                  </label>
                  <div className="relative" ref={categoryRef}>
                    <button
                      onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2.5 border border-[#D6DADD] rounded-lg text-[13px] bg-white hover:border-[#1192E8] transition-colors"
                    >
                      <span className={form.category ? "text-[#21272A]" : "text-[#A8AAAC]"}>
                        {form.category || "Select Categories"}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-transform duration-200 flex-shrink-0 ${categoryDropdownOpen ? "rotate-180" : ""}`}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>

                    <SelectCategoriesDropdown
                      open={categoryDropdownOpen}
                      categories={categories}
                      selected={form.category ? [form.category] : []}
                      onToggle={selectCategory}
                      showCheckbox={false}
                    />
                  </div>
                </div>

                <InputField
                  label="Brand"
                  placeholder="Enter Brand Name"
                  value={form.brand}
                  onChange={(value) => setForm((prev) => ({ ...prev, brand: value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-[#21272A]">Description</label>
                <textarea
                  placeholder="Write description here.."
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-[#21272A] mb-4">Product Details</h3>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#21272A]">Composition</label>
              <textarea
                placeholder="Write Composition here.."
                value={form.composition}
                onChange={(e) => setForm((prev) => ({ ...prev, composition: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] resize-none"
              />
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-[#21272A] mb-1">Media</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-[#21272A]">Product Images</span>
              <span className="text-[11px] text-[#6B6F72]">
                (Upload 1 X 1 PNG/JPG/JPEG, Up to 05 Files allowed  1MB Max)
              </span>
            </div>
            <div className="flex items-center gap-3">
              {form.photos.map((photo, i) => (
                <div key={i}>
                  <input
                    ref={fileRefs[i]}
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(i, file);
                    }}
                  />
                  <button
                    onClick={() => fileRefs[i].current?.click()}
                    className="w-[140px] h-[100px] border-2 border-dashed border-[#D6DADD] rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#1192E8] hover:bg-blue-50/20 transition-all overflow-hidden"
                  >
                    {photo ? (
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <UploadIcon />
                        <span className="text-[10px] text-[#A8AAAC]">Upload Photo</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#1E3862] hover:bg-[#16305a] rounded-lg transition-colors"
          >
            {mode === "edit" ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>
    </>
  );
}
