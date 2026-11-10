"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import { AiOutlineMail } from "react-icons/ai";
import Loader from "../../Loader/Loader";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { IUser, ICourse, IOrder } from "@/app/types";

type Props = {
  isDashboard?: boolean;
};

type Row = {
  id: string;
  userName: string;
  userEmail: string;
  title: string;
  price: string;
  created_at: string;
};

// Design tokens
const COBALT = "#2F4BFF";
const INK = "#0B1020";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const AllInvoices = ({ isDashboard }: Props) => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";

  const { data, isLoading } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});
  console.log(data);
  useEffect(() => {
    setMounted(true);
  }, []);

  const rows = useMemo<Row[]>(() => {
    const orders = (data?.orders as IOrder[] | undefined) ?? [];
    const users = (usersData?.users as IUser[] | undefined) ?? [];
    const courses = (coursesData?.courses as ICourse[] | undefined) ?? [];

    return orders.map((item) => {
      const user = users.find((u) => u._id === item.userId);
      const course = courses.find((c) => c._id === item.courseId);
      return {
        id: item._id,
        userName: user?.name ?? "",
        userEmail: user?.email ?? "",
        title: course?.name ?? "",
        price: "$" + (course?.price ?? 0),
        created_at: item.createdAt ? format(item.createdAt) : "",
      };
    });
  }, [data, usersData, coursesData]);

  if (!mounted) return <Loader />;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.1, minWidth: 100 },
    {
      field: "userName",
      headerName: "User name",
      flex: 0.15,
      minWidth: 150,
      cellClassName: "name-column--cell",
    },
    ...(isDashboard
      ? []
      : [
          {
            field: "userEmail",
            headerName: "User email",
            flex: 0.2,
            minWidth: 200,
          },
          {
            field: "title",
            headerName: "Course title",
            flex: 0.2,
            minWidth: 200,
          },
        ]),
    { field: "price", headerName: "Price", flex: 0.1, minWidth: 100 },
    ...(isDashboard
      ? [
          {
            field: "created_at",
            headerName: "Created",
            flex: 0.15,
            minWidth: 150,
          },
        ]
      : [
          {
            field: "email",
            headerName: "Email",
            flex: 0.08,
            minWidth: 80,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams) => (
              <a
                href={`mailto:${params.row.userEmail}`}
                aria-label={`Email ${params.row.userName || "this user"}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 hover:text-[#2F4BFF] motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white ${FOCUS}`}
              >
                <AiOutlineMail className="text-xl" aria-hidden="true" />
              </a>
            ),
          },
        ]),
  ];

  // ink/70, ink/10, ink/5 (white equivalents in dark mode)
  const strong = isDark ? "#fff" : INK;
  const muted = isDark ? "rgba(255,255,255,0.7)" : "rgba(11,16,32,0.7)";
  const line = isDark ? "rgba(255,255,255,0.1)" : "rgba(11,16,32,0.1)";
  const hover = isDark ? "rgba(255,255,255,0.1)" : "rgba(11,16,32,0.05)";
  const selected = isDark ? "rgba(47,75,255,0.25)" : "rgba(47,75,255,0.08)";
  const focusRing = { outline: `2px solid ${COBALT}`, outlineOffset: "-2px" };

  return (
    <div
      className={
        isDashboard
          ? ""
          : "mx-auto mt-[80px] max-w-[95%] rounded-3xl border border-[#0B1020]/10 bg-white p-4 dark:border-white/10 dark:bg-[#0B1020] sm:mt-[120px] sm:p-8"
      }
    >
      {/* Page header (full page only) */}
      {!isDashboard && (
        <div className="mb-6">
          <h1 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
            Invoices and billing
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            Track course purchases and transaction history
          </p>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            height: isDashboard ? "350px" : "620px",
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
            "& .name-column--cell": {
              color: strong,
              fontWeight: 700,
            },
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
            "& .MuiDataGrid-row": { backgroundColor: "transparent !important" },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: `${hover} !important`,
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: `${selected} !important`,
            },
            "& .MuiDataGrid-toolbarContainer": {
              borderBottom: `1px solid ${line}`,
              padding: "8px 12px",
              gap: "4px",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${strong} !important`,
              fontWeight: 700,
              fontSize: "0.8125rem",
              textTransform: "none",
              borderRadius: "9999px",
              minHeight: "40px",
              padding: "0 12px",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text:hover": {
              backgroundColor: hover,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text:focus-visible":
              focusRing,
            "& .MuiInputBase-root": { color: strong },
            "& .MuiSvgIcon-root": { color: muted },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
              focusRing,
            "& .MuiDataGrid-iconButtonContainer .MuiIconButton-root:focus-visible, & .MuiTablePagination-root .MuiIconButton-root:focus-visible":
              focusRing,
          }}
        >
          <DataGrid
            checkboxSelection={!isDashboard}
            rows={rows}
            columns={columns}
            rowHeight={52}
            localeText={{
              noRowsLabel:
                "No invoices yet. They will show up here after a student buys a course.",
            }}
            slots={isDashboard ? {} : { toolbar: GridToolbar }}
          />
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
