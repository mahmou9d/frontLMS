"use client";

import React, { FC } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiX } from "react-icons/fi";

type Item = { title: string };

type Props = {
  benefits: Item[];
  setBenefits: (benefits: Item[]) => void;
  prerequisites: Item[];
  setPrerequisites: (prerequisites: Item[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const secondaryBtn = `inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full border border-[#0B1020]/10 dark:border-white/10 text-sm font-semibold text-[#0B1020] dark:text-white hover:bg-[#0B1020]/5 dark:hover:bg-white/10 transition-all duration-150 motion-reduce:transition-none ${focusRing}`;

const ctaBtn = `inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#FFD23F] text-[#0B1020] text-sm font-bold border-2 border-[#0B1020] dark:border-white shadow-[3px_3px_0_#0B1020] dark:shadow-[3px_3px_0_#fff] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] dark:hover:shadow-[4px_4px_0_#fff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-150 motion-reduce:transition-none ${focusRing}`;

type ListSectionProps = {
  id: string;
  title: string;
  hint: string;
  placeholder: string;
  itemLabel: string;
  addLabel: string;
  items: Item[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

const ListSection: FC<ListSectionProps> = ({
  id,
  title,
  hint,
  placeholder,
  itemLabel,
  addLabel,
  items,
  onChange,
  onAdd,
  onRemove,
}) => (
  <section
    aria-labelledby={`${id}-title`}
    className="rounded-3xl border border-[#0B1020]/10 dark:border-white/10 bg-white dark:bg-[#0B1020] p-4 sm:p-7 mb-6"
  >
    <h3
      id={`${id}-title`}
      className="text-lg font-bold text-[#0B1020] dark:text-white"
    >
      {title}
    </h3>
    <p className="mt-1 mb-5 text-sm text-[#0B1020]/70 dark:text-white/70">
      {hint}
    </p>

    <ul className="flex flex-col gap-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2">
          <input
            type="text"
            name={id}
            required
            value={item.title}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={placeholder}
            aria-label={`${itemLabel} ${index + 1}`}
            className={`flex-1 min-w-0 h-11 px-4 rounded-full border border-[#0B1020]/10 dark:border-white/10 bg-white dark:bg-[#0B1020] text-sm text-[#0B1020] dark:text-white placeholder:text-[#0B1020]/70 dark:placeholder:text-white/70 transition-colors duration-150 motion-reduce:transition-none focus:border-[#2F4BFF] ${focusRing}`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
              className={`inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-full text-[#0B1020]/70 dark:text-white/70 hover:bg-[#0B1020]/5 dark:hover:bg-white/10 transition-all duration-150 motion-reduce:transition-none ${focusRing}`}
            >
              <FiX className="text-lg" aria-hidden="true" />
            </button>
          )}
        </li>
      ))}
    </ul>

    <button type="button" onClick={onAdd} className={`${secondaryBtn} mt-4`}>
      <FiPlus className="text-base" aria-hidden="true" />
      {addLabel}
    </button>
  </section>
);

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const updateAt = (list: Item[], index: number, value: string) =>
    list.map((item, i) => (i === index ? { ...item, title: value } : item));

  const removeAt = (list: Item[], index: number) =>
    list.length === 1 ? list : list.filter((_, i) => i !== index);

  const prevOptions = () => setActive(active - 1);

  const nextOptions = () => {
    const allFilled = [...benefits, ...prerequisites].every(
      (item) => item.title.trim() !== "",
    );
    if (allFilled) {
      setActive(active + 1);
    } else {
      toast.error(
        "Some fields are empty. Fill them in or remove them, then select Next.",
      );
    }
  };

  return (
    <div className="w-full sm:w-[90%] max-w-[780px] mx-auto mt-[90px] sm:mt-24 mb-[60px] px-3 sm:px-0">
      <h2 className="text-2xl font-extrabold tracking-tight text-[#0B1020] dark:text-white mb-8">
        Course requirements
      </h2>

      <ListSection
        id="benefits"
        title="What students will learn"
        hint="List the skills or results students get from this course."
        placeholder="Build a full stack LMS platform from scratch"
        itemLabel="Benefit"
        addLabel="Add benefit"
        items={benefits}
        onChange={(i, v) => setBenefits(updateAt(benefits, i, v))}
        onAdd={() => setBenefits([...benefits, { title: "" }])}
        onRemove={(i) => setBenefits(removeAt(benefits, i))}
      />

      <ListSection
        id="prerequisites"
        title="Prerequisites"
        hint="List what students should know before they start."
        placeholder="Basic knowledge of JavaScript and HTML"
        itemLabel="Prerequisite"
        addLabel="Add prerequisite"
        items={prerequisites}
        onChange={(i, v) => setPrerequisites(updateAt(prerequisites, i, v))}
        onAdd={() => setPrerequisites([...prerequisites, { title: "" }])}
        onRemove={(i) => setPrerequisites(removeAt(prerequisites, i))}
      />

      <div className="flex justify-between items-center mt-2">
        <button type="button" onClick={prevOptions} className={secondaryBtn}>
          Previous
        </button>
        <button type="button" onClick={nextOptions} className={ctaBtn}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseData;
