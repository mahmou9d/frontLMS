"use client";
import React, { useState } from "react";
import Heading from "../utills/Heading";
import Header from "../components/Header";
import FAQ from "./FAQ";
import Footer from "../components/Footer";

const FAQPage = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Heading
        title="FAQ - ELearning"
        description="Frequently Asked Questions - Find answers to all your queries about our online learning platform."
        keywords="FAQ, help, support, online courses, questions, programming"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <FAQ />
      <Footer />
    </div>
  );
};

export default FAQPage;
