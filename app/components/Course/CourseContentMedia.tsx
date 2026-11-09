"use client";
import CoursePlayer from "@/app/utills/CoursePlayer";
import {
  useAddNewAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import { io } from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL || "";
const socketId = io(ENDPOINT, { transports: ["websocket"] });

import { IUser, ICourseData, IReview, IComment, ILink } from "@/app/types";

type Props = {
  data: ICourseData[];
  activeVideo: number;
  setActiveVideo: (index: number) => void;
  id: string;
  user?: IUser;
  refetch: () => void;
};

/* ─── Shared styles ──────────────────────────────── */
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const muted = "text-[#0B1020]/70 dark:text-white/70";

// Stars inherit the surrounding text color so they stay inside the palette.
const ratingSx = {
  color: "inherit",
  "& .MuiRating-iconEmpty": { color: "currentColor", opacity: 0.3 },
};

const fieldClasses = `w-full rounded-2xl border border-[#0B1020]/10 bg-white p-3 text-[15px] text-[#0B1020] placeholder:text-[#0B1020]/50 dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/50 ${focusRing}`;

const inputClasses = `h-10 min-w-0 flex-1 rounded-full border border-[#0B1020]/10 bg-white px-4 text-sm text-[#0B1020] placeholder:text-[#0B1020]/50 dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/50 ${focusRing}`;

// The one loud button: yellow with a hard offset shadow.
const ctaClasses = `inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${focusRing}`;

const replyButtonClasses = `inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#2F4BFF] px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#2F4BFF]/90 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusRing}`;

const navButtonClasses = `inline-flex h-10 items-center gap-1.5 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold transition-colors duration-150 hover:enabled:bg-[#0B1020]/5 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:border-white/10 dark:hover:enabled:bg-white/10 ${focusRing}`;

const toggleButtonClasses = `-ml-3 inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold ${muted} transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none dark:hover:bg-white/10 ${focusRing}`;

const FALLBACK_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// Avatar: image inside a yellow ring with a white inner border.
const Avatar = ({
  src,
  alt,
  size,
}: {
  src?: string;
  alt: string;
  size: number;
}) => (
  <div
    className="shrink-0 rounded-full bg-[#FFD23F] p-[3px]"
    style={{ width: size + 6, height: size + 6 }}
  >
    <div className="h-full w-full overflow-hidden rounded-full border-2 border-white dark:border-[#0B1020]">
      <Image
        src={src || FALLBACK_AVATAR}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </div>
  </div>
);

const TABS = ["Overview", "Resources", "Q&A", "Review"];

const CourseContentMedia = ({
  data,
  activeVideo,
  setActiveVideo,
  id,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [
    addNewQuestion,
    { isLoading: questionCreateLoading, error, isSuccess },
  ] = useAddNewQuestionMutation();
  const [
    addNewAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddNewAnswerInQuestionMutation();
  const [
    addReviewInCourse,
    { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewLoading },
  ] = useAddReviewInCourseMutation();
  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true },
  );
  const [
    addReeplyInReview,
    {
      isSuccess: replySuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation();
  const course = courseData?.course;
  const isReviewExists = course?.reviews?.find(
    (item: IReview) => (item?.user?._id || item?.user) === user?._id,
  );
  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Question cant be empty");
    } else {
      addNewQuestion({
        courseId: id,
        contentId: data[activeVideo]?._id,
        question,
      });
    }
  };
  // Question mutation effect
  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      toast.success("Question added successfully");
      socketId.emit("notification", {
        title: "new question",
        userId: user?._id,
        message: `You have successfully added a question to the course ${data[activeVideo].title}`,
      });
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data as { message?: string };
        toast.error(errorData.message || "An error occurred");
      }
    }
  }, [isSuccess, error]);

  // Answer mutation effect
  useEffect(() => {
    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Answer added successfully");
      if (user?.role !== "admin") {
        socketId.emit("notification", {
          title: "new answer",
          userId: user?._id,
          message: `You have successfully added an answer to the course ${data[activeVideo].title}`,
        });
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorData = answerError.data as { message?: string };
        toast.error(errorData.message || "An error occurred");
      }
    }
  }, [answerSuccess, answerError]);

  // Review mutation effect
  useEffect(() => {
    if (reviewSuccess) {
      courseRefetch();
      toast.success("Review added successfully");
      setRating(1);
      setReview("");
      socketId.emit("notification", {
        title: "new review",
        userId: user?._id,
        message: `You have successfully added a review to the course ${data[activeVideo].title}`,
      });
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errorData = reviewError.data as { message?: string };
        toast.error(errorData.message || "An error occurred");
      }
    }
  }, [reviewSuccess, reviewError]);

  // Reply mutation effect
  useEffect(() => {
    if (replySuccess) {
      courseRefetch();
      toast.success("Reply added successfully");
      setReply("");
      socketId.emit("notification", {
        title: "new reply",
        userId: user?._id,
        message: `You have successfully added a reply to the course ${data[activeVideo].title}`,
      });
    }
    if (replyError) {
      if ("data" in replyError) {
        const errorData = replyError.data as { message?: string };
        toast.error(errorData.message || "An error occurred");
      }
    }
  }, [replySuccess, replyError]);
  const handleAnswerSubmit = () => {
    addNewAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };
  const handleReviewSubmit = () => {
    if (review.length === 0) {
      toast.error("Review cant be empty");
    } else {
      addReviewInCourse({
        courseId: id,
        rating,
        review,
      });
    }
  };
  const handleReviewReplySubmit = () => {
    if (!replyCreationLoading) {
      if (reply.length === 0) {
        toast.error("Reply can't be empty");
      } else {
        addReeplyInReview({
          comment: reply,
          courseId: id,
          reviewId: reviewId,
        });
      }
    }
  };
  return (
    <div className="text-[#0B1020] dark:text-white">
      <div className="overflow-hidden rounded-3xl border border-[#0B1020]/10 dark:border-white/10">
        <CoursePlayer
          videoUrl={data[activeVideo]?.videoUrl}
          title={data[activeVideo]?.title}
        />
      </div>

      <div className="mb-6 mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          className={navButtonClasses}
          onClick={() => activeVideo > 0 && setActiveVideo(activeVideo - 1)}
          disabled={activeVideo === 0}
        >
          <AiOutlineArrowLeft aria-hidden="true" />
          <span className="hidden sm:inline">Previous lesson</span>
          <span className="sm:hidden">Previous</span>
        </button>
        <button
          type="button"
          className={navButtonClasses}
          onClick={() =>
            activeVideo < data.length - 1 && setActiveVideo(activeVideo + 1)
          }
          disabled={activeVideo === data.length - 1}
        >
          <span className="hidden sm:inline">Next lesson</span>
          <span className="sm:hidden">Next</span>
          <AiOutlineArrowRight aria-hidden="true" />
        </button>
      </div>

      <h1 className="mb-6 text-[clamp(1.75rem,3.5vw,2.5rem)] font-black leading-[1.1] tracking-tight">
        {data[activeVideo]?.title}
      </h1>

      <div
        role="tablist"
        aria-label="Lesson sections"
        className="mb-6 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((text: string, index: number) => (
          <button
            type="button"
            role="tab"
            id={`lesson-tab-${index}`}
            aria-selected={activeBar === index}
            aria-controls="lesson-panel"
            className={`h-10 shrink-0 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${focusRing} ${
              activeBar === index
                ? "bg-[#2F4BFF] text-white"
                : `${muted} hover:bg-[#0B1020]/5 dark:hover:bg-white/10`
            }`}
            onClick={() => setActiveBar(index)}
            key={index}
          >
            {text}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="lesson-panel"
        aria-labelledby={`lesson-tab-${activeBar}`}
      >
        {activeBar === 0 && (
          <div className={`text-base leading-[1.75] ${muted}`}>
            <p>{data[activeVideo]?.description}</p>
          </div>
        )}

        {activeBar === 1 && (
          <div>
            {data[activeVideo]?.links &&
            data[activeVideo]?.links.filter(
              (item: ILink) => item.title && item.url,
            ).length > 0 ? (
              <ul className="border-t border-[#0B1020]/10 dark:border-white/10">
                {data[activeVideo]?.links
                  .filter((item: ILink) => item.title && item.url)
                  .map((item: ILink, index: number) => (
                    <li
                      className="flex flex-col gap-1 border-b border-[#0B1020]/10 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                      key={index}
                    >
                      <h4 className="text-base font-bold">{item.title}</h4>
                      <a
                        className={`min-w-0 break-all rounded-full text-sm font-semibold text-[#2F4BFF] hover:underline dark:text-white ${focusRing}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.url}
                      </a>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className={`text-base leading-[1.75] ${muted}`}>
                No resources provided for this lesson.
              </p>
            )}
          </div>
        )}

        {activeBar === 2 && (
          <>
            <div className="mb-8 flex gap-4">
              <Avatar src={user?.avatar?.url} alt="Your avatar" size={42} />
              <div className="flex flex-1 flex-col gap-3">
                <textarea
                  aria-label="Your question"
                  className={`${fieldClasses} resize-y`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  placeholder="Ask a question about this lesson..."
                />
                <button
                  type="button"
                  className={`${ctaClasses} self-end`}
                  onClick={questionCreateLoading ? () => {} : handleQuestion}
                  disabled={questionCreateLoading}
                >
                  {questionCreateLoading ? "Submitting..." : "Submit question"}
                </button>
              </div>
            </div>

            <div>
              <CommentReply
                data={data}
                activevideo={activeVideo}
                user={user}
                answer={answer}
                setAnswer={setAnswer}
                handleAnswerSubmit={handleAnswerSubmit}
                setQuestionId={setQuestionId}
                answerCreationLoading={answerCreationLoading}
              />
            </div>
          </>
        )}

        {activeBar === 3 && (
          <>
            <div className="mb-8 flex gap-4">
              <Avatar src={user?.avatar?.url} alt="Your avatar" size={42} />
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-x-3">
                  <span className="text-sm font-bold">Give a rating</span>
                  <div className="flex text-[#2F4BFF] dark:text-white">
                    {[1, 2, 3, 4, 5].map((rate) => (
                      <button
                        type="button"
                        key={rate}
                        aria-label={`Rate ${rate} out of 5`}
                        aria-pressed={rating === rate}
                        onClick={() => setRating(rate)}
                        className={`flex h-10 w-9 items-center justify-center rounded-full ${focusRing}`}
                      >
                        {rating >= rate ? (
                          <AiFillStar size={24} aria-hidden="true" />
                        ) : (
                          <AiOutlineStar size={24} aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  aria-label="Your review"
                  className={`${fieldClasses} resize-y`}
                  rows={4}
                  placeholder="Write your review here..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  type="button"
                  className={`${ctaClasses} self-end`}
                  onClick={reviewLoading ? () => {} : handleReviewSubmit}
                  disabled={reviewLoading}
                >
                  {reviewLoading ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </div>

            <div>
              {course?.reviews && course.reviews.length > 0 ? (
                <ul className="border-t border-[#0B1020]/10 dark:border-white/10">
                  {[...course.reviews]
                    .reverse()
                    .map((item: IReview, index: number) => (
                      <ReviewItem
                        key={index}
                        item={item}
                        user={user}
                        reply={reply}
                        setReply={setReply}
                        handleReviewReplySubmit={handleReviewReplySubmit}
                        replyCreationLoading={replyCreationLoading}
                        setReviewId={setReviewId}
                        reviewId={reviewId}
                      />
                    ))}
                </ul>
              ) : (
                <p className={`text-base leading-[1.75] ${muted}`}>
                  No reviews yet. Be the first to review this course.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface ReviewItemProps {
  item: IReview;
  user?: IUser;
  reply: string;
  setReply: (reply: string) => void;
  handleReviewReplySubmit: () => void;
  replyCreationLoading: boolean;
  setReviewId: (id: string) => void;
  reviewId: string;
}

const ReviewItem = ({
  item,
  user,
  reply,
  setReply,
  handleReviewReplySubmit,
  replyCreationLoading,
  setReviewId,
  reviewId,
}: ReviewItemProps) => {
  const [replyActive, setReplyActive] = useState(false);

  return (
    <li className="flex flex-col gap-2 border-b border-[#0B1020]/10 py-5 dark:border-white/10">
      <div className="flex gap-3.5">
        <Avatar
          src={item?.user?.avatar?.url}
          alt={item?.user?.name ?? "Reviewer avatar"}
          size={40}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <h5 className="text-sm font-bold">{item?.user?.name}</h5>
          <span className="text-[#2F4BFF] dark:text-white">
            <Rating value={item.rating} readOnly size="small" sx={ratingSx} />
          </span>
          <p className={`text-[15px] leading-relaxed ${muted}`}>
            {item?.comment}
          </p>
          <small className={`text-xs font-semibold ${muted}`}>
            {format(item.createdAt)}
          </small>
        </div>
      </div>

      <div>
        <button
          type="button"
          aria-expanded={replyActive}
          className={toggleButtonClasses}
          onClick={() => {
            setReplyActive(!replyActive);
            setReviewId(item._id);
          }}
        >
          <BiMessage size={18} aria-hidden="true" />
          {!replyActive
            ? item?.commentReplies?.length !== 0
              ? `View replies (${item?.commentReplies?.length})`
              : user?.role === "admin"
                ? "Reply"
                : "No replies"
            : "Hide replies"}
        </button>
      </div>

      {replyActive && (
        <div className="ml-5 flex flex-col gap-5 border-l border-[#0B1020]/10 pl-4 dark:border-white/10">
          {item.commentReplies &&
            item.commentReplies.map((replyItem: IComment, index: number) => (
              <div key={index} className="flex gap-3">
                <Avatar
                  src={replyItem?.user?.avatar?.url}
                  alt={replyItem?.user?.name ?? "Reply avatar"}
                  size={32}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-sm font-bold">{replyItem.user.name}</h5>
                    {replyItem.user.role === "admin" && (
                      <VscVerifiedFilled
                        className="text-[#2F4BFF] dark:text-white"
                        aria-label="Instructor"
                      />
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${muted}`}>
                    {replyItem.comment || replyItem.answer}
                  </p>
                  <small className={`text-xs font-semibold ${muted}`}>
                    {format(replyItem.createdAt)}
                  </small>
                </div>
              </div>
            ))}

          {user?.role === "admin" && (
            <div className="flex gap-2.5">
              <input
                type="text"
                aria-label="Write a reply"
                className={inputClasses}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
              />
              <button
                className={replyButtonClasses}
                type="submit"
                onClick={handleReviewReplySubmit}
                disabled={reply === "" || replyCreationLoading}
              >
                Reply
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

interface CommentReplyProps {
  data: ICourseData[];
  activevideo: number;
  user?: IUser;
  answer: string;
  setAnswer: (answer: string) => void;
  handleAnswerSubmit: () => void;
  setQuestionId: (id: string) => void;
  answerCreationLoading: boolean;
}

const CommentReply = ({
  data,
  activevideo,
  user,
  answer,
  setAnswer,
  handleAnswerSubmit,
  setQuestionId,
  answerCreationLoading,
}: CommentReplyProps) => {
  return (
    <ul className="border-t border-[#0B1020]/10 dark:border-white/10">
      {data[activevideo]?.questions?.map((item: IComment, index: number) => (
        <CommentItem
          item={item}
          data={data}
          key={index}
          setQuestionId={setQuestionId}
          activevideo={activevideo}
          answer={answer}
          setAnswer={setAnswer}
          handleAnswerSubmit={handleAnswerSubmit}
          user={user}
          answerCreationLoading={answerCreationLoading}
        />
      ))}
    </ul>
  );
};

interface CommentItemProps {
  item: IComment;
  data: ICourseData[];
  setQuestionId: (id: string) => void;
  activevideo: number;
  answer: string;
  setAnswer: (answer: string) => void;
  handleAnswerSubmit: () => void;
  user?: IUser;
  answerCreationLoading: boolean;
}

const CommentItem = ({
  item,
  data,
  setQuestionId,
  activevideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  answerCreationLoading,
}: CommentItemProps) => {
  const [replyActive, setReplyActive] = useState(false);

  return (
    <li className="flex flex-col gap-2 border-b border-[#0B1020]/10 py-5 dark:border-white/10">
      <div className="flex gap-3.5">
        <Avatar
          src={item?.user?.avatar?.url}
          alt={item?.user?.name ?? "Comment avatar"}
          size={40}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <h5 className="text-sm font-bold">{item?.user?.name}</h5>
          <p className={`text-[15px] leading-relaxed ${muted}`}>
            {item?.question}
          </p>
          <small className={`text-xs font-semibold ${muted}`}>
            {item.createdAt ? format(item?.createdAt) : ""}
          </small>
        </div>
      </div>

      <div>
        <button
          type="button"
          aria-expanded={replyActive}
          className={toggleButtonClasses}
          onClick={() => {
            setReplyActive(!replyActive);
            setQuestionId(item._id);
          }}
        >
          <BiMessage size={18} aria-hidden="true" />
          {!replyActive
            ? item?.questionReplies?.length !== 0
              ? `View replies (${item?.questionReplies?.length})`
              : "Reply"
            : "Hide replies"}
        </button>
      </div>

      {replyActive && (
        <div className="ml-5 flex flex-col gap-5 border-l border-[#0B1020]/10 pl-4 dark:border-white/10">
          {item?.questionReplies &&
            item.questionReplies.map((replyItem: IComment, index: number) => (
              <div key={index} className="flex gap-3">
                <Avatar
                  src={replyItem?.user?.avatar?.url}
                  alt={replyItem?.user?.name ?? "Reply avatar"}
                  size={34}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-sm font-bold">{replyItem.user.name}</h5>
                    {replyItem.user.role === "admin" && (
                      <VscVerifiedFilled
                        className="text-[#2F4BFF] dark:text-white"
                        aria-label="Instructor"
                      />
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${muted}`}>
                    {replyItem.answer}
                  </p>
                  <small className={`text-xs font-semibold ${muted}`}>
                    {format(replyItem.createdAt)}
                  </small>
                </div>
              </div>
            ))}

          <div className="flex gap-2.5">
            <input
              type="text"
              aria-label="Write a reply"
              className={inputClasses}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write a reply..."
            />
            <button
              className={replyButtonClasses}
              type="submit"
              onClick={handleAnswerSubmit}
              disabled={answer === "" || answerCreationLoading}
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
export default CourseContentMedia;
