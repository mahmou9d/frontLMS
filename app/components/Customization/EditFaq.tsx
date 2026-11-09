"use client";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/page";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import Loader from "../Loader/Loader";
import { IFaqItem } from "@/app/types";

interface IFaqItemWithActive extends IFaqItem {
  active?: boolean;
}

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const FIELD = `box-border w-full rounded-2xl border border-[#0B1020]/10 bg-white px-4 text-sm font-semibold text-[#0B1020] placeholder:text-[#0B1020]/70 focus:border-[#2F4BFF] ${FOCUS} dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/70`;

// Round 40px icon button: quiet by default, ink/5 on hover
const ICON_BTN = `flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 hover:text-[#0B1020] motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white ${FOCUS}`;

// Signature hard-shadow CTA, with a flat disabled state
const CTA = `h-10 shrink-0 rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 enabled:hover:-translate-x-px enabled:hover:-translate-y-px enabled:hover:shadow-[4px_4px_0_#0B1020] enabled:active:translate-x-[3px] enabled:active:translate-y-[3px] enabled:active:shadow-none disabled:cursor-not-allowed disabled:border-[#0B1020]/10 disabled:bg-[#0B1020]/5 disabled:text-[#0B1020]/70 disabled:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:enabled:hover:shadow-[4px_4px_0_#fff] dark:enabled:active:shadow-none dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-white/70 ${FOCUS}`;

const EditFaq = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

  const [questions, setQuestions] = useState<IFaqItemWithActive[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const questionRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const focusId = useRef<string | null>(null);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(data.layout.faq);
    }
    if (isSuccess) {
      refetch();
      toast.success("FAQ updated");
    }
    if (error && "data" in error) {
      const errorData = error as { data: { message: string } };
      toast.error(errorData.data.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, error]);

  // After adding an item, move the cursor into its question field
  useEffect(() => {
    if (focusId.current) {
      questionRefs.current[focusId.current]?.focus();
      focusId.current = null;
    }
  }, [questions.length]);

  const toggleQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((i) => (i._id === id ? { ...i, active: !i.active } : i)),
    );
  };

  const handleQuestionChange = (id: string, value: string) => {
    setQuestions((prev) =>
      prev.map((i) => (i._id === id ? { ...i, question: value } : i)),
    );
  };

  const handleAnswerChange = (id: string, value: string) => {
    setQuestions((prev) =>
      prev.map((i) => (i._id === id ? { ...i, answer: value } : i)),
    );
  };

  const handleRemove = (id: string) => {
    const title = questions.find((q) => q._id === id)?.question;
    setQuestions((prev) => prev.filter((i) => i._id !== id));
    setAnnouncement(`Deleted ${title || "FAQ item"}.`);
  };

  const newFaqHandler = () => {
    // Temporary unique ID for items that don't exist in the database yet
    const tempId = Math.random().toString(36).substring(2, 9);
    focusId.current = tempId;
    setQuestions((prev) => [
      ...prev,
      { _id: tempId, question: "", answer: "", active: true },
    ]);
    setAnnouncement("Added a new FAQ item.");
  };

  const areQuestionsUnchanged = (
    originalQuestions: IFaqItem[],
    currentQuestions: IFaqItemWithActive[],
  ) => {
    // Strip the UI-only active flag before comparing
    const strippedCurrent = currentQuestions.map(({ active, ...rest }) => rest);
    const strippedOriginal = originalQuestions.map(
      ({ _id, question, answer }) => ({ _id, question, answer }),
    );
    return JSON.stringify(strippedOriginal) === JSON.stringify(strippedCurrent);
  };

  const isAnyQuestionEmpty = (list: IFaqItemWithActive[]) =>
    list.some((q) => !q.question || !q.answer);

  const handleEdit = async () => {
    const originalFaq = data?.layout?.faq ?? [];
    if (
      !areQuestionsUnchanged(originalFaq, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      // Strip the active flag before sending to the backend
      const cleanQuestions = questions.map(({ active, ...rest }) => rest);
      await editLayout({ type: "FAQ", faq: cleanQuestions });
    }
  };

  const isUnchanged = areQuestionsUnchanged(data?.layout?.faq ?? [], questions);
  const isEmpty = isAnyQuestionEmpty(questions);
  const canSave = !isUnchanged && !isEmpty;

  const status = isEmpty
    ? "Fill in every question and answer, or delete the empty items, to save."
    : !isUnchanged
      ? "You have unsaved changes."
      : "All changes are saved.";

  return (
    <div className="mx-auto mb-[60px] mt-24 w-[90%] max-w-[820px]">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="rounded-3xl border border-[#0B1020]/10 bg-white p-5 dark:border-white/10 dark:bg-[#0B1020] sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                Edit FAQ
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                Write the questions and answers shown in the support section.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#0B1020]/5 px-3 py-1 text-xs font-bold text-[#0B1020] dark:bg-white/10 dark:text-white">
              {questions.length} {questions.length === 1 ? "item" : "items"}
            </span>
          </div>

          {questions.length === 0 ? (
            <p className="mb-6 rounded-2xl border border-[#0B1020]/10 px-4 py-6 text-center text-sm font-semibold text-[#0B1020]/70 dark:border-white/10 dark:text-white/70">
              No FAQ items yet. Add your first question below.
            </p>
          ) : (
            <ul className="mb-6 flex flex-col gap-3">
              {questions.map((item, index) => {
                const id = item._id as string;
                const panelId = `faq-answer-${id}`;
                const needsAnswer = !item.answer;
                return (
                  <li
                    key={id}
                    className="rounded-2xl border border-[#0B1020]/10 p-2 dark:border-white/10"
                  >
                    {/* Question row */}
                    <div className="flex items-center gap-1">
                      <input
                        ref={(el) => {
                          questionRefs.current[id] = el;
                        }}
                        type="text"
                        value={item.question}
                        onChange={(e) =>
                          handleQuestionChange(id, e.target.value)
                        }
                        placeholder="Question"
                        aria-label={`Question ${index + 1}`}
                        className={`${FIELD} h-11 flex-1 font-bold`}
                      />
                      <button
                        type="button"
                        className={ICON_BTN}
                        aria-label={
                          item.active ? "Hide the answer" : "Show the answer"
                        }
                        aria-expanded={!!item.active}
                        aria-controls={panelId}
                        onClick={() => toggleQuestion(id)}
                      >
                        <FiChevronDown
                          size={18}
                          aria-hidden="true"
                          className={`transition-transform duration-150 motion-reduce:transition-none ${
                            item.active ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        className={ICON_BTN}
                        aria-label={`Delete ${item.question || `question ${index + 1}`}`}
                        onClick={() => handleRemove(id)}
                      >
                        <AiOutlineDelete size={18} aria-hidden="true" />
                      </button>
                    </div>

                    {/* Answer */}
                    <div id={panelId} hidden={!item.active}>
                      {item.active && (
                        <div className="px-2 pb-2 pt-3">
                          <label
                            htmlFor={`${panelId}-field`}
                            className="mb-1.5 block text-sm font-bold text-[#0B1020] dark:text-white"
                          >
                            Answer
                          </label>
                          <textarea
                            id={`${panelId}-field`}
                            value={item.answer}
                            onChange={(e) =>
                              handleAnswerChange(id, e.target.value)
                            }
                            placeholder="Write the answer"
                            rows={3}
                            className={`${FIELD} min-h-[96px] resize-y py-3 leading-relaxed`}
                          />
                        </div>
                      )}
                    </div>

                    {!item.active && needsAnswer && (
                      <p className="px-3 pb-1.5 pt-1 text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
                        This item has no answer yet. Show the answer to add one.
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={newFaqHandler}
            className={`inline-flex h-10 items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-bold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10 ${FOCUS}`}
          >
            <FiPlus size={16} aria-hidden="true" />
            Add FAQ item
          </button>

          {/* Announces add and delete to screen readers */}
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
              onClick={handleEdit}
            >
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFaq;
