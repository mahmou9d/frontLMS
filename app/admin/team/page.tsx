"use client";
import { useState } from "react";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utills/Heading";
import AllUsers from "../../components/Admin/Users/AllUsers";
import DashboardHero from "../../components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";

const TeamPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div>
      <AdminProtected>
        <Heading
          title="ELearning - Admin | Team"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="min-h-screen">
          <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
          <div className="min-[900px]:pl-[72px]">
            <DashboardHero onMenuClick={() => setMobileOpen(true)} />
            <AllUsers isTeam={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default TeamPage;
