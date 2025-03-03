"use client";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BreadCrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <div className="w-full px-2 py-2 relative z-10 bg-transparent shadow">
      <Breadcrumbs variant="solid" className="!bg-transparent" classNames={{
        list: "bg-black/60 ",
      }}>
        <BreadcrumbItem href="/" className="text-gray-300 hover:text-white">
          Home
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <BreadcrumbItem key={to} className="text-gray-400">
              {decodeURIComponent(value)}
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem
              key={to}
              as={Link}
              href={to}
              className="text-gray-300 hover:text-white"
            >
              {decodeURIComponent(value)}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
