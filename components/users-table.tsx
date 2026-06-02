"use client";

import { columns } from "@/app/users/colums";
import { UserInfo } from "@/types/user.types";
import { DataTable } from "./data-table";
import { useState } from "react";
import { updateUserStatus } from "@/lib/users/actions";

export function UsersTable({ users }: { users: UserInfo[] }) {
  const [tableUsers, setTableUsers] = useState(users);

  async function handleStatusChange(
    userId: string,
    status: UserInfo["status"],
  ) {
    const updatedUser = await updateUserStatus(userId, status);

    if (!updatedUser) return;

    setTableUsers((currentUsers) =>
      currentUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user,
      ),
    );
  }

  const tableColumns = columns({
    onStatusChange: handleStatusChange,
  });

  return (
    <div className="w-full overflow-x-auto">
      <DataTable columns={tableColumns} data={tableUsers} />
    </div>
  );
}
