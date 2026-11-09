/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { FC, useState, useEffect, useRef } from "react";
import NavItems from "../utills/NavItems";
import { ThemeSwitcher } from "../utills/ThemeSwitcher";
import { MdOutlineMenu, MdPerson, MdClose } from "react-icons/md";
import CustomModel from "../utills/CustomModel";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Verification from "./auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/avatar.jpg";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { RootState } from "@/redux/store";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

/* Palette
   cobalt  #2F4BFF  – brand
   sun     #FFD23F  – the one loud accent (CTA + avatar ring)
   ink     #0B1020  – text / dark surface
*/

const Logo: FC = () => (
  <Link
    href="/"
    className="group flex items-center gap-2.5 flex-shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4BFF]"
    aria-label="ELearning home"
  >
    <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-[#2F4BFF] transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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
      </svg>
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFD23F] ring-2 ring-white dark:ring-[#0B1020]" />
    </span>
    <span className="text-[1.2rem] font-black tracking-tight text-[#0B1020] dark:text-white">
      ELearning
    </span>
  </Link>
);

const Header: FC<Props> = ({ activeItem, setOpen, open, route, setRoute }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);

  const { user: dataUser, isAuthLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const { data: session } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  useLogoutQuery(undefined, { skip: !logout });
  const socialAuthCalled = useRef(false);

  const user = dataUser
    ? typeof dataUser === "string"
      ? JSON.parse(dataUser)
      : dataUser
    : null;

  useEffect(() => {
    // انتظر حتى يكتمل التحقق من الجلسة أولاً
    if (isAuthLoading) return;

    if (session) {
      if (!user && !socialAuthCalled.current) {
        socialAuthCalled.current = true;
        socialAuth({
          name: session.user?.name,
          email: session.user?.email,
          avatar: session.user?.image,
        });
      }
    } else {
      socialAuthCalled.current = false;
    }
  }, [user, session, socialAuth, isAuthLoading]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful");
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data as any;
        toast.error(errorData.message || "Social login failed");
      } else {
        toast.error("Social login failed");
      }
    }
  }, [isSuccess, error, setOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on Escape while the mobile menu is open
  useEffect(() => {
    if (!openSideBar) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSideBar(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSideBar]);

  const avatarSrc =
    user?.avatar?.url ||
    avatar ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // The bar turns solid when scrolled OR when the mobile menu is open
  const solid = scrolled || openSideBar;

  return (
    <>
      {/* Soft backdrop behind the mobile menu */}
      <div
        aria-hidden
        onClick={() => setOpenSideBar(false)}
        className={`lg:hidden fixed inset-0 z-[999] bg-[#0B1020]/35 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
          openSideBar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Floating island navbar ── */}
      <header className="fixed top-0 inset-x-0 z-[1000] px-3 sm:px-6 pt-3 pointer-events-none">
        <div
          className={`relative mx-auto transition-[max-width] duration-300 ease-out motion-reduce:transition-none ${
            scrolled ? "max-w-[960px]" : "max-w-[1180px]"
          }`}
        >
          <div
            className={`pointer-events-auto flex items-center justify-between gap-4 rounded-full border pl-4 pr-3 transition-all duration-300 ease-out motion-reduce:transition-none ${
              scrolled ? "h-14" : "h-[68px]"
            } ${
              solid
                ? "bg-white/90 border-[#0B1020]/10 shadow-[0_10px_30px_-12px_rgba(11,16,32,0.25)] backdrop-blur-md dark:bg-[#0B1020]/90 dark:border-white/10"
                : "bg-white/60 border-[#0B1020]/5 backdrop-blur-sm dark:bg-[#0B1020]/40 dark:border-white/5"
            }`}
          >
            <Logo />

            {/* Desktop nav */}
            <nav
              className="max-lg:hidden flex items-center gap-1"
              aria-label="Main"
            >
              <NavItems activeItem={activeItem} isMobile={false} />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher />

              {user ? (
                <Link
                  href="/profile"
                  aria-label="Open profile"
                  className="rounded-full p-[3px] bg-[#FFD23F] transition-transform duration-200 hover:scale-105 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]"
                >
                  <Image
                    src={avatarSrc}
                    alt="Your avatar"
                    width={34}
                    height={34}
                    className="rounded-full block w-[34px] h-[34px] object-cover border-2 border-white dark:border-[#0B1020]"
                  />
                </Link>
              ) : (
                <button
                  onClick={() => setOpen(true)}
                  className="max-lg:hidden flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#FFD23F] text-[#0B1020] text-sm font-bold border-2 border-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4BFF] dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff]"
                >
                  <MdPerson size={18} />
                  Sign in
                </button>
              )}

              {/* Mobile menu toggle – same spot, icon swaps */}
              <button
                className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-[#2F4BFF] text-white transition-transform duration-150 active:scale-95 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]"
                onClick={() => setOpenSideBar((v) => !v)}
                aria-label={openSideBar ? "Close menu" : "Open menu"}
                aria-expanded={openSideBar}
                aria-controls="mobile-menu"
              >
                {openSideBar ? (
                  <MdClose size={22} />
                ) : (
                  <MdOutlineMenu size={22} />
                )}
              </button>
            </div>
          </div>

          {/* ── Mobile dropdown, attached under the navbar ── */}
          <div
            id="mobile-menu"
            aria-hidden={!openSideBar}
            className={`pointer-events-auto lg:hidden absolute inset-x-0 top-full mt-2 origin-top max-h-[calc(100dvh-110px)] overflow-y-auto rounded-3xl border border-[#0B1020]/10 bg-white p-2 shadow-[0_20px_50px_-15px_rgba(11,16,32,0.35)] dark:border-white/10 dark:bg-[#0B1020] transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
              openSideBar
                ? "visible opacity-100 translate-y-0 scale-100"
                : "invisible opacity-0 -translate-y-2 scale-95"
            }`}
          >
            <NavItems
              activeItem={activeItem}
              isMobile={true}
              onNavigate={() => setOpenSideBar(false)}
            />

            <div className="my-2 h-px bg-[#0B1020]/10 dark:bg-white/10" />

            <div className="p-1">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setOpenSideBar(false)}
                  className="flex items-center gap-3 rounded-2xl bg-[#0B1020]/5 p-2.5 text-[#0B1020] dark:bg-white/10 dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]"
                >
                  <span className="rounded-full p-[3px] bg-[#FFD23F]">
                    <Image
                      src={avatarSrc}
                      alt="Your avatar"
                      width={36}
                      height={36}
                      className="rounded-full block w-9 h-9 object-cover border-2 border-white dark:border-[#0B1020]"
                    />
                  </span>
                  <span className="font-bold truncate">{user?.name}</span>
                  <span className="ml-auto text-sm text-[#0B1020]/60 dark:text-white/60">
                    View profile
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setOpen(true);
                    setOpenSideBar(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-[#FFD23F] text-[#0B1020] font-bold border-2 border-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4BFF] dark:border-white dark:shadow-[3px_3px_0_#fff]"
                >
                  <MdPerson size={20} />
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Modals ── */}
      {open && route === "Login" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          Component={Login}
          setRoute={setRoute}
        />
      )}
      {open && route === "Sign-Up" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          Component={SignUp}
          setRoute={setRoute}
        />
      )}
      {open && route === "Verification" && (
        <CustomModel
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          Component={Verification}
          setRoute={setRoute}
        />
      )}
    </>
  );
};

export default Header;
