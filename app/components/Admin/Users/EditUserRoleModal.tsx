"use client";
import React, { FC, useEffect, useId, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: (email: string, role: string) => void;
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const FIELD = `box-border h-11 w-full rounded-2xl border border-[#0B1020]/10 bg-white px-4 text-sm font-semibold text-[#0B1020] placeholder:text-[#0B1020]/70 focus:border-[#2F4BFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF] dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/70`;

const LABEL = "text-sm font-bold text-[#0B1020] dark:text-white";

const EditUserRoleModal: FC<Props> = ({ open, setOpen, handleSubmit }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const uid = useId();
  const titleId = `${uid}-title`;
  const emailId = `${uid}-email`;
  const hintId = `${uid}-hint`;
  const roleId = `${uid}-role`;

  // Reset the form whenever the modal closes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setRole("admin");
    }
  }, [open]);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    handleSubmit(email, role);
  };

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
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-3xl border border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#0B1020]/10 px-6 py-4 dark:border-white/10">
          <h2
            id={titleId}
            className="text-lg font-extrabold tracking-tight text-[#0B1020] dark:text-white"
          >
            Edit user role
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFD23F] text-[#0B1020] ${FOCUS}`}
          >
            <AiOutlineClose size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={emailId} className={LABEL}>
              User email
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              autoFocus
              aria-describedby={hintId}
              className={FIELD}
            />
            <p
              id={hintId}
              className="text-xs font-semibold text-[#0B1020]/70 dark:text-white/70"
            >
              Enter the email of the person whose role you want to change.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={roleId} className={LABEL}>
              New role
            </label>
            <select
              id={roleId}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={FIELD}
            >
              <option value="admin" className="bg-white dark:bg-[#0B1020]">
                Admin
              </option>
              <option value="user" className="bg-white dark:bg-[#0B1020]">
                User
              </option>
            </select>
          </div>

          {/* Actions */}
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`h-10 flex-1 rounded-full border border-[#0B1020]/10 px-5 text-sm font-bold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`h-10 flex-1 rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${FOCUS}`}
            >
              Update role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserRoleModal;
