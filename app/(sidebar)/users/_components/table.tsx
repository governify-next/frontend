"use client";

import {
  SystemRole,
  IUserInfo,
  IUserPayload,
  UserStatus,
  IBasicUserInfo,
} from "@/types/user.types";
import { DataTable } from "@/components/data-table/data-table";
import { useState } from "react";
import {
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  avatarFallback,
  formatEnumLabel,
  formatReadableDate,
} from "@/lib/utils/formatter";
import { formatDistanceToNow } from "date-fns";
import {
  IconDots,
  IconKey,
  IconLogout,
  IconPencil,
  IconTrash,
  IconUserCheck,
  IconUserOff,
} from "@tabler/icons-react";
import { SearchX, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EditUserDialog } from "./edit-form";
import { EditPasswordDialog } from "./password-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@/types/pagination";

const updateMessage = (payload: IUserPayload) => {
  if ("password" in payload) return "Password updated.";
  if (payload.status === UserStatus.ACTIVE) return "User enabled.";
  if (payload.status === UserStatus.DISABLED) return "User disabled.";
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
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{avatarFallback(user.username)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="flex items-center gap-2 font-medium">
                {user.name} {user.surname}
                {user._id === currentUser._id && (
                  <Badge variant="outline">You</Badge>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                @{user.username} · {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === UserStatus.ACTIVE
              ? "success"
              : "destructive"
          }
        >
          <span className="size-1.5 rounded-full bg-current" />
          {formatEnumLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "systemRole",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="muted">
          {formatEnumLabel(row.original.systemRole)}
        </Badge>
      ),
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last login",
      cell: ({ row }) => {
        const { lastLoginAt } = row.original;

        if (!lastLoginAt) {
          return <span className="text-muted-foreground">Never</span>;
        }

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {formatDistanceToNow(new Date(lastLoginAt), {
                  addSuffix: true,
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>{formatReadableDate(lastLoginAt)}</TooltipContent>
          </Tooltip>
        );
      },
    },
    ...(currentUser.systemRole === SystemRole.SUPERADMIN
      ? [
          {
            accessorKey: "createdBy",
            header: "Created by",
            cell: ({ row }) =>
              row.original.createdBy ?? (
                <span className="text-muted-foreground">—</span>
              ),
          } satisfies ColumnDef<IUserInfo>,
        ]
      : []),
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        if (user._id === currentUser._id) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <IconDots />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => onEditUser(user)}>
                <IconPencil />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEditUserPassword(user)}>
                <IconKey />
                Change password
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDeleteUserSessions(user._id)}>
                <IconLogout />
                Remove sessions
              </DropdownMenuItem>
              {user.status === UserStatus.ACTIVE ? (
                <DropdownMenuItem
                  onSelect={() =>
                    onUserChange(user._id, { status: UserStatus.DISABLED })
                  }
                >
                  <IconUserOff />
                  Disable user
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={() =>
                    onUserChange(user._id, { status: UserStatus.ACTIVE })
                  }
                >
                  <IconUserCheck />
                  Enable user
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onDeleteUserRequest(user._id)}
              >
                <IconTrash />
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
  query,
  filtered,
}: {
  users: IUserInfo[];
  pagination?: Pagination;
  currentUser: IBasicUserInfo;
  query: string;
  filtered: boolean;
}) {
  const router = useRouter();

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<IUserInfo | null>(null);
  const [userToChangePassword, setUserToChangePassword] =
    useState<IUserInfo | null>(null);

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
    <>
      <DataTable
        columns={tableColumns}
        data={users}
        pagination={pagination}
        itemLabel="users"
        empty={
          filtered
            ? {
                icon: <SearchX />,
                title: "No users found",
                description: query
                  ? `No users match "${query}". Try a different search.`
                  : "No users match the selected filters. Try adjusting them.",
              }
            : {
                icon: <Users />,
                title: "No users yet",
                description: "Users you create will appear here.",
              }
        }
      />
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
          currentUserRole={currentUser.systemRole}
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
    </>
  );
}
