"use client";

import { useState } from "react";

type SellerStatus = "Active" | "Inactive" | "Suspended";
type FeatureTag   = "Showroom" | "Pharmacy" | "Service";

interface Filters {
  status: "All" | SellerStatus;
  features: "All" | FeatureTag;
  orderMin: number;
  orderMax: number;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
};

export default function SellerFiltersPanel({ open, onClose, onApply }: Props) {
  const [status,   setStatus]   = useState<"All" | SellerStatus>("All");
  const [features, setFeatures] = useState<"All" | FeatureTag>("All");
  const [orderMin, setOrderMin] = useState(1);
  const [orderMax, setOrderMax] = useState(400);
  const [minInput, setMinInput] = useState("1");
  const [maxInput, setMaxInput] = useState("400");

  if (!open) return null;

  const handleClear = () => {
    setStatus("All");
    setFeatures("All");
    setOrderMin(1);
    setOrderMax(400);
    setMinInput("1");
    setMaxInput("400");
  };

  const handleApply = () => {
    onApply({ status, features, orderMin, orderMax });
    onClose();
  };

  const updateMin = (val: number) => {
    const v = Math.min(val, orderMax - 1);
    setOrderMin(v);
    setMinInput(String(v));
  };

  const updateMax = (val: number) => {
    const v = Math.max(val, orderMin + 1);
    setOrderMax(v);
    setMaxInput(String(v));
  };

  const leftPct  = ((orderMin - 0) / 500) * 100;
  const rightPct = ((orderMax - 0) / 500) * 100;

  return (
    <>
      <style>{`
        .dual-range {
          position: absolute; width: 100%; height: 4px;
          background: transparent; outline: none; border: none;
          -webkit-appearance: none; appearance: none;
          pointer-events: none; top: 50%; transform: translateY(-50%);
        }
        .dual-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #1E3862; cursor: pointer; pointer-events: all;
          border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .dual-range::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: #1E3862; cursor: pointer; pointer-events: all;
          border: 2px solid #fff;
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        className="absolute right-0 top-12 z-50 bg-white border border-[#D6DADD] rounded-2xl shadow-xl w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D6DADD]">
          <h2 className="text-[15px] font-semibold text-[#6B6F72]">Filters</h2>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">

          {/* Status */}
          <div>
            <p className="text-[12px] font-semibold text-[#21272A] mb-2.5">Status</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {(["All", "Active", "Inactive", "Suspended"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#21272A] select-none">
                  <input
                    type="checkbox"
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="w-[15px] h-[15px] cursor-pointer accent-[#1E3862]"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="text-[12px] font-semibold text-[#21272A] mb-2.5">Features</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {(["All", "Showroom", "Pharmacy", "Service"] as const).map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#21272A] select-none">
                  <input
                    type="checkbox"
                    checked={features === f}
                    onChange={() => setFeatures(f)}
                    className="w-[15px] h-[15px] cursor-pointer accent-[#1E3862]"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          {/* Order Range */}
          <div>
            <p className="text-[12px] font-semibold text-[#21272A] mb-3">Order Range</p>
            <div className="relative h-5 flex items-center">
              <div className="absolute w-full h-[4px] bg-[#E0E4EA] rounded-full" />
              <div
                className="absolute h-[4px] bg-[#1E3862] rounded-full"
                style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
              />
              <input type="range" min={0} max={500} value={orderMin}
                onChange={(e) => updateMin(Number(e.target.value))}
                className="dual-range" />
              <input type="range" min={0} max={500} value={orderMax}
                onChange={(e) => updateMax(Number(e.target.value))}
                className="dual-range" />
            </div>
            <div className="flex justify-between text-[12px] text-[#6B6F72] mt-2">
              <span>From <strong className="text-[#21272A] font-semibold">
                {String(orderMin).padStart(2, "0")}
              </strong></span>
              <span>To <strong className="text-[#21272A] font-semibold">{orderMax}</strong></span>
            </div>
          </div>

          <hr className="border-[#E8EAED]" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleClear}
              className="text-[13px] text-[#6B6F72] hover:text-[#21272A] transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 bg-[#1E3862] hover:bg-[#16305a] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}