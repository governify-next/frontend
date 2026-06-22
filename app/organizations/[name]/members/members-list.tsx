"use client";
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
import { ItemList } from "@/components/item-list";
import { IMembership } from "@/types/organization.types";
import { avatarFallback } from "@/lib/utils/trimName";

export function MembersList({
  members,
  isOrgAdmin,
}: {
  members: IMembership[];
  isOrgAdmin: boolean;
}) {
  return (
    <ItemList
      className="w-full"
      data={members}
      renderItem={(member) => {
        const username = member.userId.username;
        return (
          <Item variant="outline">
            <ItemMedia>
              <Avatar>
                {/*TODO: hacer que las memberships devuelvan el avatar para meterlo y si no fallback*/}
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
                <Button variant="ghost" size="icon" aria-label="Member options">
                  <MoreVertical />
                </Button>
              )}
            </ItemActions>
          </Item>
        );
      }}
    />
  );
}
