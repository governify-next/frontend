"use client";

import {
  Pagination,
  SystemRole,
  IUserInfo,
  IUserPayload,
  UserStatus,
  ICreateIUserPayload,
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
import {
  IconCheck,
  IconChevronDown,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react";
import { AlertDialogDestructive } from "@/components/alert-dialog";
import { EditUserDialog } from "./edit-form";
import { EditPasswordDialog } from "./password-form";
import { UsersFilters } from "./users-filters";
import { CreateUserDialog } from "./create-form";
import { useRouter } from "next/navigation";
import { useQueryParams } from "@/hooks/use-query-params";
import { toast } from "sonner";

const updateMessage = (payload: IUserPayload) => {
  if ("password" in payload) return "Password updated.";
  if ("status" in payload) return "User status updated.";
  if ("systemRole" in payload) return "User role updated.";
  return "User updated.";
};

const columns = ({
  onUserChange,
  onDeleteUserSessions,
  onDeleteUserRequest,
  onEditUser,
  onEditUserPassword,
}: {
  onUserChange: (userId: string, payload: IUserPayload) => void;
  onDeleteUserSessions: (userId: string) => void;
  onDeleteUserRequest: (userId: string) => void;
  onEditUser: (user: IUserInfo) => void;
  onEditUserPassword: (user: IUserInfo) => void;
}): ColumnDef<IUserInfo>[] => {
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
  users: IUserInfo[];
  pagination?: Pagination;
}) {
  const router = useRouter();
  const { setParams } = useQueryParams();

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<IUserInfo | null>(null);
  const [userToChangePassword, setUserToChangePassword] =
    useState<IUserInfo | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const tablePagination = {
    pageIndex: (pagination?.page ?? 1) - 1, // tan stack 1 based
    pageSize: pagination?.limit ?? 20,
  };

  const handlePaginationChange = (next: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const pageSizeChanged = next.pageSize !== tablePagination.pageSize;
    setParams({
      limit: String(next.pageSize),
      page: String(pageSizeChanged ? 1 : next.pageIndex + 1),
    });
  };

  const handleUserChange = async (userId: string, payload: IUserPayload) => {
    const result = await updateUser(userId, payload);

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success(updateMessage(payload));

    return true;
  };

  const handleUserCreate = async (payload: ICreateIUserPayload) => {
    const result = await createUser(payload);

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success(`User created.`);

    return true;
  };

  const handleUserDeleteSessions = async (userId: string) => {
    const result = await deleteUserSessions(userId);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    const deletedSessions = result.data.deletedSessions;
    deletedSessions === 0
      ? toast.info("No active sessions to remove.")
      : toast.success(
          `${deletedSessions} session${deletedSessions === 1 ? "" : "s"} removed.`,
        );
  };

  const handleUserDelete = async () => {
    const result = await deleteUser(userToDelete!);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setUserToDelete(null);
    router.refresh();
    toast.success("User deleted.");
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
