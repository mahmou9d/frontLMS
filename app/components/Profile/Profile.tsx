"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SideBarProfile from "./SideBarProfile";
import ProfileInfo from "./ProfileInfo";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ChangePassword from "./ChangePassword";
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import CoursesCard from "../Course/CoursesCard";
import { IUser, ICourse } from "@/app/types";

type Props = {
  user: IUser;
};

const PANEL =
  "rounded-3xl border border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020]";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const Profile: FC<Props> = ({ user }) => {
  const [active, setActive] = useState(1);
  const [avatar] = useState("");
  const [logout, setLogout] = useState(false);
  const { data, isLoading } = useGetUserAllCoursesQuery(undefined, {});
  const { isSuccess, error } = useLogoutQuery(undefined, { skip: !logout });

  const logoutHandler = () => setLogout(true);

  useEffect(() => {
    if (isSuccess) signOut();
    if (error) {
      console.error("Logout failed:", error);
      signOut();
    }
  }, [isSuccess, error]);

  const courses = useMemo(() => {
    const all = (data?.courses as ICourse[] | undefined) ?? [];
    return (user?.courses ?? [])
      .map((userCourse) => all.find((c) => c._id === userCourse.courseId))
      .filter((c): c is ICourse => c !== undefined);
  }, [data, user?.courses]);

  // The courses grid is made of bordered cards, so it sits on the page
  // instead of inside a second bordered panel.
  const boxed = active !== 3;

  return (
    <div className="mx-auto w-[95%] max-w-[1200px] pt-[90px] pb-6 sm:pt-[100px] sm:pb-10">
      <h1 className="mb-5 text-2xl font-black tracking-tight text-[#0B1020] dark:text-white sm:mb-6">
        Your account
      </h1>

      <div className="flex gap-3 sm:gap-6">
        {/* Sidebar: icons only on small screens, full labels from 800px */}
        <aside
          aria-label="Account"
          className={`${PANEL} sticky top-24 h-fit w-[60px] shrink-0 overflow-hidden 800px:w-[240px]`}
        >
          <SideBarProfile
            user={user}
            active={active}
            avatar={avatar}
            setActive={setActive}
            logoutHandler={logoutHandler}
          />
        </aside>

        {/* Main content */}
        <section className={`min-w-0 flex-1 ${PANEL} p-4 800px:p-8`}>
          {active === 1 && <ProfileInfo avatar={avatar} user={user} />}
          {active === 2 && <ChangePassword />}
          {active === 3 && (
            <EnrolledCourses courses={courses} isLoading={isLoading} />
          )}
        </section>
      </div>
    </div>
  );
};

function EnrolledCourses({
  courses,
  isLoading,
}: {
  courses: ICourse[];
  isLoading: boolean;
}) {
  const count = courses.length;

  return (
    <div>
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
          Enrolled courses
        </h2>
        {!isLoading && count > 0 && (
          <span className="text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            {count} {count === 1 ? "course" : "courses"}
          </span>
        )}
      </div>

      {isLoading ? (
        <p
          role="status"
          className="py-10 text-center text-sm font-semibold text-[#0B1020]/70 dark:text-white/70"
        >
          Loading your courses
        </p>
      ) : count === 0 ? (
        <div
          className={`${PANEL} flex flex-col items-center gap-4 px-4 py-12 text-center`}
        >
          <div>
            <p className="text-lg font-extrabold tracking-tight text-[#0B1020] dark:text-white">
              You haven&apos;t enrolled in any courses yet
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
              Courses you enroll in will show up here.
            </p>
          </div>
          <Link
            href="/courses"
            className={`inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] no-underline shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] ${FOCUS}`}
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((item) => (
            <CoursesCard course={item} key={item._id} isProfile />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
