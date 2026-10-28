"use client";
import Link from "next/link";
import {
  Building2,
  FileText,
  Network,
  SearchX,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ItemList } from "@/components/item/item-list";
import { IOrganization } from "@/types/organization";
import { Pagination } from "@/types/pagination";
import { formatCompactNumber, pluralize } from "@/lib/utils/formatter";
import { cn } from "@/lib/utils/cn";

const getInitials = (label: string) =>
  label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function OrganizationQuickInfo({
  icon: Icon,
  iconClassName,
  count,
  label,
}: {
  icon: LucideIcon;
  iconClassName: string;
  count: number;
  label: string;
}) {
  const description = pluralize(count, label);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex w-full items-center justify-center gap-1 py-1.5 @2xl/main:w-16">
          <Icon className={cn("size-3.5", iconClassName)} />
          <span aria-hidden>{formatCompactNumber(count)}</span>
          <span className="sr-only">{description}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
}

export function OrganizationsList({
  organizations,
  pagination,
  query,
}: {
  organizations: IOrganization[];
  pagination: Pagination;
  query: string;
}) {
  return (
    <ItemList
      className="w-full"
      data={organizations}
      pagination={pagination}
      itemLabel="organizations"
      empty={
        query
          ? {
              icon: <SearchX />,
              title: "No organizations found",
              description: `No organizations match "${query}". Try a different search.`,
            }
          : {
              icon: <Building2 />,
              title: "No organizations yet",
              description:
                "Organizations you belong to or can manage will appear here.",
            }
      }
      renderItem={(org) => {
        const title = org.displayName || org.name;
        return (
          <Item variant="outline" asChild>
            <Link href={`/organizations/${org.name}`}>
              <ItemMedia className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center">
                <Avatar>
                  <AvatarFallback>{getInitials(title)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle>{title}</ItemTitle>
                {org.description && (
                  <ItemDescription className="break-words">
                    {org.description}
                  </ItemDescription>
                )}
              </ItemContent>
              <div className="grid w-full grid-cols-4 divide-x rounded-md border text-xs text-muted-foreground tabular-nums @2xl/main:w-auto">
                <OrganizationQuickInfo
                  icon={Users}
                  iconClassName="text-sky"
                  count={org.members}
                  label="member"
                />
                <OrganizationQuickInfo
                  icon={Shield}
                  iconClassName="text-violet"
                  count={org.roles.length}
                  label="role"
                />
                <OrganizationQuickInfo
                  icon={Network}
                  iconClassName="text-amber"
                  count={org.scopes}
                  label="scope"
                />
                <OrganizationQuickInfo
                  icon={FileText}
                  iconClassName="text-green"
                  count={org.collections}
                  label="agreement collection"
                />
              </div>
            </Link>
          </Item>
        );
      }}
    />
  );
}
