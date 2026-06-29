"use client";
import { InputSearch } from "@/components/input-search";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { AddRoleDialog } from "./add-role-form";
import { IRolePayload } from "@/types/organization.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addOrganizationRole } from "@/lib/organizations/actions";

export function RoleNav({ orgName }: { orgName: string }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateRole = async (payload: IRolePayload) => {
    const created = await addOrganizationRole(orgName, payload);

    if (!created) {
      toast.error("Failed to create role. Please try again.");
      return false;
    }

    router.refresh();
    toast.success("Role created.");
    return true;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <InputSearch placeholder="Search roles..." />
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
