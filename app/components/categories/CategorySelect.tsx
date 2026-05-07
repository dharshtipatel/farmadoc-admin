"use client";

import { useEffect, useRef, useState } from "react";

type SelectOption = {
  label: string;
  value: string;
};

interface CategorySelectProps {
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
}

const ChevronDownIcon = () => (
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
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function CategorySelect({
  value,
  options,
  placeholder,
  onChange,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-[13px] outline-none transition-colors ${
          open ? "border-[#D6DADD]" : "border-[#D6DADD]"
        } ${selectedLabel ? "text-[#21272A]" : "text-[#6B6F72]"}`}
      >
        <span>{selectedLabel || placeholder}</span>
        <span className={`text-[#6B6F72] transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-md border border-[#D6DADD] bg-white mt-1">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex min-h-[48px] w-full items-center px-3 py-1 text-left text-[13px] transition-colors ${
                  isSelected
                    ? "bg-[#F2F4F8] text-[#21272A]"
                    : "text-[#21272A] hover:bg-[#F8FAFC]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
