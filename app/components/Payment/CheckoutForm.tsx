"use client";
import { useLazyLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { io, Socket } from "socket.io-client";
import { ICourse, IUser } from "@/app/types";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL || "";

type Props = {
  setOpen: (open: boolean) => void;
  data: ICourse;
  user: IUser;
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const CheckoutForm = ({ setOpen, data, user }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [loadUser] = useLazyLoadUserQuery();
  const submitting = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  // One socket for the lifetime of the form, closed on unmount.
  useEffect(() => {
    if (!ENDPOINT) return;
    const socket = io(ENDPOINT, { transports: ["websocket"] });
    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const fail = (text: string) => {
    setMessage(text);
    setIsLoading(false);
    submitting.current = false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || submitting.current) return;

    submitting.current = true;
    setIsLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      return fail(
        error.message || "We couldn't process your payment. Try again.",
      );
    }

    if (paymentIntent?.status !== "succeeded") {
      return fail(
        "Your payment hasn't gone through yet. Wait a moment and try again, or use a different payment method.",
      );
    }

    try {
      await createOrder({
        courseId: data._id,
        payment_info: paymentIntent,
      }).unwrap();
    } catch (err) {
      const serverMessage = (err as { data?: { message?: string } })?.data
        ?.message;
      return fail(
        serverMessage ||
          "Your payment went through, but we couldn't add the course to your account. Contact support and we'll fix it.",
      );
    }

    socketRef.current?.emit("notification", {
      title: "new order",
      userId: user._id,
      message: `You have successfully purchased the course ${data?.name}`,
    });

    // Refresh the user so the course shows up as enrolled. The order already
    // exists, so a failure here shouldn't block access.
    await loadUser()
      .unwrap()
      .catch(() => undefined);

    // Stay in the loading state until the redirect, so the button can't be
    // pressed twice.
    setOpen(false);
    router.push(`/course-access/${data?._id}`);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      aria-busy={isLoading}
      className="mt-3 flex flex-col gap-5"
    >
      <LinkAuthenticationElement
        id="link-authentication-element"
        options={{ defaultValues: { email: user?.email } }}
      />
      <PaymentElement id="payment-element" />

      {message && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-2xl border-2 border-[#0B1020] px-4 py-3 text-sm font-semibold text-[#0B1020] dark:border-white dark:text-white"
        >
          <FiAlertCircle
            size={18}
            aria-hidden="true"
            className="mt-px shrink-0"
          />
          {message}
        </p>
      )}

      <button
        type="submit"
        id="submit"
        disabled={isLoading || !stripe || !elements}
        className={`inline-flex h-10 w-full items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] ${FOCUS}`}
      >
        {isLoading ? "Processing payment" : `Pay $${data?.price}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
