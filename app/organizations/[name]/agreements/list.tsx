"use client";
import Link from "next/link";
import { Eye, FileText } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemList } from "@/components/item-list";
import { IAgreementCollection } from "@/types/agreement";

export function AgreementsList({
  orgName,
  collections,
}: {
  orgName: string;
  collections: IAgreementCollection[];
}) {
  return (
    <ItemList
      className="w-full"
      data={collections}
      renderItem={(collection) => {
        const title = collection.displayName || collection.name;
        const hasVersions = collection.agreementVersions.length > 0;

        return (
          <Item variant="outline">
            <ItemMedia variant="icon">
              <FileText />
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            <ItemActions>
              {hasVersions ? (
                <>
                  <Badge variant="secondary">
                    {collection.auditableVersionNumber !== null
                      ? "Active"
                      : "Not active"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400"
                    asChild
                  >
                    <Link
                      href={`/organizations/${orgName}/agreements/${collection._id}`}
                      aria-label={`View ${title}`}
                    >
                      <Eye />
                    </Link>
                  </Button>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No versions yet
                </span>
              )}
            </ItemActions>
          </Item>
        );
      }}
    />
  );
}
