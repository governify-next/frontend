"use client";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { AddRoleDialog } from "./add-role-form";
import { IRolePayload } from "@/types/organization.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addOrganizationRole } from "@/lib/organizations/actions";

export function AddRole({ orgName }: { orgName: string }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateRole = async (payload: IRolePayload) => {
    const result = await addOrganizationRole(orgName, payload);

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success("Role created.");
    return true;
  };

  return (
    <>
      <div className="text-end">
        <Button onClick={() => setCreateOpen(true)}>
          <IconPlus /> Add role
        </Button>
      </div>
      <AddRoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreateRole}
      />
    </>
  );
}
