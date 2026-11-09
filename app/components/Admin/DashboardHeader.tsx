"use client";

import { ThemeSwitcher } from "@/app/utills/ThemeSwitcher";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notifications/notificationApi";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import { INotification } from "@/app/types";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL || "";

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  /** Mobile sidebar toggle */
  onMenuClick?: () => void;
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const ICON_BTN = `flex h-10 w-10 items-center justify-center rounded-full border border-[#0B1020]/10 text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`;

const PANEL_ID = "notifications-panel";

const DashboardHeader: FC<Props> = ({ open, setOpen, onMenuClick }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus] = useUpdateNotificationMutation();
  const [markingAll, setMarkingAll] = useState(false);

  const unread = useMemo<INotification[]>(
    () =>
      (data?.notifications ?? []).filter(
        (item: INotification) => item.status === "unread",
      ),
    [data],
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sound, created once in the browser.
  useEffect(() => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.load();
    audioRef.current = audio;
    return () => {
      audioRef.current = null;
    };
  }, []);

  // Live notifications: one socket per mounted header, always cleaned up.
  useEffect(() => {
    if (!ENDPOINT) return;
    const socket = io(ENDPOINT, { transports: ["websocket"] });
    socket.on("newNotification", () => {
      refetch();
      // Browsers block sound until the user has interacted with the page.
      audioRef.current?.play().catch(() => undefined);
    });
    return () => {
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [refetch]);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen?.(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen?.(false);
        bellRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  const handleMarkAsRead = async (id: string) => {
    if (!id) return;
    try {
      await updateNotificationStatus({ id }).unwrap();
      refetch();
    } catch {
      toast.error("We couldn't mark that notification as read. Try again.");
    }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    const results = await Promise.allSettled(
      unread.map((n) => updateNotificationStatus({ id: n._id }).unwrap()),
    );
    await refetch();
    setMarkingAll(false);
    if (results.some((r) => r.status === "rejected")) {
      toast.error("Some notifications couldn't be marked as read. Try again.");
    }
  };

  const count = unread.length;

  return (
    <header className="fixed inset-x-0 top-0 z-[90] px-3 pt-3 sm:px-6">
      <div className="flex h-14 items-center justify-between gap-2.5 rounded-full border border-[#0B1020]/10 bg-white/90 px-2 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1020]/90">
        {/* Menu button, mobile only */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`${ICON_BTN} min-[900px]:hidden`}
        >
          <RxHamburgerMenu size={18} aria-hidden="true" />
        </button>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />

          <div ref={dropdownRef} className="relative">
            {/* Bell pill */}
            <button
              ref={bellRef}
              type="button"
              onClick={() => setOpen?.(!open)}
              aria-label={
                count > 0 ? `Notifications, ${count} unread` : "Notifications"
              }
              aria-expanded={!!open}
              aria-controls={PANEL_ID}
              className={`flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${
                open
                  ? "border-[#2F4BFF] bg-[#2F4BFF] text-white"
                  : "border-[#0B1020]/10 text-[#0B1020] hover:bg-[#0B1020]/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              }`}
            >
              <IoMdNotificationsOutline size={20} aria-hidden="true" />
              {count > 0 && (
                <span aria-hidden="true">
                  {count > 99 ? "99+" : count}
                  <span className="hidden sm:inline"> new</span>
                </span>
              )}
            </button>

            {open && (
              <div
                id={PANEL_ID}
                role="region"
                aria-label="Notifications"
                className="fixed right-3 top-[76px] z-[200] flex max-h-[520px] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-3xl border border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020] sm:right-6 sm:w-[380px]"
              >
                <div className="shrink-0 px-5 pb-3 pt-5">
                  <h2 className="text-lg font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                    Notifications
                  </h2>
                  <p className="text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                    {count === 0 ? "Nothing new right now" : `${count} unread`}
                  </p>
                </div>

                {count === 0 ? (
                  <p className="px-5 pb-8 pt-4 text-center text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                    You&apos;re all caught up. New notifications will show up
                    here.
                  </p>
                ) : (
                  <>
                    <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
                      {unread.map((n) => (
                        <li
                          key={n._id}
                          className="flex items-start gap-3 rounded-2xl bg-[#0B1020]/5 p-3 dark:bg-white/10"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F4BFF] dark:bg-[#0B1020]">
                            <IoMdNotificationsOutline
                              size={20}
                              aria-hidden="true"
                            />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                              {n.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-sm text-[#0B1020]/70 dark:text-white/70">
                              {n.message}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
                              {format(n.createdAt)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(n._id)}
                            aria-label={`Mark as read: ${n.title}`}
                            title="Mark as read"
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-white motion-reduce:transition-none dark:text-white/70 dark:hover:bg-[#0B1020] ${FOCUS}`}
                          >
                            <FiCheck size={18} aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="shrink-0 border-t border-[#0B1020]/10 p-3 dark:border-white/10">
                      <button
                        type="button"
                        onClick={handleMarkAll}
                        disabled={markingAll}
                        className={`h-10 w-full rounded-full border border-[#0B1020]/10 text-sm font-semibold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`}
                      >
                        {markingAll ? "Marking as read" : "Mark all as read"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
