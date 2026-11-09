"use client";
import CoursePlayer from "@/app/utills/CoursePlayer";
import { Rating } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  IoIosCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import {
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Payment/CheckoutForm";
import { useLazyLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { ICourse, IReview } from "@/app/types";
import { RootState } from "@/redux/store";

type Props = {
  data: ICourse;
  stripePromise: any;
  clientSecret: string;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";
// A cobalt outline would vanish on the cobalt panel, so links inside it use white.
const focusRingOnCobalt =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// Stars inherit the surrounding text color so they stay inside the palette.
const ratingSx = {
  color: "inherit",
  "& .MuiRating-iconEmpty": { color: "currentColor", opacity: 0.3 },
};

const sectionTitle = "mb-5 text-2xl font-extrabold tracking-tight sm:text-3xl";

// Yellow hard-shadow button. Ink border and shadow read on white and on cobalt.
const ctaClasses = `flex h-10 w-full items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-center font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none ${focusRingOnCobalt}`;

const PERKS = [
  { Icon: HiOutlineShieldCheck, label: "30-day money-back guarantee" },
  { Icon: HiOutlineClock, label: "Full lifetime access" },
  { Icon: HiOutlineLockClosed, label: "Certificate of completion" },
];

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setOpen: openAuthModal,
  setRoute,
}: Props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loadUser] = useLazyLoadUserQuery();
  const [open, setOpen] = useState(false);
  useEffect(() => {}, [user]);

  // Checkout modal: Escape closes it and the page behind it stops scrolling.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const discountPercentage =
    data?.estimatedPrice && data?.price
      ? ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
      : 0;
  const discountPercentagePrice = discountPercentage.toFixed(0);
  const isPurchased =
    user &&
    user?.courses?.some(
      (item: { courseId: string }) => item.courseId === data?._id,
    );

  const handleOrder = () => {
    if (user) {
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-20 text-[#0B1020] dark:bg-[#0B1020] dark:text-white">
        <div className="mx-auto max-w-[1180px] px-4 pt-[96px] sm:px-6 sm:pt-[104px]">
          <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
            {/* Cobalt panel: title, facts, price and the one action */}
            <aside
              aria-label="Course summary"
              className="rounded-3xl bg-[#2F4BFF] p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
            >
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-white/90">
                  <li>
                    <a
                      href="/"
                      className={`rounded-full hover:underline ${focusRingOnCobalt}`}
                    >
                      Home
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <a
                      href="/courses"
                      className={`rounded-full hover:underline ${focusRingOnCobalt}`}
                    >
                      Courses
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="font-semibold">
                    {data?.name}
                  </li>
                </ol>
              </nav>

              <h1 className="mb-4 text-[clamp(2rem,4.5vw,2.75rem)] font-black leading-[1.08] tracking-tight">
                {data?.name}
              </h1>

              <div className="mb-6 flex flex-col gap-3 text-sm font-semibold">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold">
                    {data?.rating ? Number(data.rating).toFixed(1) : "0.0"}
                  </span>
                  <span className="text-white">
                    <Rating
                      value={data?.rating ?? 0}
                      readOnly
                      size="small"
                      sx={ratingSx}
                    />
                  </span>
                  <span>({data?.reviews?.length ?? 0} reviews)</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <HiOutlineUsers size={16} aria-hidden="true" />
                    <span>{data?.purchased ?? 0} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineAcademicCap size={16} aria-hidden="true" />
                    <span>{data?.level}</span>
                  </div>
                  {data?.tags && (
                    <span className="inline-flex h-8 items-center rounded-full border border-white/40 px-3 text-xs font-bold">
                      {data.tags.split(",")[0].trim()}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-5 border-t border-white/25 pt-5">
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="text-5xl font-black leading-none tracking-tight">
                    {data?.price === 0 ? "Free" : `$${data?.price}`}
                  </span>
                  {data?.estimatedPrice &&
                    data.estimatedPrice !== data?.price && (
                      <span className="text-base text-white/90 line-through">
                        ${data.estimatedPrice}
                      </span>
                    )}
                </div>
                {Number(discountPercentagePrice) > 0 && (
                  <span className="inline-flex h-7 items-center rounded-full border border-white/40 px-3 text-xs font-bold">
                    {discountPercentagePrice}% off
                  </span>
                )}
              </div>

              <div className="mb-6">
                {isPurchased ? (
                  <Link
                    href={`/course-access/${data?._id}`}
                    className={ctaClasses}
                  >
                    Go to course
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`${ctaClasses} cursor-pointer`}
                    onClick={handleOrder}
                  >
                    {data?.price === 0
                      ? "Enroll for free"
                      : `Buy now for $${data?.price}`}
                  </button>
                )}
              </div>

              <ul className="flex flex-col gap-3">
                {PERKS.map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-sm font-semibold"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    {label}
                  </li>
                ))}
                <li className="flex items-center gap-2.5 text-sm font-semibold">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <HiOutlineAcademicCap size={18} aria-hidden="true" />
                  </span>
                  Level: {data?.level}
                </li>
              </ul>
            </aside>

            {/* Content */}
            <div className="min-w-0">
              {/* Demo video */}
              <div className="mb-10 overflow-hidden rounded-3xl border border-[#0B1020]/10 dark:border-white/10">
                <CoursePlayer videoUrl={data?.demoUrl} title={data?.name} />
              </div>

              {/* What you'll learn */}
              {data?.benefits?.length > 0 && (
                <section
                  aria-labelledby="benefits-title"
                  className="border-b border-[#0B1020]/10 pb-10 dark:border-white/10"
                >
                  <h2 id="benefits-title" className={sectionTitle}>
                    What you&apos;ll learn
                  </h2>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {data.benefits.map((item: { title: string }, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[15px] leading-normal"
                      >
                        <IoIosCheckmarkCircleOutline
                          size={20}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-[#2F4BFF] dark:text-white"
                        />
                        <span>{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Prerequisites */}
              {data?.prerequisites?.length > 0 && (
                <section
                  aria-labelledby="prereq-title"
                  className="border-b border-[#0B1020]/10 py-10 dark:border-white/10"
                >
                  <h2 id="prereq-title" className={sectionTitle}>
                    Prerequisites
                  </h2>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {data.prerequisites.map(
                      (item: { title: string }, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[15px] leading-normal"
                        >
                          <IoIosCheckmarkCircleOutline
                            size={20}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-[#2F4BFF] dark:text-white"
                          />
                          <span>{item.title}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </section>
              )}

              {/* Description */}
              <section
                aria-labelledby="details-title"
                className="border-b border-[#0B1020]/10 py-10 dark:border-white/10"
              >
                <h2 id="details-title" className={sectionTitle}>
                  Course details
                </h2>
                <p className="text-base leading-[1.75] text-[#0B1020]/70 dark:text-white/70">
                  {data?.description}
                </p>
              </section>

              {/* Curriculum */}
              <section
                aria-labelledby="curriculum-title"
                className="border-b border-[#0B1020]/10 py-10 dark:border-white/10"
              >
                <h2 id="curriculum-title" className={sectionTitle}>
                  Course curriculum
                </h2>
                <CourseContentList
                  data={data?.courseData ?? []}
                  isDemo={true}
                />
              </section>

              {/* Reviews */}
              <section aria-labelledby="reviews-title" className="pt-10">
                <h2 id="reviews-title" className={sectionTitle}>
                  Student reviews
                </h2>
                <div className="mb-6 flex items-center gap-5 rounded-3xl border border-[#0B1020]/10 p-5 dark:border-white/10">
                  <div className="text-6xl font-black leading-none tracking-tight">
                    {data?.rating ? Number(data.rating).toFixed(1) : "0.0"}
                  </div>
                  <div>
                    <span className="text-[#2F4BFF] dark:text-white">
                      <Rating
                        value={data?.rating ?? 0}
                        readOnly
                        size="small"
                        sx={ratingSx}
                      />
                    </span>
                    <div className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                      Course rating, based on {data?.reviews?.length ?? 0}{" "}
                      reviews
                    </div>
                  </div>
                </div>

                <ul>
                  {[...(data?.reviews ?? [])]
                    .reverse()
                    .map((item: IReview, index: number) => (
                      <li
                        key={index}
                        className="flex gap-4 border-t border-[#0B1020]/10 py-5 first:border-t-0 dark:border-white/10"
                      >
                        <div className="h-[48px] w-[48px] shrink-0 rounded-full bg-[#FFD23F] p-[3px]">
                          <div className="h-full w-full overflow-hidden rounded-full border-2 border-white dark:border-[#0B1020]">
                            <Image
                              src={
                                item?.user?.avatar?.url ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              }
                              alt={item?.user?.name}
                              width={42}
                              height={42}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold">
                            {item?.user?.name}
                          </div>
                          <span className="text-[#2F4BFF] dark:text-white">
                            <Rating
                              value={item?.rating ?? 0}
                              readOnly
                              size="small"
                              sx={ratingSx}
                            />
                          </span>
                          <p className="mt-1 text-[15px] leading-relaxed text-[#0B1020]/70 dark:text-white/70">
                            {item?.comment}
                          </p>
                          <div className="mt-1 text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
                            {format(item?.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>

                {(!data?.reviews || data.reviews.length === 0) && (
                  <p className="py-5 text-center text-sm text-[#0B1020]/70 dark:text-white/70">
                    No reviews yet. Be the first to review this course.
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Checkout modal */}
        {open && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1020]/70 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              className="relative max-h-[calc(100vh-2rem)] w-full max-w-[480px] overflow-y-auto rounded-3xl border border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close checkout"
                onClick={() => setOpen(false)}
                className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 ${focusRing}`}
              >
                <IoMdCloseCircleOutline size={26} aria-hidden="true" />
              </button>
              <div className="p-6 sm:p-7">
                <div
                  id="checkout-title"
                  className="mb-5 pr-10 text-xl font-extrabold tracking-tight"
                >
                  Complete your purchase
                </div>
                {(() => {
                  console.log("Stripe Debug in Modal:", {
                    stripePromise,
                    clientSecret,
                  });
                  return null;
                })()}
                {stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm user={user!} setOpen={setOpen} data={data} />
                  </Elements>
                ) : (
                  <p className="text-center text-sm text-[#0B1020]/70 dark:text-white/70">
                    Loading payment form...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetails;
