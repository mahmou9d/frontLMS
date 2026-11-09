"use client";
import React, { use, useEffect } from "react";
import { useLazyLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import CourseContent from "@/app/components/Course/CourseContent";

import { IUser } from "@/app/types";

type Props = {
  params: Promise<{ id: string }>;
};

const page = ({ params }: Props) => {
  const { id } = use(params);
  const [loadUser, { isLoading, error, data }] = useLazyLoadUserQuery();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (data) {
      const isPurchased = (data.user.courses as Array<{ courseId: string }>).find(
        (item: { courseId: string }) => item.courseId === id,
      );
      if (!isPurchased) {
        redirect("/");
      }
      if (error) {
        redirect("/");
      }
    }
  }, [data, error]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user={data?.user} />
        </div>
      )}
    </div>
  );
};

export default page;
