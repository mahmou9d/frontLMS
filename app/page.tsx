/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import React, { FC, useState, useEffect } from "react";
import Heading from "./utills/Heading";
import Header from "./components/Header";
import Hero from "./components/route/Hero";
import Courses from "./components/route/Courses";
import Reviews from "./components/route/Reviews";
import FAQ from "./components/route/FAQ";
import Footer from "./components/Footer";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  // const [login] = useLoginMutation();
  // const { user } = useSelector((state: RootState) => state.auth);

  // useEffect(() => {
  //   const hasAutoLoggedIn = localStorage.getItem("auto_logged_in_user");
  //   if (!hasAutoLoggedIn && !user) {
  //     login({ email: "mahmou9d98@gmail.com", password: "Qqwe123!@#" })
  //       .unwrap()
  //       .then(() => {
  //         localStorage.setItem("auto_logged_in_user", "true");
  //       })
  //       .catch((err) => {
  //         console.error("Auto login failed:", err);
  //       });
  //   }
  // }, [user, login]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#0B1020] dark:bg-[#0B1020] dark:text-white">
      <Heading
        title="Elearning"
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
      <main>
        <Hero />
        {/* Anchor for the "Explore courses" link in the hero */}
        <section id="courses" className="scroll-mt-24">
          <Courses />
        </section>
        <Reviews />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Page;
