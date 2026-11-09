"use client";
import React, { useState } from "react";
import Heading from "../utills/Heading";
import Header from "../components/Header";
import About from "./About";
import Footer from "../components/Footer";

const page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Heading
        title="About us - LMS"
        description="LMS is a learning management system"
        keywords="programming,react,nodejs,python,javascript,LMS"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <About />
      <Footer />
    </div>
  );
};

export default page;
