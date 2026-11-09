"use client";
import React, { useState } from "react";
import Heading from "../utills/Heading";
import AdminProtected from "../hooks/adminProtected";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import DashboardHero from "../components/Admin/DashboardHero";

const page = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning"
          description="Elearning is a platform for students to learn and get help from teachers"
          keywords="Programming, Mearn, Redux, Machine learning"
        />
        <div className="min-h-screen">
          <AdminSidebar
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
          {/* Content — pushed right on desktop to make room for sidebar */}
          <div className="min-[900px]:pl-[72px] transition-[padding] duration-300">
            <DashboardHero
              isDashboard={true}
              onMenuClick={() => setMobileOpen(true)}
            />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
