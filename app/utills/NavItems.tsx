"use client";
import Link from "next/link";
import React, { FC } from "react";
import { usePathname } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import {
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

export const navItemsData = [
  { name: "Home", url: "/", icon: AiOutlineHome },
  { name: "Courses", url: "/courses", icon: HiOutlineBookOpen },
  { name: "About", url: "/about", icon: HiOutlineUsers },
  { name: "Policy", url: "/policy", icon: HiOutlineDocumentText },
  { name: "FAQ", url: "/faq", icon: HiOutlineQuestionMarkCircle },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
  /** Called after a link is clicked (used to close the mobile menu). */
  onNavigate?: () => void;
};

const NavItems: FC<Props> = ({ isMobile, onNavigate }) => {
  const pathname = usePathname();

  // "/courses/abc" should keep "Courses" active; "/" only matches exactly.
  const isActiveUrl = (url: string) =>
    url === "/" ? pathname === "/" : pathname?.startsWith(url);

  /* ── Desktop: text-only pills, the active one is filled ── */
  if (!isMobile) {
    return (
      <div className="flex items-center gap-0.5">
        {navItemsData.map((item) => {
          const active = isActiveUrl(item.url);
          return (
            <Link
              key={item.url}
              href={item.url}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF] ${
                active
                  ? "bg-[#2F4BFF] text-white"
                  : "text-[#0B1020]/70 hover:bg-[#0B1020]/5 hover:text-[#0B1020] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    );
  }

  /* ── Mobile: big tappable rows inside the menu panel ── */
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {navItemsData.map((item) => {
        const active = isActiveUrl(item.url);
        const Icon = item.icon;
        return (
          <Link
            key={item.url}
            href={item.url}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-4 rounded-2xl px-3 py-2.5 text-base font-bold tracking-tight transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF] ${
              active
                ? "bg-[#2F4BFF] text-white"
                : "text-[#0B1020] hover:bg-[#0B1020]/5 dark:text-white dark:hover:bg-white/10"
            }`}
          >
            <span
              className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl ${
                active
                  ? "bg-[#FFD23F] text-[#0B1020]"
                  : "bg-[#0B1020]/5 text-[#0B1020]/70 dark:bg-white/10 dark:text-white/70"
              }`}
            >
              <Icon size={20} />
            </span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavItems;
