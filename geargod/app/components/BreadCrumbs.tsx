"use client";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Define friendly names for route segments
const routeNames: Record<string, string> = {
  shop: "Shop",
  product: "Product",
  cart: "Cart",
  checkout: "Checkout",
  category: "Category",
  admin: "Admin Dashboard",
  products: "Products",
  orders: "Orders",
  users: "Users",
  settings: "Settings",
  new: "Add New",
  edit: "Edit",
};

export default function BreadCrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <div className="w-full px-2 py-2 relative z-10 bg-transparent shadow text-white">
      <Breadcrumbs variant="solid" className="!bg-transparent" classNames={{
        list: "bg-black/60",
      }}>
        <BreadcrumbItem href="/" className="text-gray-300 hover:text-white">
          Home
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          

          const isId = !isNaN(Number(value));
          
          let displayName = routeNames[value.toLowerCase()] || 
                          (isId ? `#${value}` : decodeURIComponent(value));
          
          if (!routeNames[value.toLowerCase()] && !isId) {
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
          }

          return isLast ? (
            <BreadcrumbItem key={to} className="!text-white">
              <span className="!text-white font-medium">{displayName}</span>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem
              key={to}
              as={Link}
              href={to}
              className="text-gray-300 hover:text-white"
            >
              {displayName}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}