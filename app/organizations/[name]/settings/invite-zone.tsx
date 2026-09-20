"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateOrganizationInviteToken } from "@/data/organizations/actions";
import { IOrganization } from "@/types/organization";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function InviteZone({
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
          <div className="flex items-center justify-between">
            <CardDescription>
              Create an invitation link so that new users can register and
              automatically join this organization.
            </CardDescription>
            {!link && (
              <Button variant="outline" onClick={() => handleShowLink()}>
                Show link
              </Button>
            )}
            {link && (
              <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                Regenerate link
              </Button>
            )}
          </div>
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
        description={`This will invalidate the previous invitation link.`}
        onConfirm={() => handleShowLink(true)}
        icon={<RefreshCcw />}
        confirmText="Confirm"
      />
    </>
  );
}
