import React from "react";
import { HiOutlineAcademicCap } from "react-icons/hi2";

const Loader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-white dark:bg-[#0B1020]"
    >
      {/* Logo mark inside a spinning ring */}
      <div
        className="relative flex h-20 w-20 items-center justify-center"
        aria-hidden="true"
      >
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#0B1020]/10 border-t-[#2F4BFF] motion-reduce:animate-none dark:border-white/10 dark:border-t-[#2F4BFF]" />
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F4BFF] text-white">
          <HiOutlineAcademicCap size={24} />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#FFD23F] ring-2 ring-white dark:ring-[#0B1020]" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
          ELearning
        </p>
        <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
          Loading
        </p>
      </div>
    </div>
  );
};

export default Loader;
