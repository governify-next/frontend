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
import { cn } from "@/lib/utils/cn";
import {
  removeOrganizationMember,
  updateOrganizationMemberRoles,
} from "@/data/organizations/actions";
import { MemberRolesPicker } from "./roles-picker";

const rolesVisibility = [
  { role: "", overflow: "@2xl/main:hidden" },
  {
    role: "hidden @2xl/main:inline-flex",
    overflow: "hidden @2xl/main:inline-flex @3xl/main:hidden",
  },
  {
    role: "hidden @3xl/main:inline-flex",
    overflow: "hidden @3xl/main:inline-flex",
  },
];

function RoleBadge({ role, className }: { role: IRole; className: string }) {
  return (
    <Badge
      variant="tinted"
      className={cn("capitalize", className)}
      style={{ color: role.color }}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {role.name}
    </Badge>
  );
}

function HiddenRolesBadge({
  roles,
  className,
}: {
  roles: IRole[];
  className: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="muted" tabIndex={0} className={className}>
          <span aria-hidden>+{roles.length}</span>
          <span className="sr-only">
            {pluralize(roles.length, "more role")}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {roles.map((role) => role.name).join(", ")}
      </TooltipContent>
    </Tooltip>
  );
}

function MemberRolesBadges({ roles }: { roles: IRole[] }) {
  if (roles.length === 0) {
    return <span className="text-xs text-muted-foreground">No roles</span>;
  }

  return (
    <>
      {roles.slice(0, rolesVisibility.length).map((role, index) => (
        <RoleBadge
          key={role._id}
          role={role}
          className={rolesVisibility[index].role}
        />
      ))}
      {rolesVisibility.map(
        ({ overflow }, index) =>
          roles.length > index + 1 && (
            <HiddenRolesBadge
              key={index}
              roles={roles.slice(index + 1)}
              className={overflow}
            />
          ),
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
          const isCreator = organization.createdBy === member.userId._id;

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
                  {isCreator && <Badge variant="outline">Creator</Badge>}
                </ItemTitle>
                <ItemDescription>
                  @{username} · {member.userId.email}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="gap-1">
                <div className="flex items-center gap-2">
                  <MemberRolesBadges roles={member.roles} />
                </div>
                <Separator
                  orientation="vertical"
                  className="mx-2 data-vertical:h-5 data-vertical:self-center"
                />
                <MemberRolesPicker
                  member={member}
                  roles={organization.roles}
                  organizationCreatorId={organization.createdBy}
                  onRolesChange={(rolesNames) =>
                    handleMemberRolesChange(username, rolesNames)
                  }
                />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Remove member ${username}`}
                  disabled={isCreator}
                  onClick={() => setMemberToRemove(username)}
                >
                  <Trash2 />
                </Button>
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
