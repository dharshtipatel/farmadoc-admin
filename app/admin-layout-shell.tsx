"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";

const menu = [
  { name: "Dashboard", href: "/" },
  { name: "Users", href: "/users" },
  { name: "Sellers", href: "/sellers" },
  { name: "Pharmacies Req", href: "/pharmacy-requests" },
  { name: "Orders", href: "/orders" },
  { name: "Inventory", href: "/inventory" },
  { name: "Services", href: "/services" },
  { name: "Categories", href: "/categories" },
  { name: "Offers & Pricing", href: "/offers" },
  { name: "Transactions", href: "/transactions" },
  { name: "Support Tickets", href: "/tickets" },
  { name: "Settings", href: "/settings" },
];

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeMenu =
    menu.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href))
    )?.name || "";

  const activeItem =
    pathname.startsWith("/users/") && pathname !== "/users"
      ? (
          <span className="flex items-center gap-2 text-[12px] font-medium font-inter">
            <span className="text-[#6B6F72]">Users</span>
            <span className="text-[#A8AAAC]">&gt;</span>
            <span className={searchParams.get("tab") === "order-history" ? "text-[#6B6F72]" : "text-black"}>
              User Details
            </span>
            {searchParams.get("tab") === "order-history" ? (
              <>
                <span className="text-[#A8AAAC]">&gt;</span>
                <span className="text-black">Order History</span>
              </>
            ) : null}
          </span>
        )
      : activeMenu;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar title={activeItem} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
