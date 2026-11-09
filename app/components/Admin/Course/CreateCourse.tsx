"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import { ICourseInfo, ICourseContentItem } from "@/app/types";

const CreateCourse = () => {
  const router = useRouter();
  const [createCourse, { isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully");
      router.push("/admin/courses");
    }
  }, [isSuccess, router]);

  useEffect(() => {
    if (!error) return;
    if ("data" in error) {
      const errorMessage = error as { data: { message: string } };
      toast.error(errorMessage.data.message);
    } else {
      toast.error(
        "Couldn't create the course. Check your connection and try again.",
      );
    }
  }, [error]);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState<ICourseInfo>({
    name: "",
    description: "",
    categories: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState<Array<{ title: string }>>([
    { title: "" },
  ]);
  const [prerequisites, setPrerequisites] = useState<Array<{ title: string }>>([
    { title: "" },
  ]);
  const [courseContentData, setCourseContentData] = useState<
    ICourseContentItem[]
  >([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      videoLength: "",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState<Record<string, any>>({});

  // Builds the payload shown in the preview step and sent on create.
  // The name is kept because CourseContent receives it as a prop.
  const handlerSumbit = () => {
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      categories: courseInfo.categories,
      price: Number(courseInfo.price),
      estimatedPrice: Number(courseInfo.estimatedPrice),
      tags: courseInfo.tags,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      thumbnail: courseInfo.thumbnail,
      benefits: benefits.map((benefit) => ({ title: benefit.title })),
      prerequisites: prerequisites.map((prerequisite) => ({
        title: prerequisite.title,
      })),
      courseData: courseContentData.map((item) => ({
        videoUrl: item.videoUrl,
        title: item.title,
        description: item.description,
        videoSection: item.videoSection,
        videoLength: item.videoLength,
        links: item.links,
        suggestion: item.suggestion,
      })),
    };
    setCourseData(data);
  };

  const handleCourseCreate = async () => {
    if (!isLoading) {
      await createCourse(courseData);
    }
  };

  return (
    <div className="w-full flex flex-col-reverse min-[900px]:flex-row min-h-screen">
      {/* Form content */}
      <div className="w-full min-[900px]:w-[75%] px-4 min-[900px]:pr-6">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            active={active}
            setActive={setActive}
            handlerSumbit={handlerSumbit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            courseData={courseData}
            active={active}
            setActive={setActive}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>

      {/* Steps sidebar */}
      <div className="w-full min-[900px]:w-[25%] mt-[90px] min-[900px]:mt-[120px] px-4 min-[900px]:pr-8">
        <div className="sticky top-[90px] min-[900px]:top-[120px] rounded-3xl border border-[#0B1020]/10 dark:border-white/10 bg-white dark:bg-[#0B1020] p-4">
          <CourseOptions active={active} setActive={setActive} />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
