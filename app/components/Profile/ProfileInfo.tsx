"use client";
import Image from "next/image";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/avatar.jpg";
import {
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from "@/redux/features/user/userApi";
import { useLazyLoadUserQuery } from "@/redux/features/api/apiSlice";
import { IUser } from "@/app/types";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: IUser;
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const LABEL =
  "mb-1.5 block text-sm font-semibold text-[#0B1020] dark:text-white";

const FIELD = `h-11 w-full rounded-2xl border border-[#0B1020]/10 bg-white px-4 text-sm font-semibold text-[#0B1020] placeholder:text-[#0B1020]/70 dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/70 ${FOCUS}`;

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [
    updateAvatar,
    { isSuccess: avatarSuccess, error: avatarError, isLoading: isUploading },
  ] = useUpdateAvatarMutation();
  const [
    editProfile,
    { isSuccess: profileSuccess, error: profileError, isLoading: isSaving },
  ] = useUpdateProfileMutation();
  const [loadUser] = useLazyLoadUserQuery();

  useEffect(() => {
    if (avatarSuccess) {
      loadUser();
      toast.success("Profile photo updated");
    }
  }, [avatarSuccess, loadUser]);

  useEffect(() => {
    if (avatarError) {
      toast.error(
        "We couldn't upload your photo. Use a PNG, JPG or WebP image and try again.",
      );
    }
  }, [avatarError]);

  useEffect(() => {
    if (profileSuccess) toast.success("Profile updated");
  }, [profileSuccess]);

  useEffect(() => {
    if (profileError) {
      toast.error(
        "We couldn't save your changes. Check your connection and try again.",
      );
    }
  }, [profileError]);

  const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updateAvatar(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await editProfile({ name: name.trim() });
  };

  const imageSrc = user?.avatar?.url || avatar || avatarIcon;
  const isDirty = name.trim() !== (user?.name || "");

  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
        My account
      </h2>

      {/* Identity row */}
      <div className="mt-6 flex flex-col items-center gap-4 border-b border-[#0B1020]/10 pb-6 text-center dark:border-white/10 sm:flex-row sm:text-left">
        <div className="shrink-0 rounded-full bg-[#FFD23F] p-[3px]">
          <Image
            src={imageSrc}
            alt="Your profile photo"
            width={80}
            height={80}
            className="block h-20 w-20 rounded-full border-2 border-white object-cover dark:border-[#0B1020]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold tracking-tight text-[#0B1020] dark:text-white">
            {user?.name}
          </p>
          <p className="truncate text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            {user?.email}
          </p>
        </div>

        <div>
          <input
            type="file"
            id="avatar"
            className="peer sr-only"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label
            htmlFor="avatar"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-semibold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F4BFF] dark:border-white/10 dark:text-white dark:hover:bg-white/10"
          >
            <AiOutlineCamera size={18} aria-hidden="true" />
            {isUploading ? "Uploading" : "Change photo"}
          </label>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="full-name" className={LABEL}>
              Full name
            </label>
            <input
              id="full-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={FIELD}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className={LABEL}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              aria-describedby="email-help"
              className={`${FIELD} cursor-not-allowed bg-[#0B1020]/5 text-[#0B1020]/70 dark:bg-white/10 dark:text-white/70`}
            />
            <p
              id="email-help"
              className="mt-1.5 text-sm text-[#0B1020]/70 dark:text-white/70"
            >
              You can't change your email here.
            </p>
          </div>
        </div>

        <div className="mt-6 flex sm:justify-end">
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className={`inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] ${FOCUS}`}
          >
            {isSaving ? "Saving" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
