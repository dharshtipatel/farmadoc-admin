"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menu = [
  { name: "Dashboard", href: "/", image: "/images/Dashboard.svg" },
  { name: "Users", href: "/users", image: "/images/Users.svg" },
  { name: "Sellers", href: "/sellers", image: "/images/Sellers.svg" },
  { name: "Pharmacies Req", href: "/pharmacy-requests", image: "/images/PharmaciesReq.svg", badge: true },
  { name: "Orders", href: "/orders", image: "/images/Orders.svg" },
  { name: "Master Inventory", href: "/inventory", image: "/images/Inventory.svg" },
  { name: "Services Inventory", href: "/services", image: "/images/Services.svg" },
  { name: "Categories", href: "/categories", image: "/images/Categories.svg" },
  { name: "Offers & Pricing", href: "/offers", image: "/images/OffersPricing.svg" },
  { name: "AI Chat Bot", href: "/transactions", image: "/images/Transactions.svg" },
  { name: "Settings", href: "/settings", image: "/images/Settings.svg" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[241px] h-screen bg-[#EBF2FF] flex flex-col">
      
      {/* Logo */}
      <div className="px-5 py-6">
        <Image
          src="/images/Logo.png"
          alt="Logo"
          width={228}
          height={30}
          priority
          className="w-[110px] object-contain sm:w-[228px]"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition
                ${
                  isActive
                    ? "bg-[#1E3862] text-white"
                    : "text-[#1E3862] hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={22}
                  height={22}
                  className={`object-contain ${
                    isActive ? "brightness-0 invert" : ""
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}