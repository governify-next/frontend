"use client";

import {
  SystemRole,
  UserInfo,
  UserPayload,
  UserStatus,
} from "@/types/user.types";
import { DataTable } from "../../components/data-table";
import { useState } from "react";
import {
  deleteUser,
  deleteUserSessions,
  updateUser,
} from "@/lib/users/actions";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { formatReadableDate } from "@/lib/utils/formatDates";
import { IconDotsVertical } from "@tabler/icons-react";

const columns = ({
  onUserChange,
  onDeleteUserSessions,
  onDeleteUser,
}: {
  onUserChange: (userId: string, payload: UserPayload) => void;
  onDeleteUserSessions: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
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
      cell: ({ row }) => formatReadableDate(row.original.lastLoginAt),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Edit user</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteUserSessions(user._id)}>
                Remove sessions
              </DropdownMenuItem>
              <DropdownMenuItem>Change password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDeleteUser(user._id)}
              >
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export function UsersTable({ users }: { users: UserInfo[] }) {
  const [tableUsers, setTableUsers] = useState(users);

  const handleUserChange = async (userId: string, payload: UserPayload) => {
    const updatedUser = await updateUser(userId, payload);

    if (!updatedUser) return;

    setTableUsers((currentUsers) =>
      currentUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user,
      ),
    );
  };

  const handleUserDeleteSessions = async (userId: string) => {
    return await deleteUserSessions(userId);
  };

  const handleUserDelete = async (userId: string) => {
    const deleted = await deleteUser(userId);

    if (!deleted) return;

    setTableUsers((currentUsers) =>
      currentUsers.filter((user) => user._id !== userId),
    );
  };

  const tableColumns = columns({
    onUserChange: handleUserChange,
    onDeleteUserSessions: handleUserDeleteSessions,
    onDeleteUser: handleUserDelete,
  });

  return <DataTable columns={tableColumns} data={tableUsers} />;
}
