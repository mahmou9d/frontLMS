import React from "react";
import CoursePlayer from "../../../utills/CoursePlayer";
import { HiOutlineCheck } from "react-icons/hi";

interface ICoursePreviewData {
  name?: string;
  title?: string;
  description?: string;
  price?: number | string;
  estimatedPrice?: number | string;
  demoUrl?: string;
  benefit?: Array<{ title: string }>;
  benefits?: Array<{ title: string }>;
}

type Props = {
  courseData: ICoursePreviewData;
  active: number;
  setActive: (active: number) => void;
  handleCourseCreate: () => void;
  isEdit?: boolean;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const secondaryBtn = `inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full border border-[#0B1020]/10 dark:border-white/10 text-sm font-semibold text-[#0B1020] dark:text-white hover:bg-[#0B1020]/5 dark:hover:bg-white/10 transition-all duration-150 motion-reduce:transition-none ${focusRing}`;

const ctaBtn = `inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#FFD23F] text-[#0B1020] text-sm font-bold border-2 border-[#0B1020] dark:border-white shadow-[3px_3px_0_#0B1020] dark:shadow-[3px_3px_0_#fff] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] dark:hover:shadow-[4px_4px_0_#fff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 motion-reduce:transition-none ${focusRing}`;

const disabledBtn =
  "inline-flex items-center justify-center h-10 px-5 rounded-full border border-[#0B1020]/10 dark:border-white/10 bg-[#0B1020]/5 dark:bg-white/10 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70 cursor-not-allowed";

const sectionHeading =
  "mt-8 mb-3 text-lg font-bold text-[#0B1020] dark:text-white";

const inclusions = [
  "Source code included",
  "Full lifetime access",
  "Certificate of completion",
  "Premium support",
];

const CoursePreview = ({
  courseData,
  active,
  setActive,
  handleCourseCreate,
  isEdit,
}: Props) => {
  const hasPrice = courseData?.price !== undefined && courseData?.price !== "";
  const price = Number(courseData?.price);
  const estimatedPrice = Number(courseData?.estimatedPrice);
  const isFree = hasPrice && price === 0;
  const priceLabel = isFree ? "Free" : `$${courseData?.price ?? 0}`;

  const hasDiscount =
    Boolean(courseData?.estimatedPrice) && estimatedPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((estimatedPrice - price) / estimatedPrice) * 100)
    : 0;

  const benefitsList = courseData?.benefit || courseData?.benefits || [];

  return (
    <div className="mx-auto mt-[90px] sm:my-24 mb-[60px] w-full sm:w-[90%] max-w-[900px] px-3 sm:px-0">
      <div className="rounded-3xl border border-[#0B1020]/10 dark:border-white/10 bg-white dark:bg-[#0B1020] p-4 sm:p-8 text-[#0B1020] dark:text-white">
        {/* Video player */}
        <div className="overflow-hidden rounded-2xl border border-[#0B1020]/10 dark:border-white/10">
          <CoursePlayer
            videoUrl={courseData.demoUrl}
            title={courseData.name || courseData.title}
          />
        </div>

        {/* Price */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-3xl font-extrabold tracking-tight">
            {priceLabel}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-[#0B1020]/70 dark:text-white/70 line-through">
                ${courseData?.estimatedPrice}
              </span>
              <span className="inline-flex items-center h-7 px-3 rounded-full bg-[#0B1020]/5 dark:bg-white/10 text-sm font-bold">
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>

        {/* Buy and discount code (preview only) */}
        <button type="button" disabled className={`${disabledBtn} mt-4 w-full`}>
          {isFree ? "Enroll for free" : `Buy now for ${priceLabel}`} (preview
          only)
        </button>

        <div className="my-5 flex gap-2.5">
          <input
            type="text"
            disabled
            aria-label="Discount code"
            placeholder="Discount code"
            className="flex-1 min-w-0 h-11 px-4 rounded-full border border-[#0B1020]/10 dark:border-white/10 bg-[#0B1020]/5 dark:bg-white/10 text-sm placeholder:text-[#0B1020]/70 dark:placeholder:text-white/70 cursor-not-allowed"
          />
          <button type="button" disabled className={`${disabledBtn} h-11`}>
            Apply
          </button>
        </div>

        {/* Inclusions */}
        <ul className="mb-8 flex flex-col gap-2 border-t border-[#0B1020]/10 dark:border-white/10 pt-4">
          {inclusions.map((text) => (
            <li
              key={text}
              className="flex items-center gap-2 text-sm font-medium text-[#0B1020]/70 dark:text-white/70"
            >
              <HiOutlineCheck
                className="shrink-0 text-[#2F4BFF] dark:text-white"
                size={16}
                aria-hidden="true"
              />
              {text}
            </li>
          ))}
        </ul>

        {/* Course details */}
        <div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight">
            {courseData.name || courseData.title || "Untitled course"}
          </h2>

          <div className="mb-2 flex items-center justify-between border-b border-[#0B1020]/10 dark:border-white/10 pb-4 text-sm text-[#0B1020]/70 dark:text-white/70">
            <span>No reviews yet</span>
            <span>0 students</span>
          </div>

          {benefitsList.length > 0 && (
            <>
              <h3 className={sectionHeading}>What you will learn</h3>
              <ul className="mb-2 grid gap-2">
                {benefitsList.map((item: { title: string }, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 py-1 text-sm font-medium"
                  >
                    <HiOutlineCheck
                      className="mt-0.5 shrink-0 text-[#2F4BFF] dark:text-white"
                      size={18}
                      aria-hidden="true"
                    />
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3 className={sectionHeading}>Course description</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {courseData?.description || "No description provided."}
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-[#0B1020]/10 dark:border-white/10 pt-6">
          <button
            type="button"
            onClick={() => setActive(active - 1)}
            className={secondaryBtn}
          >
            Previous
          </button>
          <button type="button" onClick={handleCourseCreate} className={ctaBtn}>
            {isEdit ? "Update course" : "Create course"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
