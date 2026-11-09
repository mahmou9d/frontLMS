"use client";
import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "@/redux/features/layout/page";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../Loader/Loader";
import { AiOutlineDelete } from "react-icons/ai";
import { FiChevronDown, FiChevronUp, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { ICategory } from "@/app/types";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

// Round 40px icon button: quiet by default, ink/5 on hover
const ICON_BTN = `flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 enabled:hover:bg-[#0B1020]/5 enabled:hover:text-[#0B1020] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none dark:text-white/70 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-white ${FOCUS}`;

// Signature hard-shadow CTA, with a flat disabled state
const CTA = `h-10 shrink-0 rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 enabled:hover:-translate-x-px enabled:hover:-translate-y-px enabled:hover:shadow-[4px_4px_0_#0B1020] enabled:active:translate-x-[3px] enabled:active:translate-y-[3px] enabled:active:shadow-none disabled:cursor-not-allowed disabled:border-[#0B1020]/10 disabled:bg-[#0B1020]/5 disabled:text-[#0B1020]/70 disabled:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:enabled:hover:shadow-[4px_4px_0_#fff] dark:enabled:active:shadow-none dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-white/70 ${FOCUS}`;

const EditCategories = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const draftRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
    if (isSuccess) {
      refetch();
      toast.success("Categories updated");
    }
    if (error && "data" in error) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData.data.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, error]);

  // Update by position, because newly added categories don't have an _id yet
  const handleTitleChange = (index: number, title: string) => {
    setCategories((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title } : item)),
    );
  };

  const handleRemove = (index: number) => {
    const title = categories[index]?.title;
    setCategories((prev) => prev.filter((_, i) => i !== index));
    setAnnouncement(`Removed ${title || "category"}.`);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;
    const title = categories[index].title;
    setCategories((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setAnnouncement(
      `Moved ${title || "category"} to position ${target + 1} of ${categories.length}.`,
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) {
      setDraftError("Enter a category title first.");
      draftRef.current?.focus();
      return;
    }
    if (
      categories.some(
        (c) => c.title.trim().toLowerCase() === title.toLowerCase(),
      )
    ) {
      setDraftError("That category already exists. Try a different title.");
      draftRef.current?.focus();
      return;
    }
    setCategories((prev) => [...prev, { title }]);
    setDraft("");
    setDraftError("");
    setAnnouncement(`Added ${title}.`);
    draftRef.current?.focus();
  };

  const areCategoriesUnchanged = (
    originalCategories: ICategory[],
    newCategories: ICategory[],
  ) => JSON.stringify(originalCategories) === JSON.stringify(newCategories);

  const isAnyCategoryEmpty = (list: ICategory[]) =>
    list.some((item: ICategory) => item.title === "");

  const editCategoriesHandler = async () => {
    const originalCategories = data?.layout?.categories ?? [];
    if (
      !areCategoriesUnchanged(originalCategories, categories) &&
      !isAnyCategoryEmpty(categories)
    ) {
      await editLayout({ type: "Categories", categories });
    }
  };

  const isUnchanged = areCategoriesUnchanged(
    data?.layout?.categories ?? [],
    categories,
  );
  const isEmpty = isAnyCategoryEmpty(categories);
  const canSave = !isUnchanged && !isEmpty;

  const status = isEmpty
    ? "Fill in or delete the empty category to save."
    : !isUnchanged
      ? "You have unsaved changes."
      : "All changes are saved.";

  return (
    <div className="mx-auto mb-[60px] mt-24 w-[90%] max-w-[760px]">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="rounded-3xl border border-[#0B1020]/10 bg-white p-5 dark:border-white/10 dark:bg-[#0B1020] sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                Edit categories
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                Add, rename, reorder or remove the categories courses can belong
                to.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#0B1020]/5 px-3 py-1 text-xs font-bold text-[#0B1020] dark:bg-white/10 dark:text-white">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </span>
          </div>

          {/* Add a category */}
          <form onSubmit={handleAdd} noValidate className="mb-2">
            <label
              htmlFor="new-category"
              className="mb-1.5 block text-sm font-bold text-[#0B1020] dark:text-white"
            >
              New category
            </label>
            <div className="flex items-center gap-2">
              <input
                id="new-category"
                ref={draftRef}
                type="text"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (draftError) setDraftError("");
                }}
                placeholder="For example, Web development"
                aria-invalid={draftError ? true : undefined}
                aria-describedby={draftError ? "new-category-error" : undefined}
                className={`box-border h-11 min-w-0 flex-1 rounded-full border bg-white px-4 text-sm font-semibold text-[#0B1020] placeholder:text-[#0B1020]/70 focus:border-[#2F4BFF] ${FOCUS} dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/70 ${
                  draftError
                    ? "border-[#0B1020] dark:border-white"
                    : "border-[#0B1020]/10 dark:border-white/10"
                }`}
              />
              <button
                type="submit"
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-bold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`}
              >
                <FiPlus size={16} aria-hidden="true" />
                Add category
              </button>
            </div>
            <p
              id="new-category-error"
              role="alert"
              className="mt-1.5 min-h-5 text-sm font-semibold text-[#0B1020] dark:text-white"
            >
              {draftError}
            </p>
          </form>

          {/* Category list */}
          {categories.length === 0 ? (
            <p className="rounded-2xl border border-[#0B1020]/10 px-4 py-6 text-center text-sm font-semibold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
              No categories yet. Add your first one above.
            </p>
          ) : (
            <ul
              aria-label="Categories"
              className="divide-y divide-[#0B1020]/10 rounded-2xl border border-[#0B1020]/10 dark:divide-white/10 dark:border-white/10"
            >
              {categories.map((i: ICategory, index: number) => (
                <li
                  key={i._id || index}
                  className="flex items-center gap-1 p-1.5"
                >
                  <input
                    type="text"
                    value={i.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="Category title"
                    aria-label={`Title of category ${index + 1}`}
                    className={`h-11 min-w-0 flex-1 rounded-full border border-transparent bg-transparent px-4 text-sm font-bold text-[#0B1020] placeholder:font-semibold placeholder:text-[#0B1020]/70 hover:bg-[#0B1020]/5 focus:border-[#2F4BFF] ${FOCUS} dark:text-white dark:placeholder:text-white/70 dark:hover:bg-white/10`}
                  />
                  <button
                    type="button"
                    className={ICON_BTN}
                    aria-label={`Move ${i.title || `category ${index + 1}`} up`}
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                  >
                    <FiChevronUp size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={ICON_BTN}
                    aria-label={`Move ${i.title || `category ${index + 1}`} down`}
                    disabled={index === categories.length - 1}
                    onClick={() => handleMove(index, 1)}
                  >
                    <FiChevronDown size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={ICON_BTN}
                    aria-label={`Remove ${i.title || `category ${index + 1}`}`}
                    onClick={() => handleRemove(index)}
                  >
                    <AiOutlineDelete size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Announces add, move and remove to screen readers */}
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>

          {/* Sticky save bar */}
          <div className="sticky bottom-4 z-10 mt-8 flex flex-col items-stretch gap-3 rounded-3xl border border-[#0B1020]/10 bg-white p-3 dark:border-white/10 dark:bg-[#0B1020] sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:pl-5">
            <p className="text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
              {status}
            </p>
            <button
              type="button"
              className={CTA}
              disabled={!canSave}
              onClick={editCategoriesHandler}
            >
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCategories;
