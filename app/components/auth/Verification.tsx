"use client";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import React, { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Props = {
  setRoute: (route: string) => void;
};

type VarifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account Activated Successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data as { message?: string };
        toast.error(errorData.message || "An error occurred");
      } else {
        toast.error("Something went wrong");
      }
    }
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VarifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    const data = {
      activation_token: token,
      activation_code: verificationNumber,
    };
    await activation(data);
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="w-full px-1 sm:px-2 py-4">
      <h1 className="text-center mb-1.5 text-[1.55rem] font-extrabold">
        <span className="bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">
          Verify Account
        </span>
      </h1>
      <p className="text-center text-[0.82rem] font-medium mb-6 text-slate-500 dark:text-slate-400">
        Enter the 4-digit activation code sent to your email.
      </p>

      {/* Pulsing Icon */}
      <div
        className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full bg-indigo-500/[0.08] border-[1.5px] border-indigo-500/20 mx-auto mb-7 text-indigo-500
          after:content-[''] after:absolute after:-inset-1.5 after:rounded-full after:border-[1.5px] after:border-dashed after:border-indigo-500/35"
      >
        <VscWorkspaceTrusted size={36} />
      </div>

      {/* Input Slots */}
      <div className="flex justify-center gap-2 sm:gap-3.5 my-2 mb-7">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="text"
            key={index}
            ref={inputRefs[index]}
            className={`w-[13vw] min-w-[44px] max-w-[58px] h-[13vw] min-h-[44px] max-h-[58px] text-[1.1rem] sm:text-[1.4rem] font-extrabold text-center rounded-2xl outline-none text-inherit transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${
                invalidError
                  ? "border-2 border-red-500 bg-red-500/[0.03] shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                  : "border-2 border-indigo-500/[0.18] bg-indigo-500/[0.04] focus:border-indigo-500 focus:bg-indigo-500/[0.07] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)] focus:scale-105"
              }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VarifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>

      {/* Action Button */}
      <button
        className="group relative overflow-hidden w-full py-3 px-6 rounded-2xl cursor-pointer text-[0.9rem] font-bold text-white bg-gradient-to-br from-indigo-500 to-violet-500 border-none shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition-transform duration-200 text-center hover:shadow-[0_6px_22px_rgba(99,102,241,0.4)]"
        onClick={verificationHandler}
      >
        <span className="pointer-events-none absolute top-0 -left-full h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-[left] duration-500 group-hover:left-full" />
        Verify OTP
      </button>

      {/* Footer Link */}
      <div className="text-center text-[0.83rem] font-semibold mt-6 text-slate-500 dark:text-slate-300">
        Go back to sign in?
        <span
          className="text-indigo-500 cursor-pointer font-bold transition-colors duration-150 ml-1 hover:text-violet-500 hover:underline"
          onClick={() => setRoute("Login")}
        >
          Sign In
        </span>
      </div>
    </div>
  );
};

export default Verification;
