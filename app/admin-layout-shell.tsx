"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import BreadcrumbNav from "./components/breadcrumb-nav";

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

  const activeMenu =
    menu.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href))
    )?.name || "";

  const activeItem =
    pathname.startsWith("/users/") && pathname !== "/users"
      ? <Suspense fallback={<span className="flex items-center gap-2 text-[12px] font-medium font-inter"><span className="text-[#6B6F72]">Users</span></span>}><BreadcrumbNav /></Suspense>
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
