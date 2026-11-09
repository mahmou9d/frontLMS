/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { UserItmes, userLoggedIn, userLoggedOut } from "../auth/authSlice";
import { RootState } from "@/redux/store";

// Types
interface RefreshResponse {
  status: boolean;
  accessToken: string;
  user: UserItmes;
}

interface LoadUserResponse {
  success: boolean;
  accessToken: string;
  user: UserItmes;
}

// Base Query
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// ✅ تحسين الـ reauth logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("🔄 Token expired, attempting refresh...");

    const refreshResult = await baseQuery(
      { url: "refresh", method: "GET", credentials: "include" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken, user } = refreshResult.data as RefreshResponse;

      // ✅ حدّث الـ token في الـ state
      api.dispatch(userLoggedIn({ accessToken, user }));

      // ✅ أعد المحاولة بالـ token الجديد
      result = await baseQuery(args, api, extraOptions);

      console.log("✅ Token refreshed successfully");
    } else {
      console.log("❌ Refresh failed, logging out");
      api.dispatch(userLoggedOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Course"],
  endpoints: (builder) => ({
    refreshToken: builder.query<RefreshResponse, void>({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status) {
            dispatch(
              userLoggedIn({
                accessToken: data.accessToken,
                user: data.user,
              }),
            );
          }
        } catch (error: any) {
          const status = error?.error?.status || error?.status;
          if (status === 400 || status === 401) {
            dispatch(userLoggedOut());
          }
        }
      },
    }),

    loadUser: builder.query<LoadUserResponse, void>({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(
              userLoggedIn({
                accessToken: data.accessToken || "",
                user: data.user,
              }),
            );
          }
        } catch (error) {
          console.error("Load user failed:", error);
        }
      },
    }),
  }),
});

export const { useLazyRefreshTokenQuery, useLazyLoadUserQuery } = apiSlice;
