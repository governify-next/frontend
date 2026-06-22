"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialogDestructive } from "@/components/alert-dialog";
import { ItemList } from "@/components/item-list";
import { IMembership } from "@/types/organization.types";
import { avatarFallback } from "@/lib/utils/trimName";
import { removeOrganizationMember } from "@/lib/organizations/actions";

export function MembersList({
  members,
  isOrgAdmin,
  orgName,
  currentUsername,
}: {
  members: IMembership[];
  isOrgAdmin: boolean;
  orgName: string;
  currentUsername?: string;
}) {
  const router = useRouter();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const handleMemberRemove = async () => {
    const removed = await removeOrganizationMember(orgName, memberToRemove!);

    if (!removed) {
      toast.error("Failed to remove member. Please try again.");
      return;
    }

    setMemberToRemove(null);
    router.refresh();
    toast.success("Member removed.");
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
                <ItemTitle>{username}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <span className="text-xs text-muted-foreground capitalize">
                  {member.roles[0]?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {member.roles.length} roles
                </span>
                {isOrgAdmin && (
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
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      {username !== currentUsername && (
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
                )}
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
    </>
  );
}
