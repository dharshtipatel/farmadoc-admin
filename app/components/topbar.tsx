"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

const UserIcon = () => (
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
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
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
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Topbar({ title }: { title: ReactNode }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

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
        <div ref={menuRef} className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >

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

        {menuOpen && (
          <div className="absolute right-0 top-[calc(100%+10px)] z-30 min-w-[197px] overflow-hidden rounded-md border border-[#D6DADD] bg-white py-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                router.push("/profile");
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] text-[#6B6F72] transition-colors hover:bg-[#F8FAFC]"
            >
              <UserIcon />
              My Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                router.push("/login");
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] text-[#6B6F72] transition-colors hover:bg-[#F8FAFC]"
            >
              <LogoutIcon />
              Log out
            </button>
          </div>
        )}
        </div>

      </div>
    </div>
  );
}
