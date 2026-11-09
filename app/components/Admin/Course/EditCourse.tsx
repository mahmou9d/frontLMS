"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetUserAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import { ICourse, ICourseInfo, ICourseContentItem } from "@/app/types";

type Props = {
  id: string;
};

const EditCourse = ({ id }: Props) => {
  const router = useRouter();
  const { data, refetch } = useGetUserAllCoursesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const editCourseData =
    data && (data.courses as ICourse[]).find((course) => course._id === id);

  const [editCourseMutation, { isSuccess, error }] = useEditCourseMutation();

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
  const [courseData, setCourseData] = useState<
    Partial<Omit<ICourse, "thumbnail">> & {
      thumbnail?: string | { public_id: string; url: string };
    }
  >({});

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully");
      refetch();
      router.push("/admin/courses");
    }
  }, [isSuccess, refetch, router]);

  useEffect(() => {
    if (!error) return;
    if ("data" in error) {
      const errorMessage = error as { data: { message: string } };
      toast.error(errorMessage.data.message);
    } else {
      toast.error(
        "Couldn't update the course. Check your connection and try again.",
      );
    }
  }, [error]);

  // Fill the form once the saved course has loaded.
  useEffect(() => {
    if (!editCourseData) return;
    setCourseInfo({
      name: editCourseData.name,
      description: editCourseData.description,
      categories: editCourseData.categories,
      // A price of 0 is valid (free course), so only blank out missing values.
      price: editCourseData.price != null ? String(editCourseData.price) : "",
      estimatedPrice: String(editCourseData.estimatedPrice || ""),
      tags: editCourseData.tags,
      level: editCourseData.level,
      demoUrl: editCourseData.demoUrl,
      thumbnail: editCourseData.thumbnail?.url || "",
    });
    setBenefits(editCourseData.benefits || [{ title: "" }]);
    setPrerequisites(editCourseData.prerequisites || [{ title: "" }]);
    // The backend stores content as courseData. Normalize links so the
    // content step never reads links[0] of an empty array.
    const rawContent =
      (editCourseData.courseData as unknown as ICourseContentItem[]) || [];
    setCourseContentData(
      rawContent.map((item) => ({
        ...item,
        links:
          item.links && item.links.length > 0
            ? item.links
            : [{ title: "", url: "" }],
      })),
    );
  }, [editCourseData]);

  // Builds the payload shown in the preview step and sent on update.
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
    await editCourseMutation({
      id: editCourseData?._id || "",
      data: courseData,
    });
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
            isEdit={true}
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

export default EditCourse;
