"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addOrganizationRole } from "@/data/organizations/actions";
import { IRolePayload } from "@/types/organization";
import { AddRoleDialog } from "./add-form";

export function RolesAdminActions({ orgName }: { orgName: string }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleRoleCreate = async (payload: IRolePayload) => {
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
      <Button onClick={() => setCreateOpen(true)}>
        <Plus />
        Add role
      </Button>
      <AddRoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleRoleCreate}
      />
    </>
  );
}
