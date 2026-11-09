"use client";
import { redirect } from "next/navigation";
import { useUserAuth } from "./userAuth";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loader from "../components/Loader/Loader";

interface Props {
  children: ReactNode;
}

export default function Protected({ children }: Props) {
  const isAuthenticated = useUserAuth();
  const isAuthLoading = useSelector(
    (state: RootState) => state.auth.isAuthLoading,
  );

  if (isAuthLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    redirect("/");
  }
}
