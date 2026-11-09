"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import {
  MdOutlineSecurity,
  MdOutlinePrivacyTip,
  MdOutlineManageAccounts,
  MdOutlineCookie,
  MdOutlineContactSupport,
  MdOutlineUpdate,
} from "react-icons/md";

/* ─── Static data ─────────────────────────────── */
const SECTIONS = [
  {
    icon: <MdOutlinePrivacyTip size={22} />,
    title: "Information we collect",
    id: "collect",
    content: [
      {
        subtitle: "Personal information",
        text: "When you register for an account, we collect information such as your name, email address, and password. If you purchase a course, we also collect billing information through our secure payment processors.",
      },
      {
        subtitle: "Usage data",
        text: "We automatically collect information about how you interact with our platform, including pages visited, courses accessed, time spent on lessons, and your progress through course materials.",
      },
      {
        subtitle: "Device information",
        text: "We collect device-specific information such as your IP address, browser type, operating system, and unique device identifiers to ensure a consistent and secure experience.",
      },
    ],
  },
  {
    icon: <MdOutlineSecurity size={22} />,
    title: "How we use your information",
    id: "use",
    content: [
      {
        subtitle: "Providing our services",
        text: "We use your information to operate the platform, process transactions, deliver course content, issue certificates, and provide customer support.",
      },
      {
        subtitle: "Improving our platform",
        text: "Usage data helps us understand how students learn best, which allows us to continually improve course quality, platform performance, and the overall learning experience.",
      },
      {
        subtitle: "Communications",
        text: "With your consent, we may send you newsletters, course recommendations, and promotional offers. You can opt out of marketing emails at any time from your account settings.",
      },
    ],
  },
  {
    icon: <HiOutlineShieldCheck size={22} />,
    title: "How we protect your data",
    id: "protect",
    content: [
      {
        subtitle: "Encryption",
        text: "All data transmitted between your browser and our servers is encrypted using industry-standard TLS (Transport Layer Security) protocols. Stored data is encrypted at rest.",
      },
      {
        subtitle: "Access controls",
        text: "We strictly limit employee access to personal data on a need-to-know basis. All staff with data access undergo security training and are bound by confidentiality agreements.",
      },
      {
        subtitle: "Security audits",
        text: "We conduct regular security assessments and vulnerability testing to ensure our systems remain secure. We promptly address any identified issues.",
      },
    ],
  },
  {
    icon: <MdOutlineManageAccounts size={22} />,
    title: "Your rights and choices",
    id: "rights",
    content: [
      {
        subtitle: "Access and portability",
        text: "You have the right to request a copy of the personal data we hold about you, in a commonly used, machine-readable format. Submit a request through your account settings or by contacting us.",
      },
      {
        subtitle: "Correction and deletion",
        text: "You can update most personal information directly from your profile. To delete your account and associated data, please contact our support team. Some data may be retained for legal compliance purposes.",
      },
      {
        subtitle: "Opt-out options",
        text: "You may opt out of marketing communications at any time. You can also adjust cookie preferences in your browser settings, though this may affect certain platform features.",
      },
    ],
  },
  {
    icon: <MdOutlineCookie size={22} />,
    title: "Cookies and tracking",
    id: "cookies",
    content: [
      {
        subtitle: "Essential cookies",
        text: "These are required for the platform to function. They enable core features like authentication, session management, and security. You cannot disable these cookies.",
      },
      {
        subtitle: "Analytics cookies",
        text: "We use analytics tools to understand how users navigate the platform. This helps us identify areas for improvement and enhance the learning experience.",
      },
      {
        subtitle: "Preference cookies",
        text: "These cookies remember your settings and preferences (such as dark mode or language) so you don't have to reconfigure them each visit.",
      },
    ],
  },
  {
    icon: <MdOutlineUpdate size={22} />,
    title: "Policy updates",
    id: "updates",
    content: [
      {
        subtitle: "Notification of changes",
        text: "We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or a prominent notice on our platform at least 30 days before the changes take effect.",
      },
      {
        subtitle: "Continued use",
        text: "Your continued use of the platform after policy changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this page periodically.",
      },
    ],
  },
  {
    icon: <MdOutlineContactSupport size={22} />,
    title: "Contact us",
    id: "contact",
    content: [
      {
        subtitle: "Data privacy team",
        text: "If you have questions about this Privacy Policy or wish to exercise your data rights, please contact our dedicated privacy team at privacy@elearning.com or through the support portal in your account.",
      },
      {
        subtitle: "Response time",
        text: "We aim to respond to all data-related requests within 30 days. For complex requests, we may extend this period by an additional 60 days with prior notification.",
      },
    ],
  },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";
// Cobalt outline would vanish on the cobalt panel, so links inside it use white.
const focusRingOnCobalt =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const Policy = () => {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  // Highlight the section currently being read.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="bg-white pb-20 text-[#0B1020] dark:bg-[#0B1020] dark:text-white">
        <div className="mx-auto max-w-[1180px] px-4 pt-[96px] sm:px-6 sm:pt-[104px]">
          <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-12">
            {/* Cobalt panel: title, status, and live table of contents */}
            <aside className="rounded-3xl bg-[#2F4BFF] p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <h1 className="mb-3 text-[clamp(2.25rem,5vw,3rem)] font-black leading-[1.05] tracking-tight">
                Privacy policy
              </h1>
              <p className="mb-5 text-[15px] leading-relaxed text-white/90">
                We take your privacy seriously. This policy explains how we
                collect, use, and protect your personal data when you use our
                platform.
              </p>
              <p className="mb-6 inline-flex h-10 items-center rounded-full border border-white/40 px-4 text-sm font-semibold">
                Last updated: August 2026
              </p>

              <nav aria-label="On this page">
                <ul className="-mx-6 flex gap-1.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
                  {SECTIONS.map((s) => {
                    const isActive = activeId === s.id;
                    return (
                      <li key={s.id} className="shrink-0">
                        <a
                          href={`#${s.id}`}
                          onClick={() => setActiveId(s.id)}
                          aria-current={isActive ? "location" : undefined}
                          className={`flex h-10 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${focusRingOnCobalt} ${
                            isActive
                              ? "bg-white text-[#2F4BFF]"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          {s.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Content: each point is a label and its explanation, side by side */}
            <div>
              {SECTIONS.map((section) => {
                const isActive = activeId === section.id;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    aria-labelledby={`${section.id}-title`}
                    className="scroll-mt-24 border-t border-[#0B1020]/10 py-10 first:border-t-0 first:pt-2 dark:border-white/10"
                  >
                    <div className="mb-4 flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 motion-reduce:transition-none ${
                          isActive
                            ? "bg-[#FFD23F] text-[#0B1020]"
                            : "bg-[#0B1020]/5 text-[#2F4BFF] dark:bg-white/10 dark:text-white"
                        }`}
                      >
                        {section.icon}
                      </div>
                      <h2
                        id={`${section.id}-title`}
                        className="text-2xl font-extrabold tracking-tight sm:text-3xl"
                      >
                        {section.title}
                      </h2>
                    </div>
                    <dl>
                      {section.content.map((item, j) => (
                        <div
                          key={j}
                          className="grid gap-1.5 border-t border-[#0B1020]/10 py-5 first:border-t-0 dark:border-white/10 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-8"
                        >
                          <dt className="text-base font-bold">
                            {item.subtitle}
                          </dt>
                          <dd className="text-[15px] leading-[1.75] text-[#0B1020]/70 dark:text-white/70">
                            {item.text}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                );
              })}

              {/* Accept strip: the one loud button */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-[#0B1020]/10 px-6 py-7 dark:border-white/10 sm:px-8">
                <div>
                  <p className="mb-1 text-lg font-extrabold tracking-tight">
                    You&apos;re all caught up
                  </p>
                  <p className="text-sm text-[#0B1020]/70 dark:text-white/70">
                    By using ELearning, you agree to this Privacy Policy.
                  </p>
                </div>
                <a
                  href="/courses"
                  className={`inline-flex h-10 items-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 font-bold whitespace-nowrap text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${focusRing}`}
                >
                  Start learning
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policy;
