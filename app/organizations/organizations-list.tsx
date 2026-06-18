"use client";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
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
import { ItemList } from "@/components/item-list";
import { IOrganization } from "@/types/organization.types";

const getInitials = (label: string) =>
  label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// TODO: reemplazar por el conteo real de miembros cuando la API tenga el endpoint.
const MEMBERS_PLACEHOLDER = 0;

export function OrganizationsList({
  organizations,
}: {
  organizations: IOrganization[];
}) {
  return (
    <ItemList
      className="w-full"
      data={organizations}
      renderItem={(org) => {
        const title = org.displayName || org.name;
        return (
          <Item variant="outline">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>{getInitials(title)}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              {org.description && (
                <ItemDescription>{org.description}</ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3.5" />
                {MEMBERS_PLACEHOLDER} members
              </span>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`/organizations/${org.name}`}
                  aria-label={`View ${title}`}
                >
                  <ChevronRight />
                </Link>
              </Button>
            </ItemActions>
          </Item>
        );
      }}
    />
  );
}
