"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addOrganizationMember } from "@/lib/organizations/actions";
import { AddMemberDialog } from "./add-member-form";

export function MembersAdminActions({ orgName }: { orgName: string }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const handleMemberAdd = async (payload: { username: string }) => {
    const created = await addOrganizationMember(orgName, payload);

    if (!created) {
      toast.error("Failed to add member. Please try again.");
      return false;
    }

    router.refresh();
    toast.success("Member added.");
    return true;
  };

  return (
    <>
      <Button onClick={() => setCreateOpen(true)}>
        <IconPlus />
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
