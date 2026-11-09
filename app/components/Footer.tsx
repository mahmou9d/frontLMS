import Link from "next/link";
import React from "react";
import {
  AiOutlineGithub,
  AiOutlineYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FiPhone, FiMail, FiMapPin, FiLinkedin } from "react-icons/fi";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const socialCls = `flex h-10 w-10 items-center justify-center rounded-full border border-[#0B1020]/10 text-lg text-[#0B1020]/70 no-underline transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 ${focusRing}`;

const navLinkCls = `-ml-3 inline-flex h-10 w-fit items-center rounded-full px-3 text-sm font-semibold text-[#0B1020]/70 no-underline transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 ${focusRing}`;

const headingCls = "m-0 text-base font-extrabold tracking-tight";

const badgeCls =
  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0B1020]/5 text-base text-[#2F4BFF] dark:bg-white/10 dark:text-white";

const contactLinkCls = `inline-block py-1 font-semibold text-[#0B1020] no-underline hover:underline dark:text-white ${focusRing}`;

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-[#0B1020]/10 bg-white pt-20 pb-[30px] text-[#0B1020] dark:border-white/10 dark:bg-[#0B1020] dark:text-white">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-[50px] grid grid-cols-1 gap-[35px] sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-[18px]">
            <Link
              href="/"
              className={`group flex w-fit items-center gap-2.5 rounded-full no-underline ${focusRing}`}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F4BFF] transition-transform duration-150 group-hover:-rotate-6 motion-reduce:transition-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 4 2.5 9 12 14l7.5-4v5.5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.5 12v4.2c0 1 2.5 2.3 5.5 2.3s5.5-1.3 5.5-2.3V12"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#FFD23F] ring-2 ring-white dark:ring-[#0B1020]" />
              </div>
              <span className="text-[1.2rem] font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                ELearning
              </span>
            </Link>
            <p className="m-0 max-w-[400px] text-sm font-medium leading-[1.65] text-[#0B1020]/70 dark:text-white/70">
              Empowering students worldwide with premium, project-based online
              courses. Learn at your own pace from industry leaders and unlock
              your potential.
            </p>
            <div className="mt-1.5 flex items-center gap-2.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={socialCls}
                aria-label="GitHub"
              >
                <AiOutlineGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={socialCls}
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={socialCls}
                aria-label="Twitter"
              >
                <AiOutlineTwitter />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={socialCls}
                aria-label="YouTube"
              >
                <AiOutlineYoutube />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className={headingCls}>Explore</h4>
            <ul className="m-0 flex list-none flex-col p-0">
              <li>
                <Link href="/courses" className={navLinkCls}>
                  Our courses
                </Link>
              </li>
              <li>
                <Link href="/about" className={navLinkCls}>
                  Our story
                </Link>
              </li>
              <li>
                <Link href="/profile" className={navLinkCls}>
                  User dashboard
                </Link>
              </li>
              <li>
                <Link href="/about#faq" className={navLinkCls}>
                  Help &amp; FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Resources */}
          <div className="flex flex-col gap-3">
            <h4 className={headingCls}>Legal</h4>
            <ul className="m-0 flex list-none flex-col p-0">
              <li>
                <Link href="/about" className={navLinkCls}>
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkCls}>
                  Terms of use
                </Link>
              </li>
              <li>
                <Link href="#" className={navLinkCls}>
                  Refund policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-[18px]">
            <h4 className={headingCls}>Contact info</h4>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start gap-3 text-sm leading-[1.5] text-[#0B1020]/70 dark:text-white/70">
                <div className={badgeCls}>
                  <FiPhone aria-hidden="true" />
                </div>
                <div className="[&_p]:m-0">
                  <p className="font-medium">Call us:</p>
                  <a href="tel:01009014597" className={contactLinkCls}>
                    01009014597
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm leading-[1.5] text-[#0B1020]/70 dark:text-white/70">
                <div className={badgeCls}>
                  <FiMail aria-hidden="true" />
                </div>
                <div className="min-w-0 [&_p]:m-0">
                  <p className="font-medium">Mail us:</p>
                  <a
                    href="mailto:mohnud0987@gmail.com"
                    className={`${contactLinkCls} break-all`}
                  >
                    mohnud0987@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm leading-[1.5] text-[#0B1020]/70 dark:text-white/70">
                <div className={badgeCls}>
                  <FiMapPin aria-hidden="true" />
                </div>
                <div className="[&_p]:m-0">
                  <p className="font-medium">Address:</p>
                  <span className="inline-block py-1 font-semibold text-[#0B1020] dark:text-white">
                    Cairo, Egypt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-[#0B1020]/10 pt-[25px] dark:border-white/10">
          <p className="m-0 text-sm font-medium text-[#0B1020]/70 dark:text-white/70">
            Copyright &copy; 2026 ELearning Platforms Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-1">
            <Link href="/about" className={`${navLinkCls} !ml-0`}>
              Privacy
            </Link>
            <Link href="#" className={`${navLinkCls} !ml-0`}>
              Terms
            </Link>
            <Link href="#" className={`${navLinkCls} !ml-0`}>
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
