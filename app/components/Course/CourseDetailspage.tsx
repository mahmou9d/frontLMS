"use client";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Heading from "@/app/utills/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useGetStripePublishableKeyQuery,
  useCreatePaymentIntentMutation,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";

import { RootState } from "@/redux/store";
import { Stripe } from "@stripe/stripe-js";
import Loader from "../Loader/Loader";

type Props = {
  id: string;
};

const CourseDetailspage = ({ id }: Props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishableKeyQuery({});
  console.log("Stripe Config received:", config);
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (config) {
      setStripePromise(
        loadStripe(config?.publishablekey || config?.publishableKey),
      );
    }
    if (data && user) {
      const amount = Math.round(data?.course.price * 100);
      createPaymentIntent(amount);
    }
  }, [config, data, user]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.clientSecret);
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Heading
            title={data?.course?.name ?? "Course Details"}
            description={
              data?.course?.description ??
              "Explore this course on our platform."
            }
            keywords={data?.course?.tags ?? ""}
          />
          <Header
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
            activeItem={1}
          />
          <div className="cdp-root">
            <CourseDetails
              data={data?.course}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              setOpen={setOpen}
              setRoute={setRoute}
            />
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default CourseDetailspage;
