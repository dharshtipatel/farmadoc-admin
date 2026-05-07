"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const yearData = [
  { name: "Jan", queries: 22, count: 92 },
  { name: "Feb", queries: 40, count: 118 },
  { name: "Mar", queries: 62, count: 142 },
  { name: "Apr", queries: 62, count: 144 },
  { name: "May", queries: 44, count: 121 },
  { name: "Jun", queries: 43, count: 126 },
  { name: "Jul", queries: 31, count: 98 },
  { name: "Aug", queries: 32, count: 102 },
  { name: "Sep", queries: 55, count: 155 },
  { name: "Oct", queries: 62, count: 166 },
  { name: "Nov", queries: 62, count: 168 },
  { name: "Dec", queries: 43, count: 119 },
];

const monthData = [
  { name: "W1", queries: 18, count: 48 },
  { name: "W2", queries: 32, count: 76 },
  { name: "W3", queries: 46, count: 101 },
  { name: "W4", queries: 39, count: 84 },
];

const weekData = [
  { name: "Mon", queries: 12, count: 16 },
  { name: "Tue", queries: 18, count: 26 },
  { name: "Wed", queries: 30, count: 41 },
  { name: "Thu", queries: 25, count: 36 },
  { name: "Fri", queries: 38, count: 58 },
  { name: "Sat", queries: 50, count: 73 },
  { name: "Sun", queries: 34, count: 44 },
];

const dailyData = [
  { name: "00", queries: 8, count: 8 },
  { name: "04", queries: 14, count: 15 },
  { name: "08", queries: 32, count: 36 },
  { name: "12", queries: 58, count: 64 },
  { name: "16", queries: 42, count: 46 },
  { name: "20", queries: 28, count: 30 },
  { name: "24", queries: 12, count: 14 },
];

type View = "Year" | "Month" | "Week" | "Daily";

export default function ChatbotQueriesChart() {
  const [view, setView] = useState<View>("Year");

  const getData = () => {
    if (view === "Month") return monthData;
    if (view === "Week") return weekData;
    if (view === "Daily") return dailyData;
    return yearData;
  };

  return (
    <div className="w-full min-w-0 rounded-xl border border-[#D6DADD] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-black">Queries Report</h2>
          <p className="text-[11px] font-medium text-[#6B6F72]">Chatbot usage trend over the time</p>
        </div>

        <div className="flex w-full flex-wrap gap-1 rounded-lg border border-[#D6DADD] bg-white p-1 text-xs sm:w-auto">
          {["Year", "Month", "Week", "Daily"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item as View)}
              className={`rounded-md px-3 py-1.5 transition ${
                view === item ? "bg-[#F7F9FC] text-black" : "text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[260px] min-h-[260px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getData()}>
            <defs>
              <linearGradient id="chatbotQueriesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66B8F8" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#66B8F8" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#EEF2F5" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6F72", fontSize: 11 }}
            />

            <YAxis
              domain={[10, 70]}
              ticks={[10, 20, 30, 40, 50, 60, 70]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6F72", fontSize: 11 }}
              tickFormatter={(value) => `${value}K`}
            />

            <Tooltip
              formatter={(value: any, _name: any, item: any) => {
                if (typeof value === "number") {
                  return [`${item?.payload?.count ?? value}`, "Queries"];
                }
                return ["", "Queries"];
              }}
              labelFormatter={(label) => `${label}`}
            />

            <Area
              type="monotone"
              dataKey="queries"
              stroke="#1192E8"
              strokeWidth={2}
              fill="url(#chatbotQueriesFill)"
              activeDot={{ r: 5, fill: "#1192E8", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
