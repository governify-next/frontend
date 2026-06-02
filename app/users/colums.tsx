"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo, UserStatus } from "@/types/user.types";
import { ColumnDef } from "@tanstack/react-table";

export const columns = ({
  onStatusChange,
}: {
  onStatusChange: (userId: string, status: UserInfo["status"]) => void;
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
                onClick={() => onStatusChange(user._id, UserStatus.ACTIVE)}
              >
                Active
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={user.status === UserStatus.DISABLED}
                onClick={() => onStatusChange(user._id, UserStatus.DISABLED)}
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
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
    },
  ];
};
