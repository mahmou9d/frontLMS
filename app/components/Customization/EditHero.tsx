"use client";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/page";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import Loader from "../Loader/Loader";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const FIELD = `box-border w-full resize-y rounded-2xl border border-[#0B1020]/10 bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#0B1020] placeholder:text-[#0B1020]/70 focus:border-[#2F4BFF] ${FOCUS} dark:border-white/10 dark:bg-[#0B1020] dark:text-white dark:placeholder:text-white/70`;

const LABEL = "text-sm font-bold text-[#0B1020] dark:text-white";

// Signature hard-shadow CTA, with a flat disabled state
const CTA = `h-10 shrink-0 rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 enabled:hover:-translate-x-px enabled:hover:-translate-y-px enabled:hover:shadow-[4px_4px_0_#0B1020] enabled:active:translate-x-[3px] enabled:active:translate-y-[3px] enabled:active:shadow-none disabled:cursor-not-allowed disabled:border-[#0B1020]/10 disabled:bg-[#0B1020]/5 disabled:text-[#0B1020]/70 disabled:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:enabled:hover:shadow-[4px_4px_0_#fff] dark:enabled:active:shadow-none dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-white/70 ${FOCUS}`;

const EditHero = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const { data, isLoading, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading: editLoading, isSuccess, error }] =
    useEditLayoutMutation();

  useEffect(() => {
    if (data?.layout?.banner) {
      setImage(data.layout.banner.image?.url || "");
      setTitle(data.layout.banner.title || "");
      setSubtitle(data.layout.banner.subtitle || "");
    } else if (data?.data?.banner) {
      setImage(data.data.banner.image?.url || "");
      setTitle(data.data.banner.title || "");
      setSubtitle(data.data.banner.subtitle || "");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Hero updated");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as { data?: { message?: string } };
        toast.error(
          errorData?.data?.message || "Something went wrong. Try again.",
        );
      } else {
        toast.error("Something went wrong. Try again.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subtitle,
    });
  };

  const dbTitle =
    data?.layout?.banner?.title || data?.data?.banner?.title || "";
  const dbSubtitle =
    data?.layout?.banner?.subtitle || data?.data?.banner?.subtitle || "";
  const dbImage =
    data?.layout?.banner?.image?.url || data?.data?.banner?.image?.url || "";

  const isChanged =
    title !== dbTitle || subtitle !== dbSubtitle || image !== dbImage;
  const canSave = isChanged && !editLoading;

  const status = editLoading
    ? "Saving your changes."
    : isChanged
      ? "You have unsaved changes."
      : "All changes are saved.";

  return (
    <div className="mx-auto mb-[60px] mt-24 w-[95%] max-w-[1040px]">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="rounded-3xl border border-[#0B1020]/10 bg-white p-5 dark:border-white/10 dark:bg-[#0B1020] sm:p-8">
          <h1 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
            Customize hero banner
          </h1>
          <p className="mb-8 mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            Edit the text and image, and watch the preview update as you type.
          </p>

          <div className="grid grid-cols-1 items-start gap-8 min-[900px]:grid-cols-2">
            {/* Fields */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className={LABEL} htmlFor="title">
                  Hero title
                </label>
                <textarea
                  id="title"
                  placeholder="Write the main headline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  rows={4}
                  className={FIELD}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={LABEL} htmlFor="subtitle">
                  Hero subtitle
                </label>
                <textarea
                  id="subtitle"
                  placeholder="Write the supporting text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={4}
                  className={FIELD}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className={LABEL} id="banner-label">
                  Banner image
                </span>
                {/* The file input stays focusable; the label is its visible button */}
                <input
                  type="file"
                  id="banner"
                  accept="image/*"
                  className="peer sr-only"
                  aria-labelledby="banner-label"
                  onChange={handleUpdate}
                />
                <label
                  htmlFor="banner"
                  className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-[#0B1020]/10 px-4 text-sm font-bold text-[#0B1020] transition-colors duration-150 hover:bg-[#0B1020]/5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F4BFF] motion-reduce:transition-none dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                >
                  <AiOutlineCamera size={18} aria-hidden="true" />
                  {image ? "Change image" : "Upload image"}
                </label>
              </div>
            </div>

            {/* Live preview */}
            <section
              aria-label="Hero preview"
              className="min-[900px]:sticky min-[900px]:top-24"
            >
              <p className={`${LABEL} mb-1.5`}>Preview</p>
              <div className="overflow-hidden rounded-3xl border border-[#0B1020]/10 dark:border-white/10">
                <div className="flex aspect-[4/3] items-center justify-center bg-[#0B1020]/5 dark:bg-white/10">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt="Hero banner preview"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <p className="px-6 text-center text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                      No image yet. Upload one to see it here.
                    </p>
                  )}
                </div>
                <div className="p-5">
                  <p
                    className={`whitespace-pre-line break-words text-2xl font-black leading-tight tracking-tight ${
                      title
                        ? "text-[#0B1020] dark:text-white"
                        : "text-[#0B1020]/70 dark:text-white/70"
                    }`}
                  >
                    {title || "Your headline appears here"}
                  </p>
                  <p
                    className={`mt-2 whitespace-pre-line break-words text-sm font-semibold leading-relaxed ${
                      subtitle
                        ? "text-[#0B1020]/70 dark:text-white/70"
                        : "text-[#0B1020]/70 dark:text-white/70"
                    }`}
                  >
                    {subtitle || "Your supporting text appears here"}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
                This is a simplified preview. The homepage layout may differ.
              </p>
            </section>
          </div>

          {/* Sticky save bar */}
          <div className="sticky bottom-4 z-10 mt-8 flex flex-col items-stretch gap-3 rounded-3xl border border-[#0B1020]/10 bg-white p-3 dark:border-white/10 dark:bg-[#0B1020] sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:pl-5">
            <p
              role="status"
              className="text-sm font-semibold text-[#0B1020]/70 dark:text-white/70"
            >
              {status}
            </p>
            <button
              type="button"
              className={CTA}
              disabled={!canSave}
              aria-busy={editLoading}
              onClick={handleEdit}
            >
              {editLoading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditHero;
