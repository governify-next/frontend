"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ItemList } from "@/components/item/item-list";
import { IMembership, IOrganization, IRole } from "@/types/organization";
import { avatarFallback, pluralize } from "@/lib/utils/formatter";
import {
  removeOrganizationMember,
  updateOrganizationMemberRoles,
} from "@/data/organizations/actions";
import { MemberRolesPicker } from "./roles-picker";

function RoleBadge({ role }: { role: IRole }) {
  return (
    <Badge variant="muted">
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{ backgroundColor: role.color }}
      />
      {role.name}
    </Badge>
  );
}

function MemberRolesBadges({ roles }: { roles: IRole[] }) {
  if (roles.length === 0) {
    return <span className="text-xs text-muted-foreground">No roles</span>;
  }

  const hiddenRoles = roles.slice(3);

  return (
    <>
      {roles.slice(0, 3).map((role) => (
        <RoleBadge key={role._id} role={role} />
      ))}
      {hiddenRoles.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="muted" tabIndex={0}>
              <span aria-hidden>+{hiddenRoles.length}</span>
              <span className="sr-only">
                {pluralize(hiddenRoles.length, "more role")}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {hiddenRoles.map((role) => role.name).join(", ")}
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}

export function MembersList({
  members,
  organization,
}: {
  members: IMembership[];
  organization: IOrganization;
}) {
  const router = useRouter();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const handleMemberRemove = async () => {
    const result = await removeOrganizationMember(
      organization.name,
      memberToRemove!,
    );

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setMemberToRemove(null);
    router.refresh();
    toast.success("Member removed.");
  };

  const handleMemberRolesChange = async (
    username: string,
    rolesNames: string[],
  ) => {
    const result = await updateOrganizationMemberRoles(
      organization.name,
      username,
      rolesNames,
    );

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success("Roles updated.");
    return true;
  };

  return (
    <>
      <ItemList
        className="w-full"
        data={members}
        itemLabel="members"
        renderItem={(member) => {
          const username = member.userId.username;

          return (
            <Item variant="outline">
              <ItemMedia className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center">
                <Avatar>
                  <AvatarFallback>{avatarFallback(username)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle>
                  {member.userId.name} {member.userId.surname}
                </ItemTitle>
                <ItemDescription>
                  @{username} · {member.userId.email}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="gap-1">
                <div className="hidden items-center gap-1 @sm/main:flex">
                  <MemberRolesBadges roles={member.roles} />
                </div>
                <Separator
                  orientation="vertical"
                  className="mx-2 hidden data-vertical:h-5 data-vertical:self-center @sm/main:block"
                />
                <MemberRolesPicker
                  member={member}
                  roles={organization.roles}
                  organizationCreatorId={organization.createdBy}
                  onRolesChange={(rolesNames) =>
                    handleMemberRolesChange(username, rolesNames)
                  }
                />
                {organization.createdBy === member.userId._id ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          aria-label={`Remove member ${username}`}
                          disabled
                        >
                          <Trash2 />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      The organization creator can&apos;t be removed
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    aria-label={`Remove member ${username}`}
                    onClick={() => setMemberToRemove(username)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </ItemActions>
            </Item>
          );
        }}
      />
      <ConfirmDialog
        open={memberToRemove !== null}
        onOpenChange={() => setMemberToRemove(null)}
        title="Remove member?"
        description="This will remove this user from the organization."
        onConfirm={handleMemberRemove}
      />
    </>
  );
}
