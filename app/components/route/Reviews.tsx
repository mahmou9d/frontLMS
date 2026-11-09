"use client";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineFormatQuote } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";

/* ─── Static data ─────────────────────────────────────────── */
export const reviews = [
  {
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    profession: "Full-Stack Developer",
    comment:
      "This platform completely transformed my career. The courses are incredibly well-structured and the instructors are top-notch. I landed my dream job within 3 months!",
    rating: 5,
    course: "React & Next.js Masterclass",
  },
  {
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    profession: "Data Scientist",
    comment:
      "The machine learning course exceeded all my expectations. Practical projects and real-world datasets made learning so much more effective than other platforms.",
    rating: 5,
    course: "Machine Learning A-Z",
  },
  {
    name: "Emily Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    profession: "UX Designer",
    comment:
      "Absolutely amazing UI/UX course! The instructor explains complex concepts in a simple, engaging way. I went from zero to landing freelance clients in just 2 months.",
    rating: 5,
    course: "UI/UX Design Bootcamp",
  },
  {
    name: "James Williams",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    profession: "Backend Engineer",
    comment:
      "Best investment I've made in my career. The Python & Django course is extremely comprehensive and up-to-date with modern best practices. Highly recommended!",
    rating: 5,
    course: "Python & Django Pro",
  },
  {
    name: "Aisha Patel",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    profession: "Cloud Architect",
    comment:
      "The cloud computing course gave me exactly what I needed to pass my AWS certification. Clear explanations, excellent labs, and outstanding support from the community.",
    rating: 5,
    course: "AWS Cloud Practitioner",
  },
  {
    name: "David Kim",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    profession: "Mobile Developer",
    comment:
      "I've tried many online learning platforms, but this one stands out. The project-based approach and mentorship made all the difference in my learning journey.",
    rating: 5,
    course: "Flutter Development",
  },
];

/* ─── Component ──────────────────────────────────────────── */
const Reviews = () => {
  const [active, setActive] = useState(0);

  return (
    <>
      <section className="relative pt-[100px] pb-[90px] text-[#0B1020] dark:text-white">
        <div className="relative max-w-[1280px] mx-auto px-6">
          {/* ── Header ── */}
          <div className="mb-16 text-center">
            <h2 className="mx-auto max-w-[760px] text-[clamp(2.25rem,5.5vw,4rem)] font-black leading-[1.05] tracking-tighter text-[#2F4BFF] dark:text-white">
              Our students are our strength
            </h2>
            <p className="mx-auto mt-5 max-w-[540px] text-base font-medium leading-[1.65] text-[#0B1020]/70 dark:text-white/70">
              See what thousands of learners across the globe are saying about
              their experience on our platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
                <span className="font-extrabold text-[#2F4BFF] dark:text-white">
                  1k+
                </span>
                Happy students
              </div>
              <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
                <AiFillStar
                  size={16}
                  className="text-[#2F4BFF]"
                  aria-hidden="true"
                />
                <span className="font-extrabold text-[#2F4BFF] dark:text-white">
                  4.9
                </span>
                Average rating
              </div>
              <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
                <span className="font-extrabold text-[#2F4BFF] dark:text-white">
                  98%
                </span>
                Satisfaction rate
              </div>
            </div>
          </div>

          {/* ── Featured Review (rotating) ── */}
          <div className="mb-12">
            <div className="relative rounded-3xl px-5 py-8 sm:px-[52px] sm:py-12 bg-white border border-[#0B1020]/10 flex flex-col sm:flex-row gap-7 sm:gap-12 items-center dark:bg-[#0B1020] dark:border-white/10">
              {/* Image */}
              <div className="relative flex-shrink-0">
                <div className="w-[140px] h-[140px] rounded-full p-[3px] bg-[#FFD23F] flex-shrink-0">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src={reviews[active].avatar}
                      alt={reviews[active].name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="140px"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <div
                  className="flex gap-[3px] mb-[14px] text-[#2F4BFF]"
                  role="img"
                  aria-label="5 out of 5 stars"
                >
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <AiFillStar key={i} size={20} aria-hidden="true" />
                    ))}
                </div>
                <p className="text-lg leading-[1.7] text-[#0B1020] font-medium mb-5 dark:text-white">
                  &ldquo;{reviews[active].comment}&rdquo;
                </p>
                <div>
                  <p className="text-base font-extrabold tracking-tight">
                    {reviews[active].name}
                  </p>
                  <p className="text-[13px] text-[#0B1020]/70 font-medium dark:text-white/70">
                    {reviews[active].profession}
                  </p>
                  {reviews[active].course && (
                    <span className="inline-flex items-center gap-[5px] mt-2 px-3 py-1 rounded-full border border-[#0B1020]/10 text-xs font-bold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
                      <MdOutlineFormatQuote
                        size={13}
                        className="text-[#2F4BFF]"
                        aria-hidden="true"
                      />
                      {reviews[active].course}
                    </span>
                  )}
                </div>

                {/* Dot nav */}
                <div className="flex items-center mt-4 -ml-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="group flex h-10 w-10 items-center justify-center rounded-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]"
                      onClick={() => setActive(i)}
                      aria-label={`Show review ${i + 1} of ${reviews.length}`}
                      aria-current={active === i ? "true" : undefined}
                    >
                      <span
                        className={`block h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                          active === i
                            ? "w-6 bg-[#2F4BFF]"
                            : "w-2 bg-[#0B1020]/10 group-hover:bg-[#0B1020]/30 dark:bg-white/10 dark:group-hover:bg-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Avatar stack ── */}
          <div className="flex flex-wrap items-center justify-center gap-y-3 mb-10">
            {reviews.slice(0, 5).map((r, i) => (
              <div
                key={i}
                className="relative w-11 h-11 rounded-full border-2 border-white -ml-2.5 first:ml-0 overflow-hidden dark:border-[#0B1020]"
                style={{ zIndex: reviews.length - i }}
              >
                <Image
                  src={r.avatar}
                  alt={r.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="44px"
                />
              </div>
            ))}
            <div className="w-11 h-11 rounded-full border-2 border-white -ml-2.5 bg-[#2F4BFF] text-white text-[11px] font-extrabold flex items-center justify-center dark:border-[#0B1020]">
              +2k
            </div>
            <p className="ml-[14px] text-sm font-semibold text-[#0B1020]/70 leading-[1.5] dark:text-white/70">
              Join{" "}
              <strong className="text-[#2F4BFF] font-extrabold dark:text-white">
                500,000+
              </strong>{" "}
              learners on the platform
            </p>
          </div>

          {/* ── CTA ── */}
          <a
            href="/courses"
            className="mx-auto flex h-14 w-fit items-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-8 text-base font-bold text-[#0B1020] shadow-[4px_4px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#0B1020] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF] dark:border-white dark:shadow-[4px_4px_0_#fff] dark:hover:shadow-[5px_5px_0_#fff]"
          >
            Browse courses
          </a>
        </div>
      </section>
    </>
  );
};

export default Reviews;
