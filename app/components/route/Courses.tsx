"use client";
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState, useMemo } from "react";
import CoursesCard from "../Course/CoursesCard";
import { ICourse } from "@/app/types";
import { BiSearch } from "react-icons/bi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { AiOutlineAppstore, AiOutlineOrderedList } from "react-icons/ai";

/* Palette
   cobalt  #2F4BFF  – brand (active states, focus)
   sun     #FFD23F  – the one loud accent (empty-state button only)
   ink     #0B1020  – text / dark surface
*/

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

/* ─── Component ──────────────────────────────────────────── */
const Courses = () => {
  const { data, isLoading } = useGetUserAllCoursesQuery({});
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (data?.courses) setCourses(data.courses);
  }, [data]);

  /* ── Dynamic categories from data ── */
  const categories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    courses.forEach((c) => {
      if (c.categories) cats.add(c.categories);
    });
    return Array.from(cats);
  }, [courses]);

  /* ── Filter + Sort ── */
  const filtered = useMemo(() => {
    let list = [...courses];

    if (activeCategory !== "All")
      list = list.filter((c) => c.categories === activeCategory);

    if (search.trim())
      list = list.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()),
      );

    return list;
  }, [courses, search, activeCategory]);

  const countFor = (cat: string) =>
    cat === "All"
      ? courses.length
      : courses.filter((c) => c.categories === cat).length;

  const hasSidebar = categories.length > 1;

  const viewBtn = (active: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-full text-lg transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${
      active
        ? "bg-[#2F4BFF] text-white"
        : "text-[#0B1020]/70 hover:bg-[#0B1020]/5 dark:text-white/70 dark:hover:bg-white/10"
    }`;

  const skeletonBar =
    "bg-[#0B1020]/5 dark:bg-white/10 animate-pulse motion-reduce:animate-none";

  const gridCols =
    view === "grid"
      ? "grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6"
      : "grid-cols-1 gap-4";

  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden pb-20 pt-[100px]"
        id="courses"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          {/* ── Section Header ── */}
          <div className="mb-10 flex flex-col items-center justify-center gap-8 lg:mb-12 ">
            {/* ── Section Header ── */}
            <div className="mb-10 flex flex-col items-center justify-center gap-4 rounded-3xl bg-[#2F4BFF] p-6 text-left sm:p-10 lg:mb-12 lg:p-12">
              <h2 className="m-0  text-[clamp(2rem,4vw,3rem)] text-center font-black leading-[1.1] tracking-tight text-white">
                Expand your career opportunities with our courses
              </h2>
              <p className="m-0 text-base leading-relaxed text-white/90 sm:text-lg">
                Learn from experienced instructors at your own pace and move
                your career forward today.
              </p>
            </div>
          </div>

          <div
            className={`grid items-start gap-6 lg:gap-10 ${
              hasSidebar ? "lg:grid-cols-[260px_minmax(0,1fr)]" : ""
            }`}
          >
            {/* ── Categories: scrolling pills on phones, rows on desktop ── */}
            {hasSidebar && (
              <nav
                aria-label="Filter by category"
                className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:sticky lg:top-24 lg:mx-0 lg:overflow-visible lg:rounded-3xl lg:border lg:border-[#0B1020]/10 lg:p-2 lg:px-2 dark:lg:border-white/10"
              >
                <ul className="m-0 flex list-none gap-2 p-0 lg:flex-col lg:gap-1">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <li key={cat} className="flex-shrink-0">
                        <button
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setActiveCategory(cat)}
                          className={`flex h-10 w-full items-center justify-between gap-3 whitespace-nowrap rounded-full border px-5 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none lg:h-12 lg:rounded-2xl lg:border-0 lg:px-4 lg:text-base lg:font-bold ${FOCUS} ${
                            isActive
                              ? "border-[#2F4BFF] bg-[#2F4BFF] text-white"
                              : "border-[#0B1020]/10 text-[#0B1020]/70 hover:bg-[#0B1020]/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                          }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`hidden text-sm font-semibold lg:inline ${
                              isActive
                                ? "text-white/70"
                                : "text-[#0B1020]/50 dark:text-white/50"
                            }`}
                          >
                            {countFor(cat)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}

            {/* ── Results ── */}
            <div className="min-w-0">
              {/* Controls */}
              <div className="mb-5 flex items-center gap-3">
                <div className="min-w-0 flex-1 sm:max-w-[420px]">
                  <div className="flex h-12 items-center gap-2 rounded-full border-2 border-[#0B1020]/10 bg-white px-4 transition-colors duration-200 focus-within:border-[#2F4BFF] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#2F4BFF] motion-reduce:transition-none dark:border-white/10 dark:bg-[#0B1020]">
                    <BiSearch
                      size={20}
                      className="flex-shrink-0 text-[#0B1020]/70 dark:text-white/70"
                      aria-hidden
                    />
                    <input
                      type="text"
                      className="h-11 min-w-0 flex-1 border-none bg-transparent px-1 text-base text-[#0B1020] outline-none [caret-color:#2F4BFF] placeholder:text-[#0B1020]/50 dark:text-white dark:placeholder:text-white/50"
                      placeholder="Search courses"
                      aria-label="Search courses"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  role="group"
                  aria-label="Course layout"
                  className="ml-auto flex flex-shrink-0 items-center gap-1 rounded-full border border-[#0B1020]/10 p-1 dark:border-white/10"
                >
                  <button
                    type="button"
                    className={viewBtn(view === "grid")}
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                  >
                    <AiOutlineAppstore aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={viewBtn(view === "list")}
                    onClick={() => setView("list")}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                  >
                    <AiOutlineOrderedList aria-hidden />
                  </button>
                </div>
              </div>

              {/* Result info */}
              {!isLoading && (
                <p
                  aria-live="polite"
                  className="mb-5 text-sm text-[#0B1020]/70 dark:text-white/70"
                >
                  Showing{" "}
                  <strong className="font-bold text-[#0B1020] dark:text-white">
                    {filtered.length}
                  </strong>{" "}
                  course
                  {filtered.length !== 1 ? "s" : ""}
                  {search && ` for "${search}"`}
                  {activeCategory !== "All" && ` in ${activeCategory}`}
                </p>
              )}

              {/* Content */}
              {isLoading ? (
                <div className={`grid ${gridCols}`} aria-busy="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-3xl border border-[#0B1020]/10 dark:border-white/10"
                    >
                      <div className={`h-[180px] ${skeletonBar}`} />
                      <div className="flex flex-col gap-2.5 p-[18px]">
                        <div
                          className={`h-3 w-[80%] rounded-full ${skeletonBar}`}
                        />
                        <div
                          className={`h-3 w-[55%] rounded-full ${skeletonBar}`}
                        />
                        <div
                          className={`h-3 w-[35%] rounded-full ${skeletonBar}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-[#0B1020]/10 px-5 py-16 text-center dark:border-white/10">
                  <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#2F4BFF]/10 text-[#2F4BFF] dark:bg-white/10 dark:text-white">
                    <HiOutlineAcademicCap size={32} aria-hidden />
                  </div>
                  <p className="m-0 mb-2 text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                    No courses match your search
                  </p>
                  <p className="m-0 mb-6 max-w-[40ch] text-sm leading-relaxed text-[#0B1020]/70 dark:text-white/70">
                    Check the spelling, try a shorter keyword, or clear the
                    filters to see every course.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All");
                    }}
                    className={`inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${FOCUS}`}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className={`grid ${gridCols}`}>
                  {filtered.map((course: ICourse, index: number) => (
                    <div key={course._id || index}>
                      <CoursesCard course={course} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Courses;
