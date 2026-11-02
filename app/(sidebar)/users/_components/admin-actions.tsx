"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createUser } from "@/data/users/actions";
import { ICreateIUserPayload, SystemRole } from "@/types/user.types";
import { CreateUserDialog } from "./add-form";

export function UsersAdminActions({
  currentUserRole,
}: {
  currentUserRole: SystemRole;
}) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleUserCreate = async (payload: ICreateIUserPayload) => {
    const result = await createUser(payload);

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success("User created.");
    return true;
  };

  return (
    <>
      <Button onClick={() => setCreateOpen(true)}>
        <Plus />
        Add user
      </Button>
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleUserCreate}
        currentUserRole={currentUserRole}
      />
    </>
  );
}
