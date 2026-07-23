"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createOrganization } from "@/data/organizations/actions";
import { IOrganizationPayload } from "@/types/organization";
import { CreateOrganizationDialog } from "./add-organization-form";

export function OrganizationsAdminActions() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleOrganizationCreate = async (payload: IOrganizationPayload) => {
    const result = await createOrganization(payload);

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success("Organization created.");
    return true;
  };

  return (
    <>
      <Button onClick={() => setCreateOpen(true)}>
        <IconPlus />
        Add organization
      </Button>
      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleOrganizationCreate}
      />
    </>
  );
}
