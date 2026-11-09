"use client";
import { useGetHeroDataQuery } from "@/redux/features/layout/page";
import React, { useEffect, useState } from "react";
import { IFaqItem } from "@/app/types";
import { HiMiniMinus, HiMiniPlus } from "react-icons/hi2";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { MdOutlineHelpOutline } from "react-icons/md";

const FAQ = () => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<IFaqItem[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: string) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <>
      <section className="relative pt-[100px] pb-[90px] text-[#0B1020] dark:text-white">
        <div className="relative max-w-[1180px] mx-auto px-6 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* ── Header ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-[1.05] tracking-tighter text-[#2F4BFF] dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-5 max-w-[440px] text-base font-medium leading-[1.65] text-[#0B1020]/70 dark:text-white/70">
              Everything you need to know about our platform and courses.
              Can&apos;t find the answer? Our support team is always here to
              help.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
                <HiOutlineChatBubbleLeftRight
                  size={16}
                  className="text-[#2F4BFF] dark:text-white"
                  aria-hidden="true"
                />
                {questions.length} questions answered
              </span>
              <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
                <MdOutlineHelpOutline
                  size={16}
                  className="text-[#2F4BFF] dark:text-white"
                  aria-hidden="true"
                />
                24/7 support available
              </span>
            </div>
          </div>

          {/* ── Content ── */}
          <div>
            {isLoading ? (
              /* Skeleton */
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[74px] rounded-2xl bg-[#0B1020]/5 dark:bg-white/5"
                  />
                ))}
              </div>
            ) : questions.length === 0 ? (
              /* Empty */
              <div className="py-[60px]">
                <div className="text-[#2F4BFF] mb-[14px] dark:text-white">
                  <HiOutlineChatBubbleLeftRight size={48} aria-hidden="true" />
                </div>
                <p className="text-lg font-extrabold tracking-tight mb-1.5">
                  No questions yet
                </p>
                <p className="text-sm font-medium text-[#0B1020]/70 dark:text-white/70">
                  Check back soon or reach out to our support team.
                </p>
              </div>
            ) : (
              /* FAQ List */
              <dl className="border-t border-[#0B1020]/10 dark:border-white/10">
                {questions.map((item: IFaqItem, index: number) => {
                  const isOpen = activeQuestion === item._id;
                  return (
                    <div
                      key={item._id || index}
                      className="border-b border-[#0B1020]/10 dark:border-white/10"
                    >
                      <dt>
                        <button
                          type="button"
                          className="-mx-3 my-1 flex w-[calc(100%+1.5rem)] cursor-pointer items-center justify-between gap-4 rounded-2xl border-none bg-transparent px-3 py-4 text-left transition-colors duration-200 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]"
                          onClick={() => toggleQuestion(item?._id as string)}
                          aria-expanded={isOpen}
                        >
                          {/* Icon badge */}
                          <span
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                              isOpen
                                ? "bg-[#FFD23F] text-[#0B1020]"
                                : "bg-[#0B1020]/5 text-[#0B1020]/70 dark:bg-white/10 dark:text-white/70"
                            }`}
                          >
                            <MdOutlineHelpOutline
                              size={20}
                              aria-hidden="true"
                            />
                          </span>

                          {/* Question text */}
                          <span
                            className={`flex-1 text-lg font-extrabold leading-[1.4] tracking-tight ${
                              isOpen
                                ? "text-[#2F4BFF] dark:text-white"
                                : "text-[#0B1020] dark:text-white"
                            }`}
                          >
                            {item.question}
                          </span>

                          {/* Toggle icon */}
                          <span
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                              isOpen
                                ? "bg-[#2F4BFF] text-white"
                                : "border border-[#0B1020]/10 text-[#0B1020]/70 dark:border-white/10 dark:text-white/70"
                            }`}
                          >
                            {isOpen ? (
                              <HiMiniMinus size={18} aria-hidden="true" />
                            ) : (
                              <HiMiniPlus size={18} aria-hidden="true" />
                            )}
                          </span>
                        </button>
                      </dt>

                      {isOpen && (
                        <dd className="pb-6 pl-14 pr-14">
                          <p className="m-0 text-base font-medium leading-[1.75] text-[#0B1020]/70 dark:text-white/70">
                            {item.answer}
                          </p>
                        </dd>
                      )}
                    </div>
                  );
                })}
              </dl>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
