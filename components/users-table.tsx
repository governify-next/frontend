"use client";

import { columns } from "@/app/users/colums";
import { UserInfo, UserPayload } from "@/types/user.types";
import { DataTable } from "./data-table";
import { useState } from "react";
import { deleteUserSessions, updateUser } from "@/lib/users/actions";

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

  const tableColumns = columns({
    onUserChange: handleUserChange,
    onDeleteUserSessions: handleUserDeleteSessions,
  });

  return (
    <div className="w-full overflow-x-auto">
      <DataTable columns={tableColumns} data={tableUsers} />
    </div>
  );
}
