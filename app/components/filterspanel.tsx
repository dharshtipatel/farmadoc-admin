"use client";

import { useEffect, useRef, useState } from "react";

type StatusOption = "All" | "Active" | "Suspended";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: {
    status: StatusOption;
    spentMin: number;
    spentMax: number;
    orderMin: number;
    orderMax: number;
  }) => void;
};

function DualRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  prefix = "",
  padStart = false,
  onChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  prefix?: string;
  padStart?: boolean;
  onChange: (min: number, max: number) => void;
}) {
  const leftPct = ((valueMin - min) / (max - min)) * 100;
  const rightPct = ((valueMax - min) / (max - min)) * 100;

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), valueMax - 1);
    onChange(val, valueMax);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), valueMin + 1);
    onChange(valueMin, val);
  };

  const fmt = (v: number) =>
    padStart ? String(v).padStart(2, "0") : `${prefix}${v}`;

  return (
    <div>
      <div className="relative flex h-5 items-center">
        <div className="absolute h-[4px] w-full rounded-full bg-[#E0E4EA]" />
        <div
          className="absolute h-[4px] rounded-full bg-[#1E3862]"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={handleMin}
          className="dual-range-input"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={handleMax}
          className="dual-range-input"
        />
      </div>

      <div className="mt-2 flex justify-between text-[12px] text-[#6B6F72]">
        <span>
          From <strong className="font-semibold text-[#21272A]">{fmt(valueMin)}</strong>
        </span>
        <span>
          To <strong className="font-semibold text-[#21272A]">{fmt(valueMax)}</strong>
        </span>
      </div>
    </div>
  );
}

export default function FiltersModal({ open, onClose, onApply }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<StatusOption>("All");
  const [spentMin, setSpentMin] = useState(110);
  const [spentMax, setSpentMax] = useState(880);
  const [orderMin, setOrderMin] = useState(1);
  const [orderMax, setOrderMax] = useState(400);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const handleClear = () => {
    setStatus("All");
    setSpentMin(110);
    setSpentMax(880);
    setOrderMin(1);
    setOrderMax(400);
  };

  const handleApply = () => {
    onApply?.({ status, spentMin, spentMax, orderMin, orderMax });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        .dual-range-input {
          position: absolute;
          width: 100%;
          height: 4px;
          background: transparent;
          outline: none;
          border: none;
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
          top: 50%;
          transform: translateY(-50%);
        }
        .dual-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1E3862;
          cursor: pointer;
          pointer-events: all;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        .dual-range-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1E3862;
          cursor: pointer;
          pointer-events: all;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div
        ref={panelRef}
        className="absolute right-0 top-full z-50 mt-2 w-[460px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#D6DADD] bg-white shadow-xl"
      >
        <div className="border-b border-[#E8EAED] px-5 py-4">
          <h2 className="text-[16px] font-semibold text-[#21272A]">Filters</h2>
        </div>

        <div className="flex flex-col gap-6 px-5 py-5">
          <div>
            <p className="mb-3 text-[13px] font-medium text-[#21272A]">Status</p>
            <div className="flex flex-wrap gap-4 sm:gap-7">
              {(["All", "Active", "Suspended"] as StatusOption[]).map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer select-none items-center gap-2 text-[14px] text-black font-medium font-inter"
                >
                  <input
                    type="checkbox"
                    checked={status === item}
                    onChange={() => setStatus(item)}
                    className="h-4 w-4 cursor-pointer rounded accent-[#1E3862]"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[13px] font-medium text-[#21272A]">Spent Range</p>
            <DualRangeSlider
              min={0}
              max={1000}
              valueMin={spentMin}
              valueMax={spentMax}
              prefix="EUR "
              onChange={(mn, mx) => {
                setSpentMin(mn);
                setSpentMax(mx);
              }}
            />
          </div>

          <div>
            <p className="mb-3 text-[13px] font-medium text-[#21272A]">Order Range</p>
            <DualRangeSlider
              min={0}
              max={500}
              valueMin={orderMin}
              valueMax={orderMax}
              padStart
              onChange={(mn, mx) => {
                setOrderMin(mn);
                setOrderMax(mx);
              }}
            />
          </div>

          <hr className="border-[#E8EAED]" />

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleClear}
              className="text-[13px] text-[#6B6F72] transition-colors hover:text-[#21272A]"
            >
              Clear all
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-[#1E3862] px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#16305a]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
