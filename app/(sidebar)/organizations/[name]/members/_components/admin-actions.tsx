"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addOrganizationMember } from "@/data/organizations/actions";
import { IMembershipPayload } from "@/types/organization";
import { AddMemberDialog } from "./add-form";

export function MembersAdminActions({ orgName }: { orgName: string }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleMemberAdd = async (payload: IMembershipPayload) => {
    const result = await addOrganizationMember(orgName, payload);

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success("Member added.");
    return true;
  };

  return (
    <>
      <Button onClick={() => setCreateOpen(true)}>
        <Plus />
        Add member
      </Button>
      <AddMemberDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleMemberAdd}
      />
    </>
  );
}
