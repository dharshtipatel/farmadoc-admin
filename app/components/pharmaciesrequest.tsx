"use client";

import { useState } from "react";

interface Pharmacy {
  id: number;
  name: string;
  email: string;
}

const pharmacies: Pharmacy[] = [
  { id: 1, name: "Herba Salus Pharamecia", email: "help@herbasalus.com" },
  { id: 2, name: "Green Leaf Apothecary", email: "contact@greenleaf.com" },
  { id: 3, name: "Nature's Bounty Remedies", email: "info@naturesbounty.com" },
  { id: 4, name: "Pure Essence Botanicals", email: "support@pureessence.com" },
  { id: 5, name: "Wholesome Health Solutions", email: "sales@wholesomehealth.com" },
];

export default function PharmaciesRequest() {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = [...pharmacies].sort((a, b) =>
    sortDir === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const toggleSort = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <div className="bg-white rounded-2xl border border-[#D6DADD] overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6DADD]">
        <h2 className="text-[16px] font-semibold font-inter text-black">Pharmacies Request</h2>
        <button className="text-[14px] font-inter text-[#1192E8] hover:text-blue-700 font-medium transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-[#F0F6FF] border-b border-[#D6DADD]">
            <th className="px-5 py-3 text-left w-full">
              <button
                onClick={toggleSort}
                className="flex items-center justify-between w-full text-[12px] font-semibold font-inter text-[#6B6F72] uppercase tracking-wide select-none hover:text-gray-800 transition-colors"
              >
                <span>Pharmacy</span>
                <span className="inline-flex flex-col leading-none opacity-50">
                  <span style={{ fontSize: "8px" }} className={sortDir === "asc" ? "opacity-100 text-blue-500" : ""}>▲</span>
                  <span style={{ fontSize: "8px" }} className={sortDir === "desc" ? "opacity-100 text-blue-500" : ""}>▼</span>
                </span>
              </button>
            </th>
            <th className="px-5 py-3 text-right text-[12px] font-semibold font-inter text-[#6B6F72] uppercase tracking-wide">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((pharmacy, idx) => (
            <tr
              key={pharmacy.id}
              className={`border-b border-[#D6DADD] last:border-b-0 hover:bg-blue-50/40 transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-white"
              }`}
            >
              <td className="px-5 py-3">
                <p className="text-[14px] font-inter font-medium text-[#21272A]">{pharmacy.name}</p>
                <a
                  href={`mailto:${pharmacy.email}`}
                  className="text-[13px] font-inter text-[#1192E8] hover:underline"
                >
                  {pharmacy.email}
                </a>
              </td>
              <td className="px-5 py-3 text-right">
                <button className="inline-flex items-center gap-1 text-[13px] font-inter text-[#6B6F72] hover:text-[#1192E8] transition-colors">
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
