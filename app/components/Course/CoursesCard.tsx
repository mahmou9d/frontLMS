"use client";
import { Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi2";
import { ICourse } from "@/app/types";

type Props = {
  course: ICourse;
  isProfile?: boolean;
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const BADGE =
  "rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0B1020] border border-[#0B1020]/10";

const count = (n: number, word: string) =>
  `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;

const CoursesCard = ({ course, isProfile }: Props) => {
  const isFree = course.price === 0;
  const hasDiscount =
    course.estimatedPrice != null && course.estimatedPrice > course.price;
  const discount = hasDiscount
    ? Math.round(
        ((course.estimatedPrice! - course.price) / course.estimatedPrice!) *
          100,
      )
    : 0;
  const students = course.purchased ?? 0;
  const lectures = course.courseData?.length ?? 0;
  const reviewCount = course.reviews?.length ?? 0;
  const rating = course.rating ?? 0;

  return (
    <Link
      href={
        isProfile ? `/course-access/${course._id}` : `/course/${course._id}`
      }
      className={`group flex h-full flex-col rounded-3xl border border-[#0B1020]/10 bg-white p-2 no-underline transition-colors duration-150 hover:border-[#2F4BFF] motion-reduce:transition-none dark:border-white/10 dark:bg-[#0B1020] dark:hover:border-[#2F4BFF] ${FOCUS}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-2xl bg-[#0B1020]/5 dark:bg-white/10">
        <Image
          src={course.thumbnail?.url || "/course-placeholder.png"}
          alt={course.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        {((discount >= 30 && !isFree) || students > 100) && (
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {discount >= 30 && !isFree && (
              <span className={BADGE}>{discount}% off</span>
            )}
            {students > 100 && <span className={BADGE}>Popular</span>}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 px-3 pb-3 pt-4">
        {course.categories && (
          <span className="truncate text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            {course.categories}
          </span>
        )}

        <h3 className="m-0 line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-[#0B1020] dark:text-white">
          {course.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#0B1020] dark:text-white">
            {Number(rating).toFixed(1)}
          </span>
          <Rating
            value={rating}
            readOnly
            precision={0.5}
            size="small"
            sx={{
              fontSize: "0.9rem",
              color: "#2F4BFF",
              "& .MuiRating-iconEmpty": { color: "rgba(11,16,32,0.15)" },
            }}
          />
          <span className="text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-[#0B1020]/70 dark:text-white/70">
          <span className="flex items-center gap-1.5">
            <HiOutlineUsers size={15} aria-hidden="true" />
            {count(students, "student")}
          </span>
          <span className="flex items-center gap-1.5">
            <AiOutlineUnorderedList size={15} aria-hidden="true" />
            {count(lectures, "lecture")}
          </span>
        </div>
      </div>

      {/* Footer panel */}
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#0B1020]/5 py-2 pl-4 pr-2 dark:bg-white/10">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight text-[#0B1020] dark:text-white">
            {isFree ? "Free" : `$${course.price}`}
          </span>
          {hasDiscount && !isFree && (
            <span className="text-sm text-[#0B1020]/70 line-through dark:text-white/70">
              ${course.estimatedPrice}
            </span>
          )}
        </div>
        <span className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-[#0B1020] px-5 text-sm font-bold text-white transition-colors duration-150 group-hover:bg-[#2F4BFF] motion-reduce:transition-none dark:bg-white dark:text-[#0B1020] dark:group-hover:bg-[#2F4BFF] dark:group-hover:text-white">
          {isProfile ? "Continue" : "Enroll now"}
        </span>
      </div>
    </Link>
  );
};

export default CoursesCard;
