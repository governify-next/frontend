"use client";

import { UserInfo } from "@/types/user.types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<UserInfo>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "systemRole",
    header: "System Role",
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Login",
  },
];
