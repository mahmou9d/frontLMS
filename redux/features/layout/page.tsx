import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroData: builder.query({
      query: (type: string) => ({
        url: `/get-layout/${type}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editLayout: builder.mutation({
      query: (body) => ({
        url: `/edit-layout`,
        method: "PUT",
        body,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;
