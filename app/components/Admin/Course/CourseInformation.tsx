"use client";

import { useGetHeroDataQuery } from "@/redux/features/layout/page";
import React, { FC, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { ICourseInfo, ICategory } from "@/app/types";

type Props = {
  courseInfo: ICourseInfo;
  setCourseInfo: (courseInfo: ICourseInfo) => void;
  active: number;
  setActive: (active: number) => void;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const fieldBase = `w-full min-w-0 border border-[#0B1020]/10 dark:border-white/10 bg-white dark:bg-[#0B1020] px-4 text-sm text-[#0B1020] dark:text-white placeholder:text-[#0B1020]/70 dark:placeholder:text-white/70 transition-colors duration-150 motion-reduce:transition-none focus:border-[#2F4BFF] ${focusRing}`;

const inputClass = `${fieldBase} h-11 rounded-full`;
const priceInputClass = `${fieldBase} h-11 rounded-full pl-8`;
const textareaClass = `${fieldBase} min-h-[120px] rounded-2xl py-3 leading-relaxed resize-y`;
const selectClass = `${fieldBase} h-11 rounded-full cursor-pointer [&>option]:bg-white [&>option]:text-[#0B1020] dark:[&>option]:bg-[#0B1020] dark:[&>option]:text-white`;

const labelClass =
  "mb-1.5 block text-sm font-semibold text-[#0B1020] dark:text-white";
const hintClass = "mt-1.5 text-sm text-[#0B1020]/70 dark:text-white/70";
const sectionClass =
  "mt-10 mb-5 border-b border-[#0B1020]/10 dark:border-white/10 pb-3 text-lg font-bold text-[#0B1020] dark:text-white first:mt-0";

const ctaBtn = `inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#FFD23F] text-[#0B1020] text-sm font-bold border-2 border-[#0B1020] dark:border-white shadow-[3px_3px_0_#0B1020] dark:shadow-[3px_3px_0_#fff] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] dark:hover:shadow-[4px_4px_0_#fff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 motion-reduce:transition-none ${focusRing}`;

const levels = ["Beginner", "Intermediate", "Advanced"];

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const categories: ICategory[] = data?.layout?.categories ?? [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const readThumbnail = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    readThumbnail(e.target.files?.[0]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    readThumbnail(e.dataTransfer?.files[0]);
  };

  return (
    <div className="mx-auto mt-[90px] sm:my-24 mb-[60px] w-full sm:w-[90%] max-w-[820px] px-3 sm:px-0">
      <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
        Create new course
      </h2>
      <p className="mb-7 text-sm text-[#0B1020]/70 dark:text-white/70">
        Fill in the details below to publish your course on the platform.
      </p>

      <div className="rounded-3xl border border-[#0B1020]/10 dark:border-white/10 bg-white dark:bg-[#0B1020] px-4 sm:px-10 py-6 sm:py-9">
        <form onSubmit={handleSubmit}>
          {/* Basic information */}
          <h3 className={sectionClass}>Basic information</h3>

          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="course-name" className={labelClass}>
                Course name (required)
              </label>
              <input
                id="course-name"
                type="text"
                required
                value={courseInfo.name || ""}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, name: e.target.value })
                }
                placeholder="Full-stack web development bootcamp"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="course-description" className={labelClass}>
                Course description
              </label>
              <textarea
                id="course-description"
                rows={5}
                value={courseInfo.description || ""}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, description: e.target.value })
                }
                placeholder="Describe what students will learn in this course"
                className={textareaClass}
              />
            </div>

            <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="course-tags" className={labelClass}>
                  Tags
                </label>
                <input
                  id="course-tags"
                  type="text"
                  value={courseInfo.tags || ""}
                  onChange={(e) =>
                    setCourseInfo({ ...courseInfo, tags: e.target.value })
                  }
                  placeholder="React, Node.js, TypeScript"
                  aria-describedby="course-tags-hint"
                  className={inputClass}
                />
                <p id="course-tags-hint" className={hintClass}>
                  Separate tags with commas.
                </p>
              </div>

              <div>
                <label htmlFor="course-category" className={labelClass}>
                  Category (required)
                </label>
                <select
                  id="course-category"
                  required
                  value={courseInfo.categories || ""}
                  onChange={(e) =>
                    setCourseInfo({ ...courseInfo, categories: e.target.value })
                  }
                  aria-describedby={
                    categories.length === 0 ? "course-category-hint" : undefined
                  }
                  className={selectClass}
                >
                  <option value="">Select a category</option>
                  {categories.map((item: ICategory) => (
                    <option value={item.title} key={item._id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p id="course-category-hint" className={hintClass}>
                    No categories yet. Add them under Admin, Customization,
                    Categories, then come back.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <h3 className={sectionClass}>Pricing</h3>

          <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="course-price" className={labelClass}>
                Price (required)
              </label>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70"
                >
                  $
                </span>
                <input
                  id="course-price"
                  type="number"
                  required
                  min={0}
                  value={courseInfo.price || ""}
                  onChange={(e) =>
                    setCourseInfo({ ...courseInfo, price: e.target.value })
                  }
                  placeholder="29"
                  className={priceInputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="course-estimated-price" className={labelClass}>
                Original price
              </label>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70"
                >
                  $
                </span>
                <input
                  id="course-estimated-price"
                  type="number"
                  min={0}
                  value={courseInfo.estimatedPrice || ""}
                  onChange={(e) =>
                    setCourseInfo({
                      ...courseInfo,
                      estimatedPrice: e.target.value,
                    })
                  }
                  placeholder="79"
                  className={priceInputClass}
                />
              </div>
            </div>
          </div>

          {/* Course details */}
          <h3 className={sectionClass}>Course details</h3>

          <div className="flex flex-col gap-5">
            <fieldset>
              <legend className={labelClass}>Level</legend>
              <div className="flex flex-wrap gap-2.5">
                {levels.map((lvl) => {
                  const selected = courseInfo.level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setCourseInfo({ ...courseInfo, level: lvl })
                      }
                      className={`inline-flex items-center justify-center h-10 px-5 rounded-full border text-sm font-semibold transition-all duration-150 motion-reduce:transition-none ${focusRing} ${
                        selected
                          ? "bg-[#2F4BFF] border-[#2F4BFF] text-white"
                          : "border-[#0B1020]/10 dark:border-white/10 text-[#0B1020]/70 dark:text-white/70 hover:bg-[#0B1020]/5 dark:hover:bg-white/10"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="course-demo-url" className={labelClass}>
                Demo video URL
              </label>
              <input
                id="course-demo-url"
                type="url"
                value={courseInfo.demoUrl || ""}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
                }
                placeholder="https://youtube.com/watch?v=your-video-id"
                className={inputClass}
              />
            </div>
          </div>

          {/* Thumbnail */}
          <h3 className={sectionClass}>Thumbnail</h3>

          <input
            type="file"
            accept="image/*"
            id="course-thumbnail"
            className="peer sr-only"
            onChange={handleFileChange}
          />
          <label
            htmlFor="course-thumbnail"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed transition-colors duration-150 motion-reduce:transition-none hover:bg-[#0B1020]/5 dark:hover:bg-white/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F4BFF] ${
              dragging
                ? "border-[#2F4BFF] bg-[#0B1020]/5 dark:bg-white/10"
                : "border-[#0B1020]/10 dark:border-white/10"
            }`}
          >
            {courseInfo.thumbnail ? (
              <>
                <img
                  src={courseInfo.thumbnail}
                  alt="Course thumbnail preview"
                  className="block h-full min-h-[180px] w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#0B1020]/50 opacity-0 transition-opacity duration-150 motion-reduce:transition-none group-hover:opacity-100">
                  <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0B1020]">
                    Change image
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1020]/5 dark:bg-white/10 text-[#0B1020] dark:text-white">
                  <FiUploadCloud className="text-xl" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-[#0B1020] dark:text-white">
                  Drag and drop an image, or select one
                </p>
                <p className={hintClass}>
                  PNG, JPG or WEBP. Recommended size is 1280 by 720 pixels.
                </p>
              </>
            )}
          </label>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-between border-t border-[#0B1020]/10 dark:border-white/10 pt-6">
            <span className="text-sm text-[#0B1020]/70 dark:text-white/70">
              Step 1 of 4
            </span>
            <button type="submit" className={ctaBtn}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseInformation;
