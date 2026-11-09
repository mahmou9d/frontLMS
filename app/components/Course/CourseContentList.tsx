"use client";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { MdOutlineOndemandVideo } from "react-icons/md";

import { ICourseData } from "@/app/types";

type Props = {
  data: ICourseData[];
  activevideo?: number;
  setActiveVideo?: (index: number) => void;
  isDemo?: boolean;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const CourseContentList = ({
  data,
  activevideo,
  setActiveVideo,
  isDemo,
}: Props) => {
  const videoSections: string[] = [
    ...new Set<string>(data?.map((item) => item.videoSection)),
  ];

  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(videoSections.length > 0 ? [videoSections[0]] : []),
  );

  const toggleSection = (section: string) => {
    setVisibleSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  let totalCount = 0;

  return (
    <div className="flex flex-col">
      {videoSections.map((section, sectionIndex) => {
        const isOpen = visibleSections.has(section);
        const sectionVideos = data.filter(
          (item) => item.videoSection === section,
        );
        const sectionVideoCount = sectionVideos.length;
        const sectionMinutes = sectionVideos.reduce(
          (total, item) => total + Number(item.videoLength || 0),
          0,
        );
        const sectionHours = sectionMinutes / 60;
        const sectionStartIndex = totalCount;
        totalCount += sectionVideoCount;

        const panelId = `course-section-panel-${sectionIndex}`;

        return (
          <div
            key={section}
            className="border-b border-[#0B1020]/10 py-3 dark:border-white/10"
          >
            <button
              type="button"
              onClick={() => toggleSection(section)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-2xl px-2 text-left hover:bg-[#0B1020]/5 dark:hover:bg-white/10 ${focusRing}`}
            >
              <span className="min-w-0">
                <span className="block text-base font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                  {section}
                </span>
                <span className="block text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                  {sectionVideoCount}{" "}
                  {sectionVideoCount === 1 ? "lesson" : "lessons"},{" "}
                  {sectionHours < 1
                    ? `${sectionMinutes} mins`
                    : `${sectionHours.toFixed(1)} hours`}
                </span>
              </span>
              <FiChevronDown
                size={20}
                aria-hidden="true"
                className={`shrink-0 text-[#2F4BFF] transition-transform duration-150 motion-reduce:transition-none ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <ul id={panelId} className="mt-3 flex flex-col gap-2">
                {sectionVideos.map((item, index) => {
                  const videoIndex = sectionStartIndex + index;
                  const isActive = activevideo === videoIndex;

                  return (
                    <li key={`${section}-${index}`}>
                      <button
                        type="button"
                        disabled={isDemo}
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => setActiveVideo?.(videoIndex)}
                        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left transition-colors duration-150 motion-reduce:transition-none disabled:cursor-default ${focusRing} ${
                          isActive
                            ? "border-[#2F4BFF] bg-[#2F4BFF] text-white"
                            : "border-[#0B1020]/10 text-[#0B1020]/70 hover:bg-[#0B1020]/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              isActive
                                ? "bg-[#FFD23F] text-[#0B1020]"
                                : "bg-[#0B1020]/5 text-[#2F4BFF] dark:bg-white/10"
                            }`}
                          >
                            <MdOutlineOndemandVideo
                              size={16}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="truncate text-sm font-semibold">
                            {item.title}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 text-sm font-semibold ${
                            isActive ? "text-white/80" : ""
                          }`}
                        >
                          {item.videoLength} mins
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
