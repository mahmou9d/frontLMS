"use client";
import { useState } from "react";
import Heading from "../utills/Heading";
import Header from "../components/Header";
import Protected from "../hooks/useProtected";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "../components/Footer";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user: data } = useSelector((state: RootState) => state.auth);
  const user = data ?? null;

  return (
    <div className="mt-16">
      <Protected>
        <Heading
          title={`${user?.name} — Profile`}
          description="Elearning is a platform for students to learn and get help from teachers"
          keywords="Programming, Mearn, Redux, Machine learning"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          route={route}
          setRoute={setRoute}
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <Profile user={user!} />
        </div>
        <Footer />
      </Protected>
    </div>
  );
}
