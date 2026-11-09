"use client";
import React, { useState } from "react";
import Heading from "../utills/Heading";
import Header from "../components/Header";
import Policy from "./Policy";
import Footer from "../components/Footer";

const PolicyPage = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Heading
        title="Privacy Policy - ELearning"
        description="Read our privacy policy to understand how ELearning collects, uses, and protects your personal data."
        keywords="privacy policy, data protection, GDPR, elearning, terms"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Policy />
      <Footer />
    </div>
  );
};

export default PolicyPage;
