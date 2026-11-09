"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/page";
import Header from "../components/Header";
import Loader from "../components/Loader/Loader";
import Heading from "../utills/Heading";
import CoursesCard from "../components/Course/CoursesCard";
import Footer from "../components/Footer";
import { HiOutlineAcademicCap } from "react-icons/hi2";

import { ICourse, ICategory } from "@/app/types";

const Page = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("title") || "";
  const { data, isLoading } = useGetUserAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [category, setCategory] = useState("All");

  const categories = categoriesData?.layout?.categories;

  // Filter courses based on both selected category and search query
  const filteredCourses = useMemo(() => {
    let list: ICourse[] = data?.courses ? [...data.courses] : [];

    // Filter by category
    if (category !== "All") {
      list = list.filter((item: ICourse) => item.categories === category);
    }

    // Filter by search query
    if (query.trim()) {
      list = list.filter((item: ICourse) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return list;
  }, [data, category, query]);

  useEffect(() => {
    setCourses(filteredCourses);
  }, [filteredCourses]);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

  // Category rows: a horizontal scroller on mobile, a sticky vertical list on desktop.
  const pillBase = `h-10 shrink-0 px-5 rounded-full text-sm font-semibold whitespace-nowrap text-left cursor-pointer transition-colors duration-150 motion-reduce:transition-none ${focusRing}`;
  const pillInactive =
    "text-[#0B1020]/70 hover:bg-[#0B1020]/5 dark:text-white/70 dark:hover:bg-white/10";
  const pillActive = "bg-[#2F4BFF] text-white";

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
            activeItem={1}
          />
          <Heading
            title="All Courses - ELearning"
            description="ELearning is a premium platform for learning and teaching online."
            keywords="LMS, online learning, teaching, education, programming, technology"
          />

          <section className="min-h-screen bg-white pt-[110px] pb-20 text-[#0B1020] dark:bg-[#0B1020] dark:text-white">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
              {/* Intro: left-aligned, weight does the work */}
              <div className="mb-8 flex flex-col gap-4 border-b border-[#0B1020]/10 pb-8 dark:border-white/10 md:flex-row md:items-end md:justify-between">
                <div className="max-w-[640px]">
                  <h1 className="mb-3 text-[clamp(2.25rem,6vw,3.75rem)] font-black leading-[1.05] tracking-tight">
                    Learn something
                    <br />
                    you can use{" "}
                    <span className="text-[#2F4BFF] dark:text-white">
                      this week.
                    </span>
                  </h1>
                  <p className="text-base leading-relaxed text-[#0B1020]/70 dark:text-white/70">
                    Pick a category, find a course, and start building skills
                    for your career.
                  </p>
                </div>

                <p
                  className="text-sm font-medium text-[#0B1020]/70 dark:text-white/70 md:text-right"
                  aria-live="polite"
                >
                  <strong className="block text-4xl font-black leading-none tracking-tight text-[#0B1020] dark:text-white">
                    {courses?.length || 0}
                  </strong>
                  course{courses?.length !== 1 ? "s" : ""}
                  {query && ` matching "${query}"`}
                  {category !== "All" && ` in "${category}"`}
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                {/* Categories */}
                <nav
                  aria-label="Course categories"
                  className="lg:self-start lg:sticky lg:top-24"
                >
                  <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
                    <button
                      type="button"
                      aria-pressed={category === "All"}
                      className={`${pillBase} ${category === "All" ? pillActive : pillInactive}`}
                      onClick={() => setCategory("All")}
                    >
                      All courses
                    </button>
                    {categories &&
                      categories.map((i: ICategory, index: number) => (
                        <button
                          type="button"
                          key={index}
                          aria-pressed={category === i.title}
                          className={`${pillBase} ${category === i.title ? pillActive : pillInactive}`}
                          onClick={() => setCategory(i.title || "")}
                        >
                          {i.title}
                        </button>
                      ))}
                  </div>
                </nav>

                {/* Courses */}
                <div>
                  {courses && courses.length === 0 ? (
                    <div className="rounded-3xl border border-[#0B1020]/10 px-6 py-16 text-center dark:border-white/10">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0B1020]/5 text-[#2F4BFF] dark:bg-white/10 dark:text-white">
                        <HiOutlineAcademicCap size={28} aria-hidden="true" />
                      </div>
                      <h3 className="mb-2 text-xl font-extrabold">
                        No courses found
                      </h3>
                      <p className="mx-auto mb-6 max-w-[400px] text-sm text-[#0B1020]/70 dark:text-white/70">
                        Nothing matches your current filters. Select another
                        category or change your search to see more courses.
                      </p>
                      {category !== "All" && (
                        <button
                          type="button"
                          onClick={() => setCategory("All")}
                          className={`h-10 rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${focusRing}`}
                        >
                          Show all courses
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr))]">
                      {courses &&
                        courses.map((item: ICourse, index: number) => (
                          <div key={item._id || index}>
                            <CoursesCard course={item} />
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
