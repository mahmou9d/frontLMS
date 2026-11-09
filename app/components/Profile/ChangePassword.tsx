"use client";

import { FormEvent, useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiMinus,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";

type FieldKey = "oldPassword" | "newPassword" | "confirmPassword";
type Errors = Partial<Record<FieldKey, string>>;

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const FIELD_BASE = `h-11 w-full rounded-2xl bg-white pl-4 pr-12 text-sm font-semibold text-[#0B1020] dark:bg-[#0B1020] dark:text-white ${FOCUS}`;

const fields: { key: FieldKey; label: string; autoComplete: string }[] = [
  {
    key: "oldPassword",
    label: "Current password",
    autoComplete: "current-password",
  },
  { key: "newPassword", label: "New password", autoComplete: "new-password" },
  {
    key: "confirmPassword",
    label: "Confirm new password",
    autoComplete: "new-password",
  },
];

const checks: { id: string; label: string; test: (p: string) => boolean }[] = [
  {
    id: "length",
    label: "At least 8 characters (required)",
    test: (p) => p.length >= 8,
  },
  { id: "long", label: "12 or more characters", test: (p) => p.length >= 12 },
  { id: "upper", label: "An uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "A number", test: (p) => /[0-9]/.test(p) },
  {
    id: "symbol",
    label: "A symbol, like ! or %",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

const validate = (v: Record<FieldKey, string>): Errors => {
  const errors: Errors = {};
  if (!v.oldPassword) errors.oldPassword = "Enter your current password.";
  if (!v.newPassword) errors.newPassword = "Enter a new password.";
  else if (v.newPassword.length < 8)
    errors.newPassword = "Use at least 8 characters.";
  if (!v.confirmPassword)
    errors.confirmPassword = "Enter your new password again.";
  else if (v.newPassword !== v.confirmPassword)
    errors.confirmPassword =
      "Passwords don't match. Check both fields and try again.";
  return errors;
};

const emptyValues: Record<FieldKey, string> = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [shown, setShown] = useState<Record<FieldKey, boolean>>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const results = checks.map((c) => ({
    ...c,
    met: c.test(values.newPassword),
  }));
  const metCount = results.filter((r) => r.met).length;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);

    const firstInvalid = fields.find(({ key }) => found[key]);
    if (firstInvalid) {
      document.getElementById(firstInvalid.key)?.focus();
      return;
    }

    try {
      await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success("Password updated");
      setValues(emptyValues);
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(
        message ||
          "We couldn't update your password. Check your current password and try again.",
      );
    }
  };

  return (
    <div>
      <h2 className="mb-6 border-b border-[#0B1020]/10 pb-4 text-xl font-extrabold tracking-tight text-[#0B1020] dark:border-white/10 dark:text-white">
        Change password
      </h2>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {fields.map(({ key, label, autoComplete }) => {
            const error = errors[key];
            const describedBy =
              [
                error ? `${key}-error` : null,
                key === "newPassword" ? "password-checks" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined;

            return (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="mb-1.5 block text-sm font-semibold text-[#0B1020] dark:text-white"
                >
                  {label}
                </label>

                <div className="relative">
                  <input
                    id={key}
                    type={shown[key] ? "text" : "password"}
                    autoComplete={autoComplete}
                    value={values[key]}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, [key]: e.target.value }));
                      setErrors((prev) => ({ ...prev, [key]: undefined }));
                    }}
                    className={`${FIELD_BASE} ${
                      error
                        ? "border-2 border-[#0B1020] dark:border-white"
                        : "border border-[#0B1020]/10 dark:border-white/10"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={`${shown[key] ? "Hide" : "Show"} ${label.toLowerCase()}`}
                    aria-pressed={shown[key]}
                    onClick={() =>
                      setShown((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    className={`absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 ${FOCUS}`}
                  >
                    {shown[key] ? (
                      <FiEyeOff size={18} aria-hidden="true" />
                    ) : (
                      <FiEye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>

                {error && (
                  <p
                    id={`${key}-error`}
                    role="alert"
                    className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-[#0B1020] dark:text-white"
                  >
                    <FiAlertCircle
                      size={16}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0"
                    />
                    {error}
                  </p>
                )}
              </div>
            );
          })}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] ${FOCUS}`}
            >
              {isLoading ? "Updating" : "Update password"}
            </button>
          </div>
        </form>

        {/* Checklist panel */}
        <aside
          id="password-checks"
          className="h-fit rounded-3xl bg-[#0B1020]/5 p-5 dark:bg-white/10"
        >
          <h3 className="text-base font-extrabold tracking-tight text-[#0B1020] dark:text-white">
            Make it hard to guess
          </h3>
          <p
            aria-live="polite"
            className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70"
          >
            {values.newPassword
              ? `${metCount} of ${checks.length} checks met`
              : "Your checks update as you type."}
          </p>

          <ul className="mt-4 space-y-2.5">
            {results.map(({ id, label, met }) => (
              <li
                key={id}
                className="flex items-center gap-3 text-sm font-semibold"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    met
                      ? "bg-[#2F4BFF] text-white"
                      : "bg-[#0B1020]/10 text-[#0B1020]/70 dark:bg-white/10 dark:text-white/70"
                  }`}
                >
                  {met ? <FiCheck size={14} /> : <FiMinus size={14} />}
                </span>
                <span
                  className={
                    met
                      ? "text-[#0B1020] dark:text-white"
                      : "text-[#0B1020]/70 dark:text-white/70"
                  }
                >
                  <span className="sr-only">{met ? "Met: " : "Not met: "}</span>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ChangePassword;
