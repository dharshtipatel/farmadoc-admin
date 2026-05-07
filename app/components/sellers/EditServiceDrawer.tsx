"use client";

import { useEffect, useState } from "react";
import SelectCategoriesDropdown from "../SelectCategoriesDrawer";

interface BaseService {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: "Active" | "Inactive";
  category?: string;
  duration?: string;
  sellerCount?: number;
  updatedOn?: string;
}

interface EditServiceDrawerProps<TService extends BaseService> {
  service: TService | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: TService) => void;
  mode?: "add" | "edit";
  categories?: string[];
}

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function EditServiceDrawer<TService extends BaseService>({
  service,
  isOpen,
  onClose,
  onSave,
  mode = "edit",
  categories = [],
}: EditServiceDrawerProps<TService>) {
  const [basePrice, setBasePrice] = useState(() => String(service?.price ?? ""));
  const [serviceName, setServiceName] = useState(() => service?.name ?? "");
  const [description, setDescription] = useState(() => service?.description ?? "");
  const [selectedCategory, setSelectedCategory] = useState(() => service?.category ?? "");
  const [duration, setDuration] = useState(() => service?.duration ?? "");
  const [serviceIcon, setServiceIcon] = useState(() => service?.image ?? "");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!service) return null;

  const handleSave = () => {
    onSave({
      ...service,
      name: serviceName.trim(),
      description: description.trim(),
      image: serviceIcon || service.image,
      category: selectedCategory,
      duration,
      price: Number(basePrice) || 0,
    } as TService);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/85 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[880px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[18px] font-semibold font-inter text-black]">
              {mode === "add" ? "Add Service" : "Edit Service"}
            </h2>
            <p className="text-[12px] font-medium font-inter text-[#6B6F72] mt-0.5">
              {mode === "add"
                ? "Create a new service for the master inventory."
                : "Update this service for the master inventory."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B6F72] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <h3 className="text-[18px] font-semibold text-font-inter font-inter mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-inter font-medium text-black">
                  Service Name <span className="text-[#DA1E28]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Service Name"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1E3862] text-[#9A9C9E] placeholder-[#1E3862] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-inter font-medium text-black">
                    Select Category <span className="text-[#DA1E28]">*</span>
                  </label>

                  <div className="relative">
                    <button
                      onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2.5 border border-[#D6DADD] rounded-lg text-[13px] bg-white hover:border-[#1192E8] transition-colors"
                    >
                      <span className={selectedCategory ? "text-[#21272A]" : "text-[#A8AAAC]"}>
                        {selectedCategory || "Select Categories"}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <SelectCategoriesDropdown
                      open={categoryDropdownOpen}
                      categories={categories}
                      selected={selectedCategory ? [selectedCategory] : []}
                      onToggle={(category) => {
                        setSelectedCategory(category);
                        setCategoryDropdownOpen(false);
                      }}
                      showCheckbox={false}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-inter font-medium text-black">
                    Duration <span className="text-[#DA1E28]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-inter font-medium text-black">Description</label>
                <textarea
                  placeholder="Write description here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-inter font-medium text-black">
                  Base Price <span className="text-[#DA1E28]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Base Price"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-font-inter font-inter mb-4">Media</h3>

            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                <span className="text-[14px] font-inter font-medium text-black">Service Icon</span>
                <span className="text-[12px] text-[#6B6F72]">
                  (Upload 1 X 1 PNG/JPG/JPEG, Up to 1MB Max)
                </span>
                </div>

                <label className="w-[140px] h-[100px] border border-dashed border-[#D6DADD] rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#1192E8] transition-colors overflow-hidden">
                  <input
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setServiceIcon(URL.createObjectURL(file));
                      }
                    }}
                  />

                  {serviceIcon &&
                  (serviceIcon.startsWith("blob:") ||
                    serviceIcon.startsWith("/") ||
                    serviceIcon.startsWith("http")) ? (
                    <img src={serviceIcon} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B6F72"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                      <span className="text-[9px] text-[#6B6F72]">Upload Photo</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#21272A] hover:bg-gray-50 rounded-lg transition-colors border border-[#D6DADD]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#1E3862] hover:bg-[#16305a] rounded-lg transition-colors"
          >
            {mode === "add" ? "Save Service" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
