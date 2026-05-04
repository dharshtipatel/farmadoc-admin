"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ExportDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Button */}
      <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#21272A] border border-[#D6DADD] rounded-lg hover:bg-gray-50 transition-colors bg-white" onClick={() => setOpen((prev) => !prev)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-[180px] bg-white rounded-xl shadow-lg p-4 z-50">
          <p className="text-[12px] font-medium font-inter text-[#4E616A] mb-3">Export as</p>

          <div className="flex flex-col gap-3">
            {/* PDF */}
            <button className="flex items-center gap-3 hover:bg-white p-2 transition">
              <div className="w-8 h-8 flex items-center justify-center bg-white">
                <Image
                    src="/images/pdficon.svg"
                    alt="pdf icon"
                    width={22}
                    height={22}
                    priority
                    className="w-[110px] object-contain sm:w-[228px]"
                />
              </div>
              <span className="text-[14px] text-black font-inter font-medium">PDF</span>
            </button>

            {/* CSV */}
            <button className="flex items-center gap-3 hover:bg-white p-2 transition">
              <div className="w-8 h-8 flex items-center justify-center bg-white">
                <Image
                    src="/images/csvicon.svg"
                    alt="pdf icon"
                    width={22}
                    height={22}
                    priority
                    className="w-[110px] object-contain sm:w-[228px]"
                />
              </div>
              <span className="text-[14px] text-black font-inter font-medium">CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}