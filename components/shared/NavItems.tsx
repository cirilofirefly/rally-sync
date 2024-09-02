'use client';

import { headerLinks } from "@/contants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
  const pathName = usePathname();
  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((headerLink) => {
        const isActive = pathName === headerLink.route
        return (
          <li 
            key={headerLink.route} 
            className={`${
                isActive && 'text-primary-500'} 
                flex-center p-medium-16 whitespace-nowrap`
            }
        >
            <Link href={headerLink.route}>{headerLink.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
