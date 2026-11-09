"use client";
import { useState } from "react";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utills/Heading";
import EditHero from "@/app/components/Customization/EditHero";

const page = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Hero"
          description="Elearning is a platform for students to learn and get help from teachers"
          keywords="Programming, Mearn, Redux, Machine learning"
        />
        <div className="min-h-screen">
          <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
          <div className="min-[900px]:pl-[72px]">
            <DashboardHero onMenuClick={() => setMobileOpen(true)} />
            <EditHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
