"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { AlertDialogDestructive } from "@/components/alert-dialog";
import { deleteOrganization } from "@/lib/organizations/actions";

export function DangerZone({ orgName }: { orgName: string }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    const deleted = await deleteOrganization(orgName);

    if (!deleted) {
      toast.error("Failed to delete organization. Please try again.");
      setConfirmOpen(false);
      return;
    }

    toast.success("Organization deleted.");
    router.push("/organizations");
  };

  return (
    <>
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-0">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Delete this organization</ItemTitle>
                <ItemDescription>
                  Once deleted, it cannot be recovered.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="destructive"
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete organization
                </Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      <AlertDialogDestructive
        open={confirmOpen}
        onOpenChange={() => setConfirmOpen(false)}
        title="Delete organization?"
        description={`This will permanently delete the organization and all its data.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
