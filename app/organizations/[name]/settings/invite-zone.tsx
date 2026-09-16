"use client";

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
            <Button variant="outline" onClick={() => handleShowLink(true)}>
              New link
            </Button>
          )}
        </div>
      </CardHeader>
      {link && (
        <CardContent>
          <code className="block rounded-md border bg-muted px-2 py-2 text-xs">
            {link}
          </code>
        </CardContent>
      )}
    </Card>
  );
}
