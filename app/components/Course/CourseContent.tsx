"use client";
import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utills/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

import { IUser } from "@/app/types";
import Footer from "../Footer";

type Props = {
  id: string;
  user?: IUser;
};

const CourseContent = ({ id, user }: Props) => {
  const {
    data: contentData,
    isLoading,
    refetch,
  } = useGetCourseContentQuery(
    { id },
    { refetchOnMountOrArgChange: true, skip: !id },
  );
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const data = contentData?.content;
  const [activeVideo, setActiveVideo] = useState<number>(0);
  return (
    <div>
      {isLoading || !data ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-white text-[#0B1020] dark:bg-[#0B1020] dark:text-white">
          <Header
            activeItem={1}
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
          />
          <Heading
            title={data[activeVideo]?.title}
            description="LMS Course Access"
            keywords={data[activeVideo]?.tags}
          />
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 pb-32 pt-[96px] sm:px-6 sm:pt-[104px] lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            <div className="flex min-w-0 flex-col gap-5">
              <CourseContentMedia
                data={data}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                id={id}
                user={user}
                refetch={refetch}
              />
            </div>

            {/* Lesson panel: a cobalt strip with progress, then the list */}
            <aside
              aria-label="Course content"
              className="flex h-fit flex-col overflow-hidden rounded-3xl border border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020] lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]"
            >
              <div className="bg-[#2F4BFF] px-5 pb-4 pt-5 text-white">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <h2 className="text-xl font-extrabold tracking-tight">
                    Course content
                  </h2>
                  <p className="shrink-0 text-sm font-semibold">
                    Lesson {activeVideo + 1} of {data.length}
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-label="Course progress"
                  aria-valuemin={1}
                  aria-valuemax={data.length}
                  aria-valuenow={activeVideo + 1}
                  className="h-2 w-full overflow-hidden rounded-full bg-white/25"
                >
                  <div
                    className="h-full rounded-full bg-white transition-[width] duration-300 motion-reduce:transition-none"
                    style={{
                      width: `${((activeVideo + 1) / Math.max(data.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#0B1020]/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20">
                <CourseContentList
                  data={data}
                  activevideo={activeVideo}
                  setActiveVideo={setActiveVideo}
                />
              </div>
            </aside>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default CourseContent;
