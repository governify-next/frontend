"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialogDestructive } from "@/components/confirm-dialog";
import { ItemList } from "@/components/item-list";
import { IMembership, IOrganization, IRole } from "@/types/organization";
import { avatarFallback } from "@/lib/utils/trimName";
import {
  removeOrganizationMember,
  updateOrganizationMemberRoles,
} from "@/data/organizations/actions";
import { ChangeRoleDialog } from "./change-role";

export function MembersList({
  members,
  organization,
  roles,
}: {
  members: IMembership[];
  organization: IOrganization;
  roles: IRole[];
}) {
  const router = useRouter();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [memberToChangeRole, setMemberToChangeRole] = useState<{
    userId: string;
    username: string;
    currentRoles: IRole[];
  } | null>(null);

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

  const handleChangeRole = async (newRolesNames: string[]) => {
    const result = await updateOrganizationMemberRoles(
      organization.name,
      memberToChangeRole!.username!,
      newRolesNames,
    );

    if (!result.ok) {
      toast.error("Failed to change role. Please try again.");
      return;
    }

    setMemberToChangeRole(null);
    router.refresh();
    toast.success("Roles changed.");
  };

  return (
    <>
      <ItemList
        className="w-full"
        data={members}
        renderItem={(member) => {
          const username = member.userId.username;
          return (
            <Item variant="outline">
              <ItemMedia>
                <Avatar>
                  <AvatarFallback>{avatarFallback(username)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {member.userId.name} {member.userId.surname}
                </ItemTitle>
                <ItemDescription>{username}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="text-xs text-muted-foreground capitalize">
                  {member.roles[0]?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {member.roles.length} roles
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Member options"
                    >
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onSelect={() =>
                        setMemberToChangeRole({
                          userId: member.userId._id,
                          username: member.userId.username,
                          currentRoles: member.roles,
                        })
                      }
                    >
                      Change role
                    </DropdownMenuItem>
                    {organization.createdBy !== member.userId._id && (
                      <>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setMemberToRemove(username)}
                        >
                          Remove user
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          );
        }}
      />
      <AlertDialogDestructive
        open={memberToRemove !== null}
        onOpenChange={() => setMemberToRemove(null)}
        title="Remove member?"
        description="This will remove this user from the organization."
        onConfirm={handleMemberRemove}
      />
      {memberToChangeRole && (
        <ChangeRoleDialog
          open={true}
          onOpenChange={() => setMemberToChangeRole(null)}
          memberToChangeRole={memberToChangeRole}
          organizationCreatorId={organization.createdBy}
          currentRoles={memberToChangeRole.currentRoles}
          roles={roles}
          onSave={handleChangeRole}
        />
      )}
    </>
  );
}
