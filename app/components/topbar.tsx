"use client";

import Image from "next/image";
import type { ReactNode } from "react";

export default function Topbar({ title }: { title: ReactNode }) {
  return (
    <div className="w-full h-[76px] flex items-center justify-between bg-white px-8 py-3">
      
      {/* Left Title (DYNAMIC) */}
      <div>
        <p className="text-[12px] font-inter font-medium text-[#000000]">
          {title}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">

        {/* Quick Actions Button */}
        <button className="flex items-center gap-2 bg-[#1192E8] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition">
          <span className="text-lg">+</span>
          Quick Actions
        </button>

        {/* Notification */}
        <div className="flex items-center gap-3">

          <div className="relative cursor-pointer border border-[#D6DADD] p-2 rounded-md">
            <Image
              src="/images/notificationicon.png"
              alt="Notifications"
              width={22}
              height={22}
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

        </div>

        <div className="w-px h-10 bg-gray-300"></div>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer">

          <Image
            src="/images/user.jpg"
            alt="User"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />

          <div className="leading-tight">

            <div className="flex items-center gap-4">
              <span className="text-[14px] font-inter font-medium text-black">
                Marco Fiorani
              </span>

              <span className="text-gray-500 text-xs leading-none">
                <Image
                  src="/images/arrow.png"
                  alt="arrow"
                  width={22}
                  height={22}
                />
              </span>
            </div>

            <p className="text-[12px] font-inter font-medium text-[#6B6F72]">
              example@email.com
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
