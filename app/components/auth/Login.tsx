"use client";
import React, { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const ADMIN = {
  email: "mahmou9d98@gmail.com",
  password: "Qqwe123!@#",
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address, like name@example.com.")
    .required("Enter your email address."),
  password: Yup.string()
    .required("Enter your password.")
    .min(6, "Use at least 6 characters."),
});

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const LABEL =
  "mb-1.5 block text-sm font-semibold text-[#0B1020] dark:text-white";

const FIELD = `h-11 w-full rounded-2xl bg-white px-4 text-sm font-semibold text-[#0B1020] placeholder:text-[#0B1020]/70 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/70 ${FOCUS}`;

const fieldBorder = (hasError: boolean) =>
  hasError
    ? "border-2 border-[#0B1020] dark:border-white"
    : "border border-[#0B1020]/10 dark:border-white/10";

const SOCIAL = `flex h-11 items-center justify-center gap-2 rounded-full border border-[#0B1020]/10 bg-white text-sm font-semibold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:hover:bg-white/10 ${FOCUS}`;

const TAB = `h-10 rounded-full text-sm font-bold transition-colors duration-150 motion-reduce:transition-none ${FOCUS}`;

const ErrorText = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => (
  <p
    id={id}
    role="alert"
    className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-[#0B1020] dark:text-white"
  >
    <FiAlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
    {children}
  </p>
);

const Login: FC<Props> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [login] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      try {
        const res = await login({ email, password }).unwrap();
        toast.success(res?.message || "Signed in");
        setOpen(false);
      } catch (err) {
        const message = (err as { data?: { message?: string } })?.data?.message;
        toast.error(
          message ||
            "We couldn't sign you in. Check your email and password and try again.",
        );
      }
    },
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
  } = formik;

  const emailError = touched.email ? errors.email : undefined;
  const passwordError = touched.password ? errors.password : undefined;

  return (
    <div className="w-full px-1 py-4 sm:px-2">
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-[#0B1020]/5 p-1 dark:bg-white/10">
        <button
          type="button"
          aria-current="true"
          className={`${TAB} bg-[#2F4BFF] text-white`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setRoute("Sign-Up")}
          className={`${TAB} text-[#0B1020]/70 hover:text-[#0B1020] dark:text-white/70 dark:hover:text-white`}
        >
          Sign up
        </button>
      </div>

      <h1 className="text-2xl font-black tracking-tight text-[#0B1020] dark:text-white">
        Welcome back
      </h1>
      <p className="mb-6 mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
        Sign in to pick up where you left off.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Admin helper (development only) */}

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#0B1020]/5 p-3 dark:bg-white/10">
          <div className="min-w-0 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            <p className="truncate">Admin: {ADMIN.email}</p>
            <p className="truncate">Password: {ADMIN.password}</p>
          </div>
          <button
            type="button"
            onClick={() => formik.setValues(ADMIN)}
            className={`h-10 shrink-0 rounded-full border border-[#0B1020]/10 bg-white px-4 text-sm font-semibold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:hover:bg-white/10 ${FOCUS}`}
          >
            Fill admin account
          </button>
        </div>

        <div>
          <label htmlFor="email" className={LABEL}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="name@example.com"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "email-error" : undefined}
            className={`${FIELD} ${fieldBorder(!!emailError)}`}
          />
          {emailError && <ErrorText id="email-error">{emailError}</ErrorText>}
        </div>

        <div>
          <label htmlFor="password" className={LABEL}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? "password-error" : undefined}
              className={`${FIELD} pr-12 ${fieldBorder(!!passwordError)}`}
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              onClick={() => setShow((s) => !s)}
              className={`absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 ${FOCUS}`}
            >
              {show ? (
                <FiEyeOff size={18} aria-hidden="true" />
              ) : (
                <FiEye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
          {passwordError && (
            <ErrorText id="password-error">{passwordError}</ErrorText>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 inline-flex h-10 w-full items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] ${FOCUS}`}
        >
          {isSubmitting ? "Signing in" : "Sign in"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#0B1020]/10 dark:bg-white/10" />
        <span className="text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-[#0B1020]/10 dark:bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => signIn("google")}
          className={SOCIAL}
        >
          <FcGoogle size={20} aria-hidden="true" />
          Google
        </button>
        <button
          type="button"
          onClick={() => signIn("github")}
          className={SOCIAL}
        >
          <AiFillGithub size={20} aria-hidden="true" />
          GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
