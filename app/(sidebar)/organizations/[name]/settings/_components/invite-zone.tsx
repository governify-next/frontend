"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, RefreshCcw } from "lucide-react";
import { IOrganization } from "@/types/organization";
import { generateOrganizationInviteToken } from "@/data/organizations/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function InviteZone({
  organization,
  token,
}: {
  organization: IOrganization;
  token: string | null;
}) {
  const [link, setLink] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleShowLink = async (newToken: boolean = false) => {
    let inviteToken = token;
    if (!inviteToken || newToken) {
      const tokenResult = await generateOrganizationInviteToken(
        organization.name,
      );
      if (!tokenResult.ok) {
        toast.error(tokenResult.error);
        setLink(null);
        return;
      }
      inviteToken = tokenResult.data;
    }
    setLink(`${window.location.origin}/invites/${inviteToken}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invite zone</CardTitle>
          <CardDescription>
            Create an invitation link so that new users can register and
            automatically join this organization.
          </CardDescription>
          <CardAction className="self-center">
            {link ? (
              <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                Regenerate link
              </Button>
            ) : (
              <Button variant="outline" onClick={() => handleShowLink()}>
                <Eye />
                Show link
              </Button>
            )}
          </CardAction>
        </CardHeader>
        {link && (
          <CardContent>
            <code className="block overflow-x-auto whitespace-nowrap rounded-md border bg-muted px-2 py-2 text-xs">
              {link}
            </code>
          </CardContent>
        )}
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={() => setConfirmOpen(false)}
        title="Regenerate invitation link?"
        description="This will invalidate the previous invitation link."
        onConfirm={() => handleShowLink(true)}
        icon={<RefreshCcw />}
        confirmText="Confirm"
      />
    </>
  );
}
