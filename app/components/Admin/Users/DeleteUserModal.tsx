"use client";
import React, { FC, useEffect, useId } from "react";
import { AiOutlineClose, AiOutlineWarning } from "react-icons/ai";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
  handleDelete: (id: string) => void;
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const DeleteUserModal: FC<Props> = ({
  open,
  setOpen,
  userId,
  handleDelete,
}) => {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  // Escape closes the modal, and the page behind it doesn't scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0B1020]/50"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-3xl border border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020]"
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD23F] text-[#0B1020] ${FOCUS}`}
        >
          <AiOutlineClose size={18} aria-hidden="true" />
        </button>

        {/* Body */}
        <div className="flex flex-col items-center gap-3 px-8 pb-6 pt-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1020]/5 text-[#0B1020] dark:bg-white/10 dark:text-white">
            <AiOutlineWarning size={26} aria-hidden="true" />
          </div>

          <h2
            id={titleId}
            className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white"
          >
            Delete this user?
          </h2>

          <p
            id={descId}
            className="text-sm font-semibold leading-relaxed text-[#0B1020]/70 dark:text-white/70"
          >
            This permanently removes the user and their course progress. You
            can&apos;t undo this.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            type="button"
            autoFocus
            onClick={() => setOpen(false)}
            className={`h-10 flex-1 rounded-full border border-[#0B1020]/10 px-5 text-sm font-bold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              handleDelete(userId);
              setOpen(false);
            }}
            className={`h-10 flex-1 rounded-full bg-[#0B1020] px-5 text-sm font-bold text-white transition-opacity duration-150 hover:opacity-90 motion-reduce:transition-none dark:bg-white dark:text-[#0B1020] ${FOCUS}`}
          >
            Delete user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
