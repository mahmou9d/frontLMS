"use client";

import { useEffect, useRef, FC, ReactNode } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {
  useLazyRefreshTokenQuery,
  useLazyLoadUserQuery,
} from "@/redux/features/api/apiSlice";
import Loader from "../components/Loader/Loader";
import { io } from "socket.io-client";
import { setAuthLoading } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL || "";
const socketId = io(ENDPOINT, { transports: ["websocket"] });

interface AuthInitializerProps {
  children: ReactNode;
}

const AuthInitializer: FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const didInit = useRef(false);

  const [refreshToken] = useLazyRefreshTokenQuery();
  const [loadUser] = useLazyLoadUserQuery();

  const isAuthLoading = useSelector(
    (state: RootState) => state.auth.isAuthLoading,
  );

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const initAuth = async () => {
      try {
        const { data, error } = await refreshToken();

        if (error || !data?.status) {
          console.log("ℹ️ No active session - user needs to login");
          return;
        }

        console.log("✅ Session restored successfully");

        const { error: userError } = await loadUser();
        if (userError) {
          console.error("Failed to load user data");
        }
      } catch (error) {
        console.error("❌ Unexpected auth initialization error:", error);
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    initAuth();
  }, [refreshToken, loadUser, dispatch]);
  useEffect(() => {
    socketId.on("connection", () => {});
  }, []);
  if (isAuthLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthInitializer;
