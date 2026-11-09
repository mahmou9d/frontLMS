"use client";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import React, { FC, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import DeleteCourseModal from "./DeleteCourseModal";
import { ICourse } from "@/app/types";

type Props = {};

type Row = {
  id: string;
  title: string;
  rating: number;
  purchased: number;
  created_at: string;
};

// Design tokens
const COBALT = "#2F4BFF";
const INK = "#0B1020";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

// Round 40px icon button: quiet by default, ink/5 on hover
const ICON_BTN = `inline-flex h-10 w-10 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 hover:text-[#0B1020] motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white ${FOCUS}`;

// Signature hard-shadow CTA
const CTA = `inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${FOCUS}`;

const AllCourses: FC<Props> = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";
  const [courseId, setCourseId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteCourse, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteCourseMutation();
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (deleteError) {
      if ("data" in deleteError) {
        const errorData = deleteError as { data: { message: string } };
        toast.error(errorData.data.message);
      } else {
        toast.error("Couldn't delete the course. Try again.");
      }
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Course deleted");
      setDeleteOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteError, deleteSuccess]);

  const handleDeleteCourse = (id: string) => {
    deleteCourse(id);
  };

  const rows = useMemo<Row[]>(
    () =>
      ((data?.courses as ICourse[] | undefined) ?? []).map((item) => ({
        id: item._id,
        title: item.name,
        rating: item.rating,
        purchased: item.purchased,
        created_at: format(item.createdAt),
      })),
    [data],
  );

  if (!mounted) return <Loader />;

  const colums: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 100 },
    {
      field: "title",
      headerName: "Course title",
      flex: 1,
      minWidth: 200,
      cellClassName: "name-column--cell",
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.5,
      minWidth: 100,
      valueFormatter: (value: number) =>
        value ? Number(value).toFixed(1) : "No ratings",
    },
    { field: "purchased", headerName: "Purchased", flex: 0.5, minWidth: 120 },
    { field: "created_at", headerName: "Created", flex: 0.5, minWidth: 120 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      minWidth: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/admin/edit-course/${params.row.id}`}
          className={ICON_BTN}
          aria-label={`Edit ${params.row.title}`}
        >
          <AiFillEdit size={18} aria-hidden="true" />
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      minWidth: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <button
          type="button"
          className={ICON_BTN}
          aria-label={`Delete ${params.row.title}`}
          onClick={() => {
            setCourseId(params.row.id);
            setDeleteOpen(true);
          }}
        >
          <AiOutlineDelete size={18} aria-hidden="true" />
        </button>
      ),
    },
  ];

  // ink/70, ink/10, ink/5 (white equivalents in dark mode)
  const strong = isDark ? "#fff" : INK;
  const muted = isDark ? "rgba(255,255,255,0.7)" : "rgba(11,16,32,0.7)";
  const line = isDark ? "rgba(255,255,255,0.1)" : "rgba(11,16,32,0.1)";
  const hover = isDark ? "rgba(255,255,255,0.1)" : "rgba(11,16,32,0.05)";
  const selected = isDark ? "rgba(47,75,255,0.25)" : "rgba(47,75,255,0.08)";
  const focusRing = { outline: `2px solid ${COBALT}`, outlineOffset: "-2px" };

  return (
    <>
      <div className="mx-auto mt-[90px] max-w-[95%] rounded-3xl border border-[#0B1020]/10 bg-white p-4 dark:border-white/10 dark:bg-[#0B1020] sm:mt-[120px] sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
              All courses
            </h1>
            <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
              Manage your courses and track their ratings and sales
            </p>
          </div>
          <Link href="/admin/create-course" className={CTA}>
            Create course
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <Box
            sx={{
              height: "650px",
              width: "100%",
              color: strong,
              "& .MuiDataGrid-root": {
                border: `1px solid ${line}`,
                borderRadius: "24px",
                fontFamily: "inherit",
                backgroundColor: "transparent",
                color: strong,
                overflow: "hidden",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${line}`,
                color: muted,
                fontSize: "0.875rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              },
              "& .name-column--cell": { color: strong, fontWeight: 700 },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: `${hover} !important`,
                borderBottom: `1px solid ${line}`,
                color: strong,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "transparent !important",
                color: strong,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: "0.875rem",
                fontWeight: 800,
              },
              "& .MuiDataGrid-columnSeparator": { color: line },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "transparent !important",
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: "transparent !important",
                color: `${muted} !important`,
                fontWeight: 600,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${line}`,
                color: muted,
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-selectIcon, & .MuiIconButton-root":
                { color: muted },
              "& .MuiCheckbox-root": { color: `${muted} !important` },
              "& .MuiCheckbox-root.Mui-checked": {
                color: `${COBALT} !important`,
              },
              "& .MuiDataGrid-row": {
                backgroundColor: "transparent !important",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: `${hover} !important`,
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: `${selected} !important`,
              },
              "& .MuiInputBase-root": { color: strong },
              "& .MuiSvgIcon-root": { color: muted },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
                focusRing,
              "& .MuiDataGrid-iconButtonContainer .MuiIconButton-root:focus-visible, & .MuiTablePagination-root .MuiIconButton-root:focus-visible":
                focusRing,
            }}
          >
            <DataGrid
              checkboxSelection
              rows={rows}
              columns={colums}
              rowHeight={52}
              localeText={{
                noRowsLabel: "No courses yet. Create one to get started.",
              }}
            />
          </Box>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteCourseModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        courseId={courseId}
        handleDelete={handleDeleteCourse}
      />
    </>
  );
};

export default AllCourses;
