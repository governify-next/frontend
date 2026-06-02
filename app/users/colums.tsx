"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SystemRole,
  UserInfo,
  UserPayload,
  UserStatus,
} from "@/types/user.types";
import { ColumnDef } from "@tanstack/react-table";

export const columns = ({
  onUserChange,
}: {
  onUserChange: (userId: string, payload: UserPayload) => void;
}): ColumnDef<UserInfo>[] => {
  return [
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
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {user.status}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem
                disabled={user.status === UserStatus.ACTIVE}
                onClick={() =>
                  onUserChange(user._id, { status: UserStatus.ACTIVE })
                }
              >
                Active
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={user.status === UserStatus.DISABLED}
                onClick={() =>
                  onUserChange(user._id, { status: UserStatus.DISABLED })
                }
              >
                Disabled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "systemRole",
      header: "System Role",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {user.systemRole}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem
                disabled={user.systemRole === SystemRole.ADMIN}
                onClick={() =>
                  onUserChange(user._id, { systemRole: SystemRole.ADMIN })
                }
              >
                Admin
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={user.systemRole === SystemRole.USER}
                onClick={() =>
                  onUserChange(user._id, { systemRole: SystemRole.USER })
                }
              >
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
    },
  ];
};
