"use client";

import {
  Pagination,
  SystemRole,
  UserInfo,
  UserPayload,
  UserStatus,
  CreateUserPayload,
} from "@/types/user.types";
import { DataTable } from "../../components/data-table";
import { useState } from "react";
import {
  createUser,
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
import { IconCheck, IconChevronDown, IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { AlertDialogDestructive } from "@/components/alert-dialog";
import { EditUserDialog } from "./edit-form";
import { EditPasswordDialog } from "./password-form";
import { UsersFilters } from "./users-filters";
import { CreateUserDialog } from "./create-form";
import { useRouter, useSearchParams } from "next/navigation";

const columns = ({
  onUserChange,
  onDeleteUserSessions,
  onDeleteUserRequest,
  onEditUser,
  onEditUserPassword,
}: {
  onUserChange: (userId: string, payload: UserPayload) => void;
  onDeleteUserSessions: (userId: string) => void;
  onDeleteUserRequest: (userId: string) => void;
  onEditUser: (user: UserInfo) => void;
  onEditUserPassword: (user: UserInfo) => void;
}): ColumnDef<UserInfo>[] => {
  return [
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "surname",
      header: "Surname",
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
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem
                disabled={user.status === UserStatus.ACTIVE}
                onClick={() =>
                  onUserChange(user._id, { status: UserStatus.ACTIVE })
                }
              >
                ACTIVE
                {user.status === UserStatus.ACTIVE && (
                  <IconCheck className="ml-auto" />
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={user.status === UserStatus.DISABLED}
                onClick={() =>
                  onUserChange(user._id, { status: UserStatus.DISABLED })
                }
              >
                DISABLED
                {user.status === UserStatus.DISABLED && (
                  <IconCheck className="ml-auto" />
                )}
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
                <IconChevronDown />
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
                {user.systemRole === SystemRole.ADMIN && (
                  <IconCheck className="ml-auto" />
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={user.systemRole === SystemRole.USER}
                onClick={() =>
                  onUserChange(user._id, { systemRole: SystemRole.USER })
                }
              >
                User
                {user.systemRole === SystemRole.USER && (
                  <IconCheck className="ml-auto" />
                )}
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
              <DropdownMenuItem onSelect={() => onEditUserPassword(user)}>
                Change password
              </DropdownMenuItem>
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

export function UsersTable({
  users,
  pagination,
}: {
  users: UserInfo[];
  pagination?: Pagination;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserInfo | null>(null);
  const [userToChangePassword, setUserToChangePassword] =
    useState<UserInfo | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const tablePagination = {
    pageIndex: (pagination?.page ?? 1) - 1, // tan stack 1 based
    pageSize: pagination?.limit ?? 20,
  };

  const handlePaginationChange = (next: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const params = new URLSearchParams(searchParams);
    const pageSizeChanged = next.pageSize !== tablePagination.pageSize;
    params.set("limit", String(next.pageSize));
    params.set("page", String(pageSizeChanged ? 1 : next.pageIndex + 1));
    router.push(`?${params.toString()}`);
  };

  const handleUserChange = async (userId: string, payload: UserPayload) => {
    const updatedUser = await updateUser(userId, payload);

    if (!updatedUser) return false;

    router.refresh();

    return true;
  };

  const handleUserCreate = async (payload: CreateUserPayload) => {
    const createdUser = await createUser(payload);

    if (!createdUser) return false;

    router.refresh();

    return true;
  };

  const handleUserDeleteSessions = async (userId: string) => {
    return await deleteUserSessions(userId);
  };

  const handleUserDelete = async () => {
    const deleted = await deleteUser(userToDelete!);

    if (!deleted) return;

    setUserToDelete(null);
    router.refresh();
  };

  const tableColumns = columns({
    onUserChange: handleUserChange,
    onDeleteUserSessions: handleUserDeleteSessions,
    onDeleteUserRequest: setUserToDelete,
    onEditUser: setUserToEdit,
    onEditUserPassword: setUserToChangePassword,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <UsersFilters totalItems={pagination?.totalItems} />
        <Button onClick={() => setCreateOpen(true)}>
          <IconPlus />
          Add user
        </Button>
      </div>
      <DataTable
        columns={tableColumns}
        data={users}
        pageCount={pagination?.totalPages ?? 0}
        pagination={tablePagination}
        onPaginationChange={handlePaginationChange}
      />
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
      {userToChangePassword && (
        <EditPasswordDialog
          user={userToChangePassword}
          open={true}
          onOpenChange={() => setUserToChangePassword(null)}
          onUserChange={handleUserChange}
        />
      )}
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleUserCreate}
      />
    </div>
  );
}
