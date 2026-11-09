import { apiSlice } from "../api/apiSlice";
import { IMonthData } from "@/app/types";

interface CoursesAnalyticsResponse {
  success: boolean;
  course: {
    last12Months: IMonthData[];
  };
}

interface UsersAnalyticsResponse {
  success: boolean;
  users: {
    last12Months: IMonthData[];
  };
}

interface OrdersAnalyticsResponse {
  success: boolean;
  orders: {
    last12Months: IMonthData[];
  };
}

export const analyicsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesAnalytics: builder.query<CoursesAnalyticsResponse, void>({
      query: () => ({
        url: "/get-courses-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUsersAnalytics: builder.query<UsersAnalyticsResponse, void>({
      query: () => ({
        url: "/get-users-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getOrdersAnalytics: builder.query<OrdersAnalyticsResponse, void>({
      query: () => ({
        url: "/get-orders-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});
export const {
  useGetCoursesAnalyticsQuery,
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} = analyicsApi;
