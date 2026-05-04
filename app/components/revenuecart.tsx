"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

const yearData = [
  { name: "Jan", revenue: 20 },
  { name: "Feb", revenue: 38 },
  { name: "Mar", revenue: 60 },
  { name: "Apr", revenue: 62 },
  { name: "May", revenue: 45 },
  { name: "Jun", revenue: 42 },
  { name: "Jul", revenue: 30 },
  { name: "Aug", revenue: 32 },
  { name: "Sep", revenue: 55 },
  { name: "Oct", revenue: 62 },
  { name: "Nov", revenue: 60 },
  { name: "Dec", revenue: 45 },
];

const monthData = [
  { name: "W1", revenue: 15 },
  { name: "W2", revenue: 25 },
  { name: "W3", revenue: 40 },
  { name: "W4", revenue: 35 },
];

const weekData = [
  { name: "Mon", revenue: 12 },
  { name: "Tue", revenue: 20 },
  { name: "Wed", revenue: 30 },
  { name: "Thu", revenue: 25 },
  { name: "Fri", revenue: 40 },
  { name: "Sat", revenue: 55 },
  { name: "Sun", revenue: 45 },
];

export default function RevenueChart() {
  const [view, setView] = useState<"Year" | "Month" | "Week" | "Daily">("Year");

  const getData = () => {
    if (view === "Month") return monthData;
    if (view === "Week") return weekData;
    return yearData;
  };

  return (
    <div className="w-full min-w-0 rounded-xl border border-[#D6DADD] bg-white p-4 sm:p-5">

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-[16px] font-semibold text-black">
            Revenue Analytics
          </h2>
          <p className="text-xs text-gray-500">
            Monthly order volume and revenue
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex w-full flex-wrap gap-2 rounded-lg bg-gray-100 p-1 text-xs sm:w-auto">

          {["Year", "Month", "Week", "Daily"].map((item) => (
            <button
              key={item}
              onClick={() => setView(item as any)}
              className={`px-3 py-1 rounded-md transition ${
                view === item
                  ? "bg-white text-black"
                  : "text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* Chart */}
      <div className="h-[240px] sm:h-[300px]">
        <ResponsiveContainer>
          <AreaChart data={getData()}>

            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4BB7FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1192E8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
            stroke="#EEF2F5"
            strokeDasharray="3 3"
            vertical={false}
            />

            <XAxis dataKey="name" axisLine={false} tickLine={false} />

            {/* Y-axis 10 → 70 step 10 */}
            <YAxis
              domain={[10, 70]}
              ticks={[10, 20, 30, 40, 50, 60, 70]}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value: number) => [`£${value * 1000}`, "Revenue"]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
