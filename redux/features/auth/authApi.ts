import { apiSlice } from "../api/apiSlice";
import {
  UserItmes,
  userLoggedIn,
  userLoggedOut,
  userRegistration,
} from "./authSlice";

// Types
interface RegistrationResponse {
  message: string;
  activationToken: string;
}

interface ActivationResponse {
  message: string;
}
interface LoginResponse {
  accessToken: string;
  user: UserItmes;
  message: string;
}

interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

interface ActivationData {
  activation_token: string;
  activation_code: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userRegistration({ token: data.activationToken }));
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
    }),

    activation: builder.mutation<ActivationResponse, ActivationData>({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_code,
          activation_token,
        },
        credentials: "include",
      }),
    }),

    login: builder.mutation<LoginResponse, LoginData>({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include",
      }),
      invalidatesTags: ["User"], // يحدث الـ cache بعد الـ login
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: data.accessToken,
              user: data.user,
            }),
          );
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    logout: builder.query({
      query: () => ({
        url: "logout",
        method: "POST",
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),

    socialAuth: builder.mutation({
      query: ({ email, avatar, name }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, avatar, name },
        credentials: "include",
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(
              userLoggedIn({
                accessToken: data.accessToken,
                user: data.user,
              }),
            );
          }
        } catch (error) {
          console.error("Social auth failed:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogoutQuery,
} = authApi;
