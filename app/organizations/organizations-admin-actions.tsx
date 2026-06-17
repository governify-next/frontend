"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createOrganization } from "@/lib/organizations/actions";
import { IOrganization } from "@/types/organization.types";
import { CreateOrganizationDialog } from "./create-form";

export function OrganizationsAdminActions() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleOrganizationCreate = async (payload: IOrganization) => {
    const created = await createOrganization(payload);

    if (!created) {
      toast.error("Failed to create organization. Please try again.");
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
