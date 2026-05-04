import React from "react";
import Image from "next/image";

type StatsCardProps = {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: string;
  showChange?: boolean;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  showChange = true,
}) => {
  return (
    <div className="w-full min-w-0 rounded-xl border border-[#D6DADD] p-4">
      <p className="text-[#6B6F72] text-[12px] font-medium font-inter">{title}</p>

      <div className="mt-2 flex items-center gap-3">
        <div className="rounded-lg bg-blue-150 p-2">
          <span role="img" aria-label="users">
            <Image src={icon} alt="" width={34} height={34} />
          </span>
        </div>

        <h2 className="text-[24px] font-inter font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h2>
      </div>

      {showChange && change ? (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {change}
            </p>

            <p className="text-[#4E616A] font-medium font-inter text-[12px]">
              from last month
            </p>
          </div>

          <span className={`text-lg ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "↗" : "↘"}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default StatsCard;
