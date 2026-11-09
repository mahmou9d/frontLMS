"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { FiChevronDown, FiLink, FiPlus } from "react-icons/fi";
import { ICourseContentItem, ILink } from "@/app/types";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: ICourseContentItem[];
  setCourseContentData: (courseContentData: ICourseContentItem[]) => void;
  handlerSumbit: () => void;
};

type Section = { name: string; start: number; end: number };

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const FIELD = `box-border h-11 w-full rounded-2xl border border-[#0B1020]/10 bg-white px-4 text-sm font-semibold text-[#0B1020] placeholder:text-[#0B1020]/70 focus:border-[#2F4BFF] ${FOCUS} dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/70`;

const LABEL = "mb-1.5 block text-sm font-bold text-[#0B1020] dark:text-white";

// Round 40px icon button: quiet by default, ink/5 on hover
const ICON_BTN = `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 enabled:hover:bg-[#0B1020]/5 enabled:hover:text-[#0B1020] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none dark:text-white/70 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-white ${FOCUS}`;

// Quiet outlined pill for secondary actions
const PILL = `inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-bold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`;

// Signature hard-shadow CTA
const CTA = `inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-6 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${FOCUS}`;

const INCOMPLETE_MESSAGE =
  "Fill in the title, description and section of the last lesson first.";

const emptyLesson = (videoSection: string): ICourseContentItem => ({
  videoUrl: "",
  title: "",
  description: "",
  videoSection,
  videoLength: "",
  links: [{ title: "", url: "" }],
  suggestion: "",
});

const isLessonIncomplete = (item?: ICourseContentItem) =>
  !item ||
  item.title === "" ||
  item.description === "" ||
  item.videoSection === "";

const CourseContent: React.FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handlerSumbit: handlerCourseSumbit,
}) => {
  // Saved lessons start collapsed so long curriculums stay easy to scan;
  // lessons that are still empty start open.
  const [isCollapse, setIsCollapse] = useState<boolean[]>(
    courseContentData.map((item) => !isLessonIncomplete(item)),
  );

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handlerCollapseToggle = (index: number) => {
    setIsCollapse((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handlerRemoveLesson = (index: number) => {
    if (index === 0) return;
    setCourseContentData(
      courseContentData.filter(
        (_: ICourseContentItem, i: number) => i !== index,
      ),
    );
    // Keep the collapsed state in step with the lessons
    setIsCollapse((prev) => prev.filter((_, i) => i !== index));
  };

  const handlerRemoveLink = (index: number, linkIndex: number) => {
    setCourseContentData(
      courseContentData.map((item: ICourseContentItem, i: number) =>
        i === index
          ? {
              ...item,
              links: item.links.filter(
                (_: ILink, li: number) => li !== linkIndex,
              ),
            }
          : item,
      ),
    );
  };

  const handlerAddLink = (index: number) => {
    setCourseContentData(
      courseContentData.map((item: ICourseContentItem, i: number) =>
        i === index
          ? { ...item, links: [...item.links, { title: "", url: "" }] }
          : item,
      ),
    );
  };

  const handlerFieldChange = (
    index: number,
    field: keyof ICourseContentItem,
    value: string,
  ) => {
    setCourseContentData(
      courseContentData.map((item: ICourseContentItem, i: number) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handlerSectionNameChange = (index: number, value: string) => {
    const oldSectionName = courseContentData[index].videoSection;
    setCourseContentData(
      courseContentData.map((item: ICourseContentItem) =>
        item.videoSection === oldSectionName
          ? { ...item, videoSection: value }
          : item,
      ),
    );
  };

  const handlerLinkChange = (
    index: number,
    linkIndex: number,
    field: keyof ILink,
    value: string,
  ) => {
    setCourseContentData(
      courseContentData.map((item: ICourseContentItem, i: number) =>
        i === index
          ? {
              ...item,
              links: item.links.map((link: ILink, li: number) =>
                li === linkIndex ? { ...link, [field]: value } : link,
              ),
            }
          : item,
      ),
    );
  };

  // Add a lesson at the end of the given section
  const addLessonToSection = (section: Section) => {
    if (isLessonIncomplete(courseContentData[section.end])) {
      toast.error(INCOMPLETE_MESSAGE);
      return;
    }
    const next = [...courseContentData];
    next.splice(section.end + 1, 0, emptyLesson(section.name));
    setCourseContentData(next);
    setIsCollapse((prev) => {
      const copy = [...prev];
      copy.splice(section.end + 1, 0, false);
      return copy;
    });
  };

  const addNewSection = () => {
    const lastLesson = courseContentData[courseContentData.length - 1];
    if (isLessonIncomplete(lastLesson)) {
      toast.error(INCOMPLETE_MESSAGE);
      return;
    }
    setCourseContentData([
      ...courseContentData,
      emptyLesson("Untitled section"),
    ]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    const lastItem = courseContentData[courseContentData.length - 1];
    if (isLessonIncomplete(lastItem)) {
      toast.error(INCOMPLETE_MESSAGE);
    } else {
      setActive(active + 1);
      handlerCourseSumbit();
    }
  };

  // Group neighbouring lessons that share a section name
  const sections: Section[] = [];
  courseContentData.forEach((item, i) => {
    const last = sections[sections.length - 1];
    if (last && courseContentData[i - 1].videoSection === item.videoSection) {
      last.end = i;
    } else {
      sections.push({ name: item.videoSection, start: i, end: i });
    }
  });

  const renderLesson = (item: ICourseContentItem, index: number) => {
    const collapsed = !!isCollapse[index];
    const panelId = `lesson-${index}-panel`;
    const lessonName = item.title || `lesson ${index + 1}`;
    const needsDetails = isLessonIncomplete(item);

    return (
      <li key={index}>
        {/* Lesson row */}
        <div className="flex items-center gap-1 p-1.5">
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls={panelId}
            onClick={() => handlerCollapseToggle(index)}
            className={`flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full px-4 text-left transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:hover:bg-white/10 ${FOCUS}`}
          >
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-[#0B1020] dark:text-white">
              {item.title
                ? `${index + 1}. ${item.title}`
                : `Lesson ${index + 1}`}
            </span>
            {needsDetails && (
              <span className="shrink-0 rounded-full bg-[#0B1020]/5 px-2.5 py-0.5 text-xs font-bold text-[#0B1020]/70 dark:bg-white/10 dark:text-white/70">
                Needs details
              </span>
            )}
            <FiChevronDown
              size={18}
              aria-hidden="true"
              className={`shrink-0 text-[#0B1020]/70 transition-transform duration-150 motion-reduce:transition-none dark:text-white/70 ${
                collapsed ? "" : "rotate-180"
              }`}
            />
          </button>
          <button
            type="button"
            className={ICON_BTN}
            aria-label={
              index === 0
                ? "The first lesson can't be deleted"
                : `Delete ${lessonName}`
            }
            disabled={index === 0}
            onClick={() => handlerRemoveLesson(index)}
          >
            <AiOutlineDelete size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Lesson fields */}
        <div id={panelId} hidden={collapsed}>
          {!collapsed && (
            <div className="flex flex-col gap-4 px-4 pb-5 pt-2">
              <div>
                <label className={LABEL} htmlFor={`title-${index}`}>
                  Video title
                </label>
                <input
                  id={`title-${index}`}
                  type="text"
                  value={item.title || ""}
                  placeholder="For example, Setting up your project"
                  className={FIELD}
                  onChange={(e) =>
                    handlerFieldChange(index, "title", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={LABEL} htmlFor={`url-${index}`}>
                  Video URL
                </label>
                <input
                  id={`url-${index}`}
                  type="text"
                  value={item.videoUrl || ""}
                  placeholder="Paste the video link"
                  className={FIELD}
                  onChange={(e) =>
                    handlerFieldChange(index, "videoUrl", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor={`section-${index}`}>
                    Video section
                  </label>
                  <input
                    id={`section-${index}`}
                    type="text"
                    placeholder="For example, Getting started"
                    value={item.videoSection ?? ""}
                    className={FIELD}
                    onChange={(e) =>
                      handlerFieldChange(index, "videoSection", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor={`length-${index}`}>
                    Video length (minutes)
                  </label>
                  <input
                    id={`length-${index}`}
                    type="number"
                    min={0}
                    placeholder="For example, 20"
                    value={item.videoLength ?? ""}
                    className={FIELD}
                    onChange={(e) =>
                      handlerFieldChange(index, "videoLength", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor={`desc-${index}`}>
                  Video description
                </label>
                <textarea
                  id={`desc-${index}`}
                  rows={5}
                  value={item.description || ""}
                  placeholder="Describe what students will learn in this video"
                  className={`${FIELD} h-auto min-h-[120px] resize-y py-3 leading-relaxed`}
                  onChange={(e) =>
                    handlerFieldChange(index, "description", e.target.value)
                  }
                />
              </div>

              {/* Links */}
              <fieldset className="m-0 border-0 p-0">
                <legend className={LABEL}>Resource links</legend>
                <div className="flex flex-col gap-3">
                  {item?.links?.map((link: ILink, linksIndex: number) => (
                    <div
                      key={linksIndex}
                      className="rounded-2xl border border-[#0B1020]/10 p-3 dark:border-white/10"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="pl-1 text-sm font-bold text-[#0B1020]/70 dark:text-white/70">
                          Link {linksIndex + 1}
                        </span>
                        <button
                          type="button"
                          className={ICON_BTN}
                          aria-label={
                            linksIndex === 0
                              ? "The first link can't be deleted"
                              : `Delete link ${linksIndex + 1}`
                          }
                          disabled={linksIndex === 0}
                          onClick={() => handlerRemoveLink(index, linksIndex)}
                        >
                          <AiOutlineDelete size={16} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="grid gap-2">
                        <input
                          type="text"
                          aria-label={`Title of link ${linksIndex + 1}`}
                          placeholder="Link title, for example Source code"
                          value={link.title}
                          className={FIELD}
                          onChange={(e) =>
                            handlerLinkChange(
                              index,
                              linksIndex,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="url"
                          aria-label={`URL of link ${linksIndex + 1}`}
                          placeholder="https://"
                          value={link.url}
                          className={FIELD}
                          onChange={(e) =>
                            handlerLinkChange(
                              index,
                              linksIndex,
                              "url",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={`${PILL} mt-3`}
                  onClick={() => handlerAddLink(index)}
                >
                  <FiLink size={16} aria-hidden="true" />
                  Add link
                </button>
              </fieldset>
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="mx-auto mb-[60px] mt-[90px] w-full max-w-[860px] px-3 sm:mt-24 sm:w-[90%] sm:px-0">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
            Course curriculum
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            Group lessons into sections. Open a lesson to add its video,
            description and links.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#0B1020]/5 px-3 py-1 text-xs font-bold text-[#0B1020] dark:bg-white/10 dark:text-white">
          {courseContentData.length}{" "}
          {courseContentData.length === 1 ? "lesson" : "lessons"}
        </span>
      </div>

      <form onSubmit={handlerSubmit}>
        <div className="flex flex-col gap-5">
          {sections.map((section) => (
            <section
              key={section.start}
              aria-label={section.name || "Untitled section"}
              className="rounded-3xl border border-[#0B1020]/10 bg-white p-4 dark:border-white/10 dark:bg-[#0B1020] sm:p-5"
            >
              {/* Section name */}
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={section.name || ""}
                  aria-label="Section name"
                  placeholder="Section name"
                  className={`min-w-0 max-w-[340px] flex-1 rounded-full border border-[#0B1020] bg-transparent px-4 py-2 text-base font-extrabold tracking-tight text-[#0B1020] placeholder:text-[#0B1020]/70 hover:bg-[#0B1020]/5 focus:border-[#2F4BFF] ${FOCUS} dark:border-white dark:text-white dark:placeholder:text-white/70 dark:hover:bg-white/10`}
                  onChange={(e) =>
                    handlerSectionNameChange(section.start, e.target.value)
                  }
                />
                <BiSolidPencil
                  className="shrink-0 text-sm text-[#0B1020]/70 dark:text-white/70"
                  aria-hidden="true"
                />
                <span className="ml-auto shrink-0 text-xs font-bold text-[#0B1020]/70 dark:text-white/70">
                  {section.end - section.start + 1}{" "}
                  {section.end === section.start ? "lesson" : "lessons"}
                </span>
              </div>

              {/* Lessons in this section */}
              <ul className="divide-y divide-[#0B1020]/10 rounded-2xl border border-[#0B1020]/10 dark:divide-white/10 dark:border-white/10">
                {courseContentData
                  .slice(section.start, section.end + 1)
                  .map((item, offset) =>
                    renderLesson(item, section.start + offset),
                  )}
              </ul>

              <button
                type="button"
                className={`${PILL} mt-3`}
                onClick={() => addLessonToSection(section)}
              >
                <FiPlus size={16} aria-hidden="true" />
                Add lesson
              </button>
            </section>
          ))}
        </div>

        {/* Add new section */}
        <div className="mb-8 mt-5">
          <button type="button" className={PILL} onClick={addNewSection}>
            <FiPlus size={16} aria-hidden="true" />
            Add new section
          </button>
        </div>
      </form>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" className={PILL} onClick={prevButton}>
          Previous
        </button>
        <button type="button" className={CTA} onClick={handleOptions}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseContent;
