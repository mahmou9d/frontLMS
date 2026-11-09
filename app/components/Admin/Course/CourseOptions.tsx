"use client";

import React, { FC } from "react";
import {
  HiOutlineCheck,
  HiOutlineInformationCircle,
  HiOutlineCog,
  HiOutlineBookOpen,
  HiOutlineEye,
} from "react-icons/hi";

type Props = {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
};

const options = [
  { label: "Course information", Icon: HiOutlineInformationCircle },
  { label: "Course options", Icon: HiOutlineCog },
  { label: "Course content", Icon: HiOutlineBookOpen },
  { label: "Course preview", Icon: HiOutlineEye },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  return (
    <nav aria-label="Course steps">
      <ol className="flex flex-col gap-1">
        {options.map(({ label, Icon }, index) => {
          const isActive = active === index;
          const isCompleted = active > index;
          const isLast = index === options.length - 1;

          const rowClass = isActive
            ? "bg-[#2F4BFF] text-white"
            : "text-[#0B1020]/70 hover:bg-[#0B1020]/5 dark:text-white/70 dark:hover:bg-white/10";

          const badgeClass = isActive
            ? "bg-[#FFD23F] text-[#0B1020]"
            : isCompleted
              ? "bg-[#0B1020]/5 text-[#2F4BFF] dark:bg-white/10 dark:text-white"
              : "border border-[#0B1020]/10 text-[#0B1020]/70 dark:border-white/10 dark:text-white/70";

          const lineClass = isActive
            ? "bg-white/30"
            : isCompleted
              ? "bg-[#2F4BFF]"
              : "bg-[#0B1020]/10 dark:bg-white/10";

          return (
            <li key={label} className="relative">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex w-full min-h-[64px] items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors duration-150 motion-reduce:transition-none ${rowClass} ${focusRing}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${badgeClass}`}
                >
                  {isCompleted ? (
                    <HiOutlineCheck size={20} aria-hidden="true" />
                  ) : (
                    <Icon size={20} aria-hidden="true" />
                  )}
                </span>
                <span
                  className={`text-base ${isActive ? "font-extrabold" : "font-semibold"}`}
                >
                  {label}
                  {isCompleted && <span className="sr-only"> (completed)</span>}
                </span>
              </button>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-[35px] top-[52px] -bottom-4 w-0.5 ${lineClass}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CourseOptions;
