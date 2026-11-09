"use client";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import React, { FC, useEffect, useMemo, useState } from "react";
import { AiFillEdit, AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import EditUserRoleModal from "./EditUserRoleModal";
import DeleteUserModal from "./DeleteUserModal";
import { IUser } from "@/app/types";

type Props = {
  isTeam?: boolean;
};

type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: number;
  createdAt: string;
};

// Design tokens
const COBALT = "#2F4BFF";
const INK = "#0B1020";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

// Round 40px icon button: quiet by default, ink/5 on hover
const ICON_BTN = `inline-flex h-10 w-10 items-center justify-center rounded-full text-[#0B1020]/70 transition-colors duration-150 hover:bg-[#0B1020]/5 hover:text-[#0B1020] motion-reduce:transition-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white ${FOCUS}`;

// Signature hard-shadow CTA
const CTA = `h-10 rounded-full border-2 border-[#0B1020] bg-[#FFD23F] px-5 text-sm font-bold text-[#0B1020] shadow-[3px_3px_0_#0B1020] transition-all duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#0B1020] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none dark:border-white dark:shadow-[3px_3px_0_#fff] dark:hover:shadow-[4px_4px_0_#fff] dark:active:shadow-none ${FOCUS}`;

const AllCourses: FC<Props> = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";
  const [active, setActive] = useState(false);
  const [userId, setUserId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (updateError && "data" in updateError) {
      const errorData = updateError as { data: { message: string } };
      toast.error(errorData.data.message);
    }
    if (isSuccess) {
      refetch();
      toast.success("User role updated");
      setActive(false);
    }
    if (deleteError && "data" in deleteError) {
      const errorData = deleteError as { data: { message: string } };
      toast.error(errorData.data.message);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("User deleted");
      setDeleteOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateError, isSuccess, deleteError, deleteSuccess]);

  const handleUpdateRole = (email: string, role: string) => {
    updateUserRole({ email, role });
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  const rows = useMemo<Row[]>(() => {
    const users = (data?.users as IUser[] | undefined) ?? [];
    const list = props.isTeam
      ? users.filter((item) => item.role === "admin")
      : users;
    return list.map((item) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      courses: item.courses.length,
      createdAt: item.createdAt,
    }));
  }, [data, props.isTeam]);

  if (!mounted) return <Loader />;

  const colums: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 100 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 0.5, minWidth: 200 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams) => (
        <span className="rounded-full bg-[#0B1020]/5 px-3 py-1 text-xs font-bold text-[#0B1020] first-letter:uppercase dark:bg-white/10 dark:text-white">
          {params.value}
        </span>
      ),
    },
    {
      field: "courses",
      headerName: "Purchased courses",
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: "createdAt",
      headerName: "Joined",
      flex: 0.5,
      minWidth: 120,
      valueFormatter: (value: string) => (value ? format(value) : ""),
    },
    {
      field: "edit",
      headerName: "Edit role",
      flex: 0.2,
      minWidth: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <button
          type="button"
          className={ICON_BTN}
          aria-label={`Edit role for ${params.row.name}`}
          onClick={() => {
            setUserId(params.row.id);
            setActive(true);
          }}
        >
          <AiFillEdit size={18} aria-hidden="true" />
        </button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      minWidth: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <button
          type="button"
          className={ICON_BTN}
          aria-label={`Delete ${params.row.name}`}
          onClick={() => {
            setUserId(params.row.id);
            setDeleteOpen(true);
          }}
        >
          <AiOutlineDelete size={18} aria-hidden="true" />
        </button>
      ),
    },
    {
      field: "mail",
      headerName: "Email",
      flex: 0.2,
      minWidth: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <a
          href={`mailto:${params.row.email}`}
          className={ICON_BTN}
          aria-label={`Email ${params.row.name}`}
        >
          <AiOutlineMail size={18} aria-hidden="true" />
        </a>
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
              {props.isTeam ? "Manage team access" : "Users management"}
            </h1>
            <p className="mt-1 max-w-2xl text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
              {props.isTeam
                ? "Review team members and change who has admin access"
                : "See registered students and the courses they have bought"}
            </p>
          </div>
          {props.isTeam && (
            <button
              type="button"
              className={CTA}
              onClick={() => setActive(true)}
            >
              Add team member
            </button>
          )}
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
                noRowsLabel: props.isTeam
                  ? "No team members yet. Add one to give them admin access."
                  : "No users yet. They will show up here after people sign up.",
              }}
            />
          </Box>
        )}
      </div>

      {/* Edit role modal */}
      <EditUserRoleModal
        open={active}
        setOpen={setActive}
        handleSubmit={handleUpdateRole}
      />

      {/* Delete confirmation modal */}
      <DeleteUserModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        userId={userId}
        handleDelete={handleDeleteUser}
      />
    </>
  );
};

export default AllCourses;
