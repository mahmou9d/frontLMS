import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: { data },
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Course"],
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/edit-course/${id}`,
        method: "PUT",
        body: { data },
        credentials: "include" as const,
      }),
      invalidatesTags: ["Course"],
    }),
    getUserAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Course"],
    }),
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Course"],
    }),
    getCourseContent: builder.query({
      query: ({ id }) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Course"],
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: `add-question`,
        method: "PUT",
        body: { question, courseId, contentId },
        credentials: "include" as const,
      }),
    }),
    addNewAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "add-answer",
        method: "PUT",
        body: { answer, courseId, contentId, questionId },
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ rating, courseId, review }) => ({
        url: `add-review/${courseId}`,
        method: "PUT",
        body: { rating, review },
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }) => ({
        url: `add-reply`,
        method: "PUT",
        body: { comment, courseId, reviewId },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUserAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddNewAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
} = coursesApi;
