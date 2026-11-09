"use client";
import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import {
  HiOutlineAcademicCap,
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlinePaintBrush,
  HiOutlineCommandLine,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { useState, useEffect } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/page";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

/* Palette
   cobalt  #2F4BFF  – brand (topics panel, focus, active states)
   sun     #FFD23F  – the one loud accent (Search button, hovered topic badge)
   ink     #0B1020  – text / dark surface
*/

const STUDENT_IMGS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
];

const SEARCH_PLACEHOLDERS = [
  "React & Next.js...",
  "Machine Learning...",
  "UI / UX Design...",
  "Python & Django...",
  "Data Science...",
];

const TOPICS = [
  { label: "React & Next.js", query: "React", Icon: HiOutlineCodeBracket },
  {
    label: "Machine learning",
    query: "Machine Learning",
    Icon: HiOutlineCpuChip,
  },
  { label: "UI / UX design", query: "UI UX Design", Icon: HiOutlinePaintBrush },
  { label: "Python & Django", query: "Python", Icon: HiOutlineCommandLine },
  { label: "Data science", query: "Data Science", Icon: HiOutlineChartBar },
];

const STATS = [
  { value: "10k+", label: "Online courses" },
  { value: "1k+", label: "Active students" },
  { value: "4.9", label: "Average rating" },
];

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const Hero = () => {
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");
  const [phIdx, setPhIdx] = useState(0);
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const router = useRouter();

  /* typewriter placeholder (static when the user prefers reduced motion) */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(SEARCH_PLACEHOLDERS[0]);
      return;
    }
    let i = 0;
    let growing = true;
    const word = SEARCH_PLACEHOLDERS[phIdx];
    const tick = setInterval(() => {
      if (growing) {
        setTyped(word.slice(0, i + 1));
        i++;
        if (i === word.length) growing = false;
      } else {
        setTyped(word.slice(0, i - 1));
        i--;
        if (i === 0) {
          growing = true;
          setPhIdx((p) => (p + 1) % SEARCH_PLACEHOLDERS.length);
          clearInterval(tick);
        }
      }
    }, 75);
    return () => clearInterval(tick);
  }, [phIdx]);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/courses?title=${encodeURIComponent(q)}`);
  };

  if (isLoading) return <Loader />;

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-20">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* Left: message + search */}
        <div className="flex flex-col items-start gap-6 text-left sm:gap-8">
          <h1 className="m-0 w-full break-words text-[clamp(2.25rem,10.5vw,2.9rem)] font-black leading-[1.08] tracking-tight text-[#0B1020] sm:text-5xl lg:text-6xl lg:leading-[1.05] dark:text-white">
            Improve your{" "}
            <span className="text-[#2F4BFF]">
              {data?.layout?.banner?.title}
            </span>{" "}
            experience, better instantly
          </h1>

          {/* Search – stacked on phones, one pill from sm up */}
          <div className="flex w-full max-w-[560px] flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border-2 sm:border-[#0B1020]/10 sm:bg-white sm:p-1.5 sm:pl-5 sm:transition-colors sm:duration-200 sm:focus-within:border-[#2F4BFF] sm:focus-within:outline sm:focus-within:outline-2 sm:focus-within:outline-offset-2 sm:focus-within:outline-[#2F4BFF] motion-reduce:transition-none dark:sm:border-white/10 dark:sm:bg-[#0B1020]">
            <div className="flex h-12 items-center gap-2 rounded-full border-2 border-[#0B1020]/10 bg-white px-4 transition-colors duration-200 focus-within:border-[#2F4BFF] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#2F4BFF] motion-reduce:transition-none sm:h-auto sm:flex-1 sm:border-0 sm:bg-transparent sm:px-0 sm:focus-within:outline-none dark:border-white/10 dark:bg-[#0B1020] dark:sm:bg-transparent">
              <BiSearch
                size={22}
                className="flex-shrink-0 text-[#0B1020]/70 dark:text-white/70"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={`Search for ${typed}`}
                aria-label="Search courses"
                enterKeyHint="search"
                className="h-11 min-w-0 flex-1 truncate border-none bg-transparent px-1 text-base text-[#0B1020] outline-none [caret-color:#2F4BFF] placeholder:text-[#0B1020]/50 dark:text-white dark:placeholder:text-white/50"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className={`flex h-12 w-full flex-shrink-0 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-6 text-base font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none sm:h-11 sm:w-auto sm:text-sm dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${FOCUS}`}
            >
              Search
            </button>
          </div>

          {/* Social proof + secondary action */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex">
                {STUDENT_IMGS.map((src, i) => (
                  <div
                    key={src}
                    className="-ml-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-[3px] border-white first:ml-0 dark:border-[#0B1020]"
                    style={{ zIndex: STUDENT_IMGS.length - i }}
                  >
                    <Image
                      src={src}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="-ml-3 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border-[3px] border-white bg-[#2F4BFF] text-xs font-extrabold text-white dark:border-[#0B1020]">
                  +2k
                </div>
              </div>
              <p className="m-0 text-sm leading-snug text-[#0B1020]/70 dark:text-white/70">
                <strong className="font-bold text-[#0B1020] dark:text-white">
                  1k+ students
                </strong>
                <br />
                already learning here
              </p>
            </div>

            <Link
              href="#courses"
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#0B1020]/10 px-5 text-sm font-semibold text-[#0B1020] transition-colors duration-200 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`}
            >
              <HiOutlineAcademicCap
                size={18}
                className="text-[#2F4BFF] dark:text-white"
                aria-hidden
              />
              Explore courses
            </Link>
          </div>

          {/* Stats */}
          <dl className="m-0 grid w-full max-w-[560px] grid-cols-3 border-t border-[#0B1020]/10 pt-6 dark:border-white/10">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse items-start gap-1 ${
                  i > 0
                    ? "border-l border-[#0B1020]/10 pl-4 dark:border-white/10"
                    : ""
                }`}
              >
                <dt className="text-xs leading-tight text-[#0B1020]/70 sm:text-sm dark:text-white/70">
                  {s.label}
                </dt>
                <dd className="m-0 text-2xl font-black leading-none tracking-tight text-[#0B1020] sm:text-3xl dark:text-white">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: topic shortcuts (same language as the mobile menu) */}
        <nav
          aria-label="Popular topics"
          className="rounded-3xl bg-[#2F4BFF] p-3 sm:p-4"
        >
          <p className="m-0 px-3 pt-2 pb-4 text-xl font-extrabold tracking-tight text-white">
            Start with a popular topic
          </p>
          <ul className="m-0 flex list-none flex-col gap-1 rounded-3xl bg-white p-2 dark:bg-[#0B1020]">
            {TOPICS.map(({ label, query: q, Icon }) => (
              <li key={label}>
                <Link
                  href={`/courses?title=${encodeURIComponent(q)}`}
                  className={`group flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2 text-xl font-extrabold tracking-tight text-[#0B1020] transition-colors duration-150 hover:bg-[#2F4BFF] hover:text-white motion-reduce:transition-none dark:text-white ${FOCUS}`}
                >
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#2F4BFF]/10 text-[#2F4BFF] transition-colors duration-150 group-hover:bg-[#FFD23F] group-hover:text-[#0B1020] motion-reduce:transition-none dark:bg-white/10 dark:text-white">
                    <Icon size={22} aria-hidden />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Hero;
