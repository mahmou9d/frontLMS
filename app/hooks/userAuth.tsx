"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useUserAuth = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return !!user;
};
