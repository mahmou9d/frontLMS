"use client";
import { useState } from "react";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utills/Heading";
import CreateCourse from "@/app/components/Admin/Course/CreateCourse";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";

const page = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Create Course"
          description="Elearning is a platform for students to learn and get help from teachers"
          keywords="Programming, Mearn, Redux, Machine learning"
        />
        <div className="min-h-screen">
          <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
          <div className="min-[900px]:pl-[72px]">
            <DashboardHero onMenuClick={() => setMobileOpen(true)} />
            <CreateCourse />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
