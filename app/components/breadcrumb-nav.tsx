"use client";

import { usePathname, useSearchParams } from "next/navigation";

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      : null;

  return activeItem;
}
