"use client";

import {
  SystemRole,
  IUserInfo,
  IUserPayload,
  UserStatus,
  ICreateIUserPayload,
  IBasicUserInfo,
} from "@/types/user.types";
import { DataTable } from "@/components/data-table/data-table";
import { useState } from "react";
import {
  createUser,
  deleteUser,
  deleteUserSessions,
  updateUser,
} from "@/data/users/actions";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { formatReadableDate } from "@/lib/utils/formatter";
import {
  IconCheck,
  IconChevronDown,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EditUserDialog } from "./edit-form";
import { EditPasswordDialog } from "./password-form";
import { UsersFilters } from "./filters";
import { AppliedUserFilters } from "./search-params";
import { CreateUserDialog } from "./add-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@/types/pagination";

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
  currentUser,
}: {
  onUserChange: (userId: string, payload: IUserPayload) => void;
  onDeleteUserSessions: (userId: string) => void;
  onDeleteUserRequest: (userId: string) => void;
  onEditUser: (user: IUserInfo) => void;
  onEditUserPassword: (user: IUserInfo) => void;
  currentUser: IBasicUserInfo;
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
              {currentUser.systemRole === SystemRole.SUPERADMIN && (
                <DropdownMenuItem
                  disabled={user.systemRole === SystemRole.SUPERADMIN}
                  onClick={() =>
                    onUserChange(user._id, {
                      systemRole: SystemRole.SUPERADMIN,
                    })
                  }
                >
                  Superadmin
                  {user.systemRole === SystemRole.SUPERADMIN && (
                    <IconCheck className="ml-auto" />
                  )}
                </DropdownMenuItem>
              )}

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
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => row.original.createdBy ?? "unknown",
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
  currentUser,
  appliedFilters,
}: {
  users: IUserInfo[];
  pagination?: Pagination;
  currentUser: IBasicUserInfo;
  appliedFilters: AppliedUserFilters;
}) {
  const router = useRouter();

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<IUserInfo | null>(null);
  const [userToChangePassword, setUserToChangePassword] =
    useState<IUserInfo | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

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
    currentUser,
  });

  return (
    <div className="flex flex-col gap-4">
      <UsersFilters
        totalItems={pagination?.totalItems}
        applied={appliedFilters}
        action={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <IconPlus />
            Add user
          </Button>
        }
      />
      <DataTable columns={tableColumns} data={users} pagination={pagination} />
      <ConfirmDialog
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
        currentUserRole={currentUser.systemRole}
      />
    </div>
  );
}
