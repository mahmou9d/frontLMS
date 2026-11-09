"use client";

import CourseDetailspage from "@/app/components/Course/CourseDetailspage";
import { use } from "react";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return (
    <div>
      <CourseDetailspage id={id} />
    </div>
  );
};

export default page;
