"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import BreadcrumbNav from "./components/breadcrumb-nav";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
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
  const isAuthPage = pathname === "/" || pathname === "/login";

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

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Topbar title={activeItem} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
