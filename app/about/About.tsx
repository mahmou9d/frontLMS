"use client";

import {
  HiOutlineAcademicCap,
  HiOutlineRocketLaunch,
  HiOutlineUserGroup,
  HiOutlineTrophy,
  HiOutlineBookOpen,
  HiOutlineCheck,
} from "react-icons/hi2";
import {
  MdOutlineVerified,
  MdOutlinePeopleAlt,
  MdOutlineSchool,
  MdOutlinePlayCircle,
  MdOutlineStar,
} from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { FiTarget } from "react-icons/fi";

const STATS = [
  {
    icon: <MdOutlineSchool size={24} />,
    num: "10+",
    label: "Online courses",
    color: "green",
  },
  {
    icon: <MdOutlinePeopleAlt size={24} />,
    num: "1k+",
    label: "Active students",
    color: "blue",
  },
  {
    icon: <MdOutlinePlayCircle size={24} />,
    num: "40+",
    label: "Video lessons",
    color: "purple",
  },
  {
    icon: <MdOutlineStar size={24} />,
    num: "4.9★",
    label: "Average rating",
    color: "amber",
  },
];

const TEAM = [
  {
    name: "Dr. Ahmed Hassan",
    role: "Founder & CEO",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Former Google engineer with 15+ years in education technology. Passionate about democratizing access to world-class learning.",
  },
  {
    name: "Sarah Mitchell",
    role: "Head of Curriculum",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Award-winning educator with a PhD in Instructional Design. Ensures every course meets the highest academic standards.",
  },
  {
    name: "James Rodriguez",
    role: "CTO",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Full-stack architect and open-source contributor. Leads our platform development with a focus on performance and accessibility.",
  },
  {
    name: "Aisha Patel",
    role: "Head of Community",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Building vibrant learning communities for 10+ years. Champions student success and instructor growth across the platform.",
  },
];

const VALUES = [
  {
    Icon: FiTarget,
    title: "Mission-driven",
    desc: "We believe quality education should be accessible to everyone, everywhere, regardless of background or resources.",
  },
  {
    Icon: HiOutlineRocketLaunch,
    title: "Innovation first",
    desc: "We continuously push the boundaries of online learning through cutting-edge technology and pedagogy.",
  },
  {
    Icon: HiOutlineUserGroup,
    title: "Community focus",
    desc: "Every student and instructor is valued. We build a supportive ecosystem where people grow together.",
  },
  {
    Icon: HiOutlineTrophy,
    title: "Excellence always",
    desc: "From course content to platform experience, we obsess over quality and hold ourselves to the highest standards.",
  },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

/* ─── Component ──────────────────────────────────────── */
const About = () => {
  return (
    <>
      <div className="bg-white text-[#0B1020] dark:bg-[#0B1020] dark:text-white">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          {/* Hero */}
          <section className="pb-14 pt-[110px] sm:pb-20 sm:pt-[130px]">
            <h1 className="mb-5 max-w-[820px] text-[clamp(2.25rem,6.5vw,4.25rem)] font-black leading-[1.05] tracking-tight">
              Empowering learners,{" "}
              <span className="text-[#2F4BFF] dark:text-white">
                transforming lives.
              </span>
            </h1>
            <p className="mb-8 max-w-[620px] text-[17px] leading-relaxed text-[#0B1020]/70 dark:text-white/70">
              We&apos;re on a mission to make world-class education accessible
              to everyone, everywhere. Since 2020, we&apos;ve helped over
              500,000 learners unlock their potential and build careers they
              love.
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {[
                { Icon: MdOutlineVerified, label: "Certified instructors" },
                { Icon: HiOutlineAcademicCap, label: "Industry-led content" },
                { Icon: MdOutlinePeopleAlt, label: "Global community" },
              ].map(({ Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold dark:border-white/10"
                >
                  <Icon
                    size={18}
                    className="text-[#2F4BFF] dark:text-white"
                    aria-hidden="true"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </section>

          {/* Stats: one panel, divided cells */}
          <section className="pb-20 sm:pb-28">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[#0B1020]/10 bg-[#0B1020]/10 dark:border-white/10 dark:bg-white/10 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 bg-white px-5 py-7 dark:bg-[#0B1020] sm:px-7"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1020]/5 text-[#2F4BFF] dark:bg-white/10 dark:text-white">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-4xl font-black leading-none tracking-tight">
                      {s.num}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Story */}
          <section className="pb-20 sm:pb-28">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <div className="relative">
                <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-[#2F4BFF] text-white">
                  <HiOutlineBookOpen size={80} aria-hidden="true" />
                </div>
                <div className="absolute right-3 top-5 flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 bg-white px-4 text-sm font-bold text-[#0B1020] shadow-[0_10px_30px_-12px_rgba(11,16,32,0.25)] dark:border-white/10 dark:bg-[#0B1020] dark:text-white sm:-right-4">
                  <MdOutlinePeopleAlt
                    size={18}
                    className="text-[#2F4BFF] dark:text-white"
                    aria-hidden="true"
                  />
                  1k+ students
                </div>
                <div className="absolute bottom-6 left-3 flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 bg-white px-4 text-sm font-bold text-[#0B1020] shadow-[0_10px_30px_-12px_rgba(11,16,32,0.25)] dark:border-white/10 dark:bg-[#0B1020] dark:text-white sm:-left-4">
                  <AiFillStar
                    size={16}
                    className="text-[#2F4BFF] dark:text-white"
                    aria-hidden="true"
                  />
                  4.9 / 5 rating
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.1] tracking-tight">
                  Built by learners, for learners
                </h2>
                <p className="text-base leading-[1.8] text-[#0B1020]/70 dark:text-white/70">
                  ELearning was born from a simple frustration: great education
                  was too expensive and inaccessible. Founded in 2020 by a team
                  of engineers, educators, and designers, we set out to change
                  that.
                </p>
                <p className="text-base leading-[1.8] text-[#0B1020]/70 dark:text-white/70">
                  Today we partner with leading industry experts to bring you
                  up-to-date, practical courses that get you job-ready fast.
                  Every course is reviewed, every instructor is vetted, and
                  every student is supported.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Courses crafted by top industry professionals",
                    "Project-based learning for real-world skills",
                    "Lifetime access to all purchased content",
                    "Certificate upon course completion",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[15px] font-medium"
                    >
                      <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#2F4BFF] text-white">
                        <HiOutlineCheck
                          size={12}
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Values: heading beside a ruled list, not a card grid */}
          <section className="pb-20 sm:pb-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.1] tracking-tight">
                  What we stand for
                </h2>
                <p className="text-base leading-relaxed text-[#0B1020]/70 dark:text-white/70">
                  Our values guide every decision we make, from how we build our
                  platform to how we support our community.
                </p>
              </div>
              <ul className="border-t border-[#0B1020]/10 dark:border-white/10">
                {VALUES.map((v, i) => {
                  const Icon = v.Icon;
                  return (
                    <li
                      key={i}
                      className="flex gap-4 border-b border-[#0B1020]/10 py-6 dark:border-white/10"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1020]/5 text-[#2F4BFF] dark:bg-white/10 dark:text-white">
                        <Icon size={22} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="mb-1.5 text-xl font-extrabold tracking-tight">
                          {v.title}
                        </h3>
                        <p className="text-[15px] leading-relaxed text-[#0B1020]/70 dark:text-white/70">
                          {v.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Team: open two-column list with yellow-ring avatars */}
          <section className="pb-20 sm:pb-28">
            <div className="mb-10 max-w-[620px]">
              <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.1] tracking-tight">
                Meet the people behind ELearning
              </h2>
              <p className="text-base leading-relaxed text-[#0B1020]/70 dark:text-white/70">
                A passionate team of educators, engineers and designers
                committed to building the best learning experience on the
                planet.
              </p>
            </div>
            <ul className="grid gap-x-12 md:grid-cols-2">
              {TEAM.map((member, i) => (
                <li
                  key={i}
                  className="flex gap-5 border-t border-[#0B1020]/10 py-7 dark:border-white/10"
                >
                  <div className="h-[84px] w-[84px] shrink-0 rounded-full bg-[#FFD23F] p-[3px]">
                    <div className="h-full w-full overflow-hidden rounded-full border-2 border-white dark:border-[#0B1020]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatar}
                        alt={member.name}
                        loading="lazy"
                        className="block h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight">
                      {member.name}
                    </h3>
                    <p className="mb-2 text-sm font-semibold text-[#2F4BFF] dark:text-white">
                      {member.role}
                    </p>
                    <p className="text-sm leading-relaxed text-[#0B1020]/70 dark:text-white/70">
                      {member.bio}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA: the one loud element */}
          <section className="pb-24 sm:pb-[110px]">
            <div className="rounded-3xl bg-[#0B1020] px-6 py-12 text-center dark:border dark:border-white/10 dark:bg-white/10 sm:px-12 sm:py-16">
              <h2 className="mx-auto mb-3.5 max-w-[640px] text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.1] tracking-tight text-white">
                Ready to start learning?
              </h2>
              <p className="mx-auto mb-8 max-w-[520px] text-base leading-relaxed text-white/70">
                Join over 1,000 students worldwide who are already unlocking
                their potential with ELearning.
              </p>
              <a
                href="/courses"
                className={`inline-flex h-10 items-center gap-2 rounded-full border-2 border-white bg-[#FFD23F] px-5 font-bold text-[#0B1020] shadow-[3px_3px_0_#fff] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#fff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none ${focusRing}`}
              >
                <HiOutlineAcademicCap size={20} aria-hidden="true" />
                Explore all courses
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
