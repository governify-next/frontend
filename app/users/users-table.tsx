"use client";

import {
  SystemRole,
  UserInfo,
  UserPayload,
  UserStatus,
} from "@/types/user.types";
import { DataTable } from "../../components/data-table";
import { useActionState, useState } from "react";
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
import { AlertDialogDestructive } from "@/components/alert-dialog";
import { EditUserDialog } from "./edit-form";

const columns = ({
  onUserChange,
  onDeleteUserSessions,
  onDeleteUserRequest,
  onEditUser,
}: {
  onUserChange: (userId: string, payload: UserPayload) => void;
  onDeleteUserSessions: (userId: string) => void;
  onDeleteUserRequest: (userId: string) => void;
  onEditUser: (user: UserInfo) => void;
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
              <DropdownMenuItem onSelect={() => onEditUser(user)}>
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDeleteUserSessions(user._id)}>
                Remove sessions
              </DropdownMenuItem>
              <DropdownMenuItem>Change password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onDeleteUserRequest(user._id)}
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
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserInfo | null>(null);

  const handleUserChange = async (userId: string, payload: UserPayload) => {
    const updatedUser = await updateUser(userId, payload);

    if (!updatedUser) return false;

    setTableUsers((currentUsers) =>
      currentUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user,
      ),
    );

    return true;
  };

  const handleUserDeleteSessions = async (userId: string) => {
    return await deleteUserSessions(userId);
  };

  const handleUserDelete = async () => {
    const deleted = await deleteUser(userToDelete!);

    if (!deleted) return;

    setTableUsers((currentUsers) =>
      currentUsers.filter((user) => user._id !== userToDelete),
    );

    setUserToDelete(null);
  };

  const tableColumns = columns({
    onUserChange: handleUserChange,
    onDeleteUserSessions: handleUserDeleteSessions,
    onDeleteUserRequest: setUserToDelete,
    onEditUser: setUserToEdit,
  });

  return (
    <>
      <DataTable columns={tableColumns} data={tableUsers} />
      <AlertDialogDestructive
        open={userToDelete !== null}
        onOpenChange={() => {
          setUserToDelete(null);
        }}
        title="Delete User?"
        description="This will permanently delete this user in the system."
        onConfirm={handleUserDelete}
      />
      {userToEdit && (
        <EditUserDialog
          user={userToEdit}
          open={true}
          onOpenChange={() => setUserToEdit(null)}
          onUserChange={handleUserChange}
        />
      )}
    </>
  );
}
