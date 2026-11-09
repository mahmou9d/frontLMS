"use client";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loader from "../components/Loader/Loader";

interface AdminProtectedProps {
  children: React.ReactNode;
}
export default function AdminProtected({ children }: AdminProtectedProps) {
  const { user, isAuthLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isAuthLoading) {
    return <Loader />;
  }

  if (user) {
    const isAuthenticated = user.role === "admin";
    return isAuthenticated ? children : redirect("/");
  }
  redirect("/");
}
