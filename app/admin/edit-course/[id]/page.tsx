"use client";

import React, { useState } from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utills/Heading";
import EditCourse from "@/app/components/Admin/Course/EditCourse";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";

type Props = {
  params: Promise<{ id: string }>;
};

const page = ({ params }: Props) => {
  const { id } = React.use(params);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Edit Course"
          description="Elearning is a platform for students to learn and get help from teachers"
          keywords="Programming, Mearn, Redux, Machine learning"
        />
        <div className="min-h-screen">
          <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
          <div className="min-[900px]:pl-[72px]">
            <DashboardHero onMenuClick={() => setMobileOpen(true)} />
            <EditCourse id={id} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
