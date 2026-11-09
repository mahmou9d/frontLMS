"use client";
import { Rating } from "@mui/material";
import Image from "next/image";
import React from "react";
import { MdOutlineFormatQuote } from "react-icons/md";

interface IReviewCardData {
  name: string;
  avatar: string;
  profession: string;
  comment: string;
  rating: number;
  course?: string;
}

type Props = {
  review: IReviewCardData;
};

const ReviewCard = ({ review }: Props) => {
  return (
    <div
      className="
        group relative flex h-full flex-col gap-4 overflow-hidden rounded-[20px]
        border-[1.5px] border-indigo-500/10 bg-white/[0.88] px-6 pb-[22px] pt-[26px]
        shadow-[0_4px_20px_rgba(99,102,241,0.06)]
       hover:border-indigo-500/[0.28] hover:shadow-[0_18px_45px_rgba(99,102,241,0.14)]
        dark:border-indigo-500/[0.16] dark:bg-[#0f1535]/[0.72] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.4)]
        before:content-[''] before:absolute before:-top-px before:-left-px before:-right-px
        before:h-[3px] before:rounded-t-[20px]
        before:bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)]
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      "
    >
      {/* Decorative quote mark */}
      <span className="absolute right-[18px] top-[14px] text-[36px] text-indigo-500/[0.12] transition-colors duration-300 group-hover:text-indigo-500/20 dark:text-indigo-500/[0.18]">
        <MdOutlineFormatQuote />
      </span>

      {/* ── Top row ── */}
      <div className="flex items-center gap-[14px]">
        <div className="flex-shrink-0 w-[54px] h-[54px] rounded-full p-[2.5px] bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)] shadow-[0_4px_14px_rgba(99,102,241,0.3)] transition-transform duration-300 group-hover:scale-[1.06] group-hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)]">
          <div className="relative w-full h-full rounded-full overflow-hidden border-[2.5px] border-white dark:border-[#0d0d23]">
            <Image
              src={
                review?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={review?.name || "Reviewer"}
              fill
              style={{ objectFit: "cover" }}
              sizes="54px"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="m-0 mb-[3px] truncate text-[15px] font-extrabold text-gray-900 dark:text-gray-100">
            {review?.name}
          </p>
          <p className="truncate text-[12.5px] font-semibold text-indigo-500 dark:text-indigo-400">
            {review?.profession}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-extrabold text-amber-500">
          {Number(review?.rating ?? 5).toFixed(1)}
        </span>
        <Rating
          value={review?.rating ?? 5}
          readOnly
          precision={0.5}
          size="small"
          sx={{ fontSize: "0.9rem" }}
        />
      </div>

      <div className="h-px bg-[linear-gradient(90deg,rgba(99,102,241,0.15),transparent)]" />

      {/* Comment */}
      <p className="line-clamp-4 flex-1 text-[14.5px] italic leading-[1.72] text-gray-600 dark:text-gray-400">
        &ldquo;{review?.comment}&rdquo;
      </p>

      {/* Course tag (optional) */}
      {review?.course && (
        <span className="inline-flex w-fit items-center gap-[5px] rounded-full border border-indigo-500/[0.12] bg-indigo-500/[0.07] px-3 py-[5px] text-xs font-bold text-indigo-500 dark:border-indigo-500/20 dark:bg-indigo-500/[0.12] dark:text-indigo-400">
          <MdOutlineFormatQuote size={13} />
          {review.course}
        </span>
      )}
    </div>
  );
};

export default ReviewCard;
