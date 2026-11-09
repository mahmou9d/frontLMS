import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => ({
        url: "get-all-notifications",
        credentials: "include" as const,
        method: "GET",
      }),
    }),
    updateNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/update-notification/${id}`,
        method: "PUT",

        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetAllNotificationsQuery, useUpdateNotificationMutation } =
  notificationsApi;
