"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import avatarIcon from "../../../public/avatar.jpg";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IUser } from "@/app/types";

type Props = {
  user: IUser;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: () => void;
};

type NavItem = {
  id: number;
  label: string;
  Icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  adminOnly?: boolean;
  href?: string;
};

const navItems: NavItem[] = [
  { id: 2, label: "Change password", Icon: RiLockPasswordLine },
  { id: 3, label: "Enrolled courses", Icon: SiCoursera },
  {
    id: 6,
    label: "Admin dashboard",
    Icon: MdOutlineAdminPanelSettings,
    adminOnly: true,
    href: "/admin",
  },
];

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const BASE =
  "flex w-full items-center text-left text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none";

const rowClass = (isActive: boolean) =>
  `${BASE} h-11 gap-3 rounded-full px-1.5 ${FOCUS} ${
    isActive
      ? "bg-[#2F4BFF] text-white"
      : "text-[#0B1020]/70 hover:bg-[#0B1020]/5 dark:text-white/70 dark:hover:bg-white/10"
  }`;

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  const avatarSrc = user?.avatar?.url || avatar || avatarIcon;
  const isAdmin = user?.role === "admin";
  const isProfileActive = active === 1;

  return (
    <nav
      aria-label="Account sections"
      className="flex w-full flex-col gap-1 p-2"
    >
      {/* Profile tile */}
      <button
        type="button"
        aria-label="My account"
        title="My account"
        aria-current={isProfileActive ? "true" : undefined}
        onClick={() => setActive(1)}
        className={`${BASE} mb-1 min-h-12 justify-center gap-3 rounded-2xl p-1 800px:justify-start 800px:p-2 ${FOCUS} ${
          isProfileActive
            ? "bg-[#2F4BFF] text-white"
            : "bg-[#0B1020]/5 text-[#0B1020] hover:bg-[#0B1020]/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/10"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 rounded-full bg-[#FFD23F] p-[3px]">
          <Image
            src={avatarSrc}
            alt=""
            width={30}
            height={30}
            className="h-full w-full rounded-full border-2 border-white object-cover"
          />
        </span>
        <span className="hidden min-w-0 flex-col 800px:flex">
          <span className="truncate text-sm font-extrabold tracking-tight">
            {user?.name}
          </span>
          <span
            className={`truncate text-xs font-semibold ${
              isProfileActive
                ? "text-white/70"
                : "text-[#0B1020]/70 dark:text-white/70"
            }`}
          >
            {user?.email}
          </span>
        </span>
      </button>

      {/* Sections */}
      {navItems
        .filter(({ adminOnly }) => !adminOnly || isAdmin)
        .map(({ id, label, Icon, href }) => {
          const isActive = active === id;
          const content = (
            <>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  isActive ? "bg-[#FFD23F] text-[#0B1020]" : ""
                }`}
              >
                <Icon size={18} aria-hidden />
              </span>
              <span className="hidden truncate 800px:block">{label}</span>
            </>
          );

          return href ? (
            <Link
              key={id}
              href={href}
              aria-label={label}
              title={label}
              className={`${rowClass(false)} no-underline`}
            >
              {content}
            </Link>
          ) : (
            <button
              key={id}
              type="button"
              aria-label={label}
              title={label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => setActive(id)}
              className={rowClass(isActive)}
            >
              {content}
            </button>
          );
        })}

      {/* Log out, set apart */}
      <div className="mt-1 border-t border-[#0B1020]/10 pt-2 dark:border-white/10">
        <button
          type="button"
          aria-label="Log out"
          title="Log out"
          onClick={logoutHandler}
          className={rowClass(false)}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
            <AiOutlineLogout size={18} aria-hidden />
          </span>
          <span className="hidden truncate 800px:block">Log out</span>
        </button>
      </div>
    </nav>
  );
};

export default SideBarProfile;
