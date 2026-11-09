"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiBookOpen } from "react-icons/fi";
import avatar from "../../../../public/avatar.jpg";
import {
  HomeOutlined,
  PeopleOutline,
  ReceiptOutlined,
  BarChartOutlined,
  MapOutlined,
  Group,
  OndemandVideo,
  VideoCall,
  Web,
  Quiz,
  Wysiwyg,
  Groups,
  ChevronLeft,
  ChevronRight,
  Close,
} from "@mui/icons-material";

import { RootState } from "@/redux/store";

// ── nav structure ────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "Main",
    items: [{ title: "Dashboard", to: "/admin", Icon: HomeOutlined }],
  },
  {
    section: "Data",
    items: [
      { title: "Users", to: "/admin/users", Icon: Groups },
      { title: "Invoices", to: "/admin/Invoices", Icon: ReceiptOutlined },
    ],
  },
  {
    section: "Content",
    items: [
      { title: "Create course", to: "/admin/create-course", Icon: VideoCall },
      { title: "Live courses", to: "/admin/courses", Icon: OndemandVideo },
    ],
  },
  {
    section: "Customization",
    items: [
      { title: "Hero", to: "/admin/hero", Icon: Web },
      { title: "FAQ", to: "/admin/faq", Icon: Quiz },
      { title: "Categories", to: "/admin/categories", Icon: Wysiwyg },
    ],
  },
  {
    section: "Controllers",
    items: [{ title: "Manage team", to: "/admin/team", Icon: PeopleOutline }],
  },
  {
    section: "Analytics",
    items: [
      {
        title: "Courses analytics",
        to: "/admin/courses-analytics",
        Icon: BarChartOutlined,
      },
      {
        title: "Orders analytics",
        to: "/admin/orders-analytics",
        Icon: MapOutlined,
      },
      { title: "Users analytics", to: "/admin/users-analytics", Icon: Group },
    ],
  },
];

const SIDEBAR_W = 256;
const SIDEBAR_W_COLLAPSED = 72;

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

type Props = {
  /** Mobile drawer open state, controlled from parent */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

const AdminSidebar = ({ mobileOpen = false, onMobileClose }: Props) => {
  const { user: dataUser } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const user = dataUser ?? null;

  useEffect(() => setMounted(true), []);

  // Close mobile drawer on route change
  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Mobile drawer: Escape closes it, and the page behind it doesn't scroll
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen, onMobileClose]);

  // Derive active item from current URL: exact match first, then longest prefix
  const allItems = NAV.flatMap((g) => g.items);
  const activeTitle =
    allItems.find((item) => pathname === item.to)?.title ??
    allItems
      .filter((item) => item.to !== "/admin" && pathname?.startsWith(item.to))
      .sort((a, b) => b.to.length - a.to.length)[0]?.title ??
    (pathname === "/admin" || pathname?.startsWith("/admin")
      ? "Dashboard"
      : "");

  // Keep the active item in view when the route changes
  useEffect(() => {
    if (!mounted || !navRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [mounted, activeTitle]);

  if (!mounted) return null;

  const w = isCollapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;

  const sidebarContent = (isMobile: boolean) => {
    const compact = !isMobile && isCollapsed;
    const avatarSize = compact ? 32 : 72;

    return (
      <aside
        className="flex h-full flex-col overflow-hidden border-r border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020]"
        style={{ width: isMobile ? SIDEBAR_W : w }}
      >
        {/* ── Header ── */}
        <div
          className={`flex shrink-0 items-center border-b border-[#0B1020]/10 p-3 dark:border-white/10 ${
            compact ? "flex-col gap-3" : "justify-between"
          }`}
        >
          <Link
            href="/"
            aria-label="ELearning home"
            className={`group flex items-center gap-2.5 rounded-full ${FOCUS}`}
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2F4BFF] text-white transition-transform duration-150 group-hover:-rotate-6 motion-reduce:transition-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 4 2.5 9 12 14l7.5-4v5.5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 12v4.2c0 1 2.5 2.3 5.5 2.3s5.5-1.3 5.5-2.3V12"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#FFD23F] ring-2 ring-white dark:ring-[#0B1020]" />
            </span>
            {!compact && (
              <span className="whitespace-nowrap pr-1 text-lg font-black tracking-tight text-[#0B1020] dark:text-white">
                ELearning
              </span>
            )}
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFD23F] text-[#0B1020] ${FOCUS}`}
            >
              <Close style={{ fontSize: 20 }} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed((v) => !v)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#0B1020]/10 text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 ${FOCUS}`}
            >
              {isCollapsed ? (
                <ChevronRight style={{ fontSize: 20 }} />
              ) : (
                <ChevronLeft style={{ fontSize: 20 }} />
              )}
            </button>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="flex shrink-0 flex-col items-center overflow-hidden border-b border-[#0B1020]/10 px-4 py-4 dark:border-white/10">
          <div className="shrink-0 rounded-full bg-[#FFD23F] p-[3px]">
            <Image
              src={
                user?.avatar?.url ||
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={
                user?.name ? `${user.name}'s profile photo` : "Profile photo"
              }
              width={avatarSize}
              height={avatarSize}
              className="block rounded-full border-2 border-white object-cover dark:border-[#0B1020]"
            />
          </div>
          {!compact && (
            <>
              <p className="mt-2.5 max-w-[190px] truncate text-sm font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs font-semibold text-[#0B1020]/70 first-letter:uppercase dark:text-white/70">
                {user?.role}
              </p>
            </>
          )}
        </div>

        {/* ── Nav ── */}
        <nav
          ref={isMobile ? undefined : navRef}
          aria-label="Admin"
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6 pt-2 [scrollbar-width:thin]"
        >
          {NAV.map((group, gi) => (
            <div key={group.section}>
              {compact ? (
                gi > 0 && (
                  <div className="mx-2 my-2 h-px bg-[#0B1020]/10 dark:bg-white/10" />
                )
              ) : (
                <p className="px-3 pb-1.5 pt-4 text-xs font-bold text-[#0B1020]/70 dark:text-white/70">
                  {group.section}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map(({ title, to, Icon }) => {
                  const isActive = activeTitle === title;
                  return (
                    <Link
                      key={title}
                      href={to}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={compact ? title : undefined}
                      className={`group relative flex h-11 items-center gap-3 rounded-full text-sm font-bold transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${
                        compact ? "justify-center px-0" : "px-1.5 pr-4"
                      } ${
                        isActive
                          ? "bg-[#2F4BFF] text-white"
                          : "text-[#0B1020]/70 hover:bg-[#0B1020]/5 hover:text-[#0B1020] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          isActive ? "bg-[#FFD23F] text-[#0B1020]" : ""
                        }`}
                      >
                        <Icon style={{ fontSize: 20 }} />
                      </span>
                      {!compact && (
                        <span className="overflow-hidden whitespace-nowrap">
                          {title}
                        </span>
                      )}
                      {compact && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none fixed left-20 z-[200] whitespace-nowrap rounded-full bg-[#0B1020] px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none dark:bg-white dark:text-[#0B1020]"
                        >
                          {title}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    );
  };

  return (
    <>
      {/* ── Desktop sidebar (900px+): fixed, collapse and expand ── */}
      <div
        className="fixed bottom-0 left-0 top-0 z-[100] hidden transition-[width] duration-300 motion-reduce:transition-none min-[900px]:block"
        style={{ width: w }}
      >
        {sidebarContent(false)}
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-[200] min-[900px]:hidden ${
          mobileOpen
            ? "visible"
            : "invisible transition-[visibility] delay-300 duration-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-[#0B1020]/50 transition-opacity duration-300 motion-reduce:transition-none ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onMobileClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
          className={`absolute bottom-0 left-0 top-0 z-10 transition-transform duration-300 ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ width: SIDEBAR_W }}
        >
          {sidebarContent(true)}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
