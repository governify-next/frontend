"use client";
import Link from "next/link";
import { FileText } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { ItemList } from "@/components/item/item-list";
import { IAgreementCollection } from "@/types/agreement";
import { cn } from "@/lib/utils/cn";

const trackingColor = (active: boolean) =>
  active ? "bg-success" : "bg-muted-foreground/30";

function TrackingLegend() {
  return (
    <div className="flex justify-end gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className={cn("h-3 w-1 rounded-full", trackingColor(true))} />
        Auto-tracking
      </span>
      <span className="flex items-center gap-1.5">
        <span className={cn("h-3 w-1 rounded-full", trackingColor(false))} />
        Not tracking
      </span>
    </div>
  );
}

export function AgreementsList({
  orgName,
  collections,
}: {
  orgName: string;
  collections: (IAgreementCollection & { autoTracking: boolean })[];
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {collections.length > 0 && <TrackingLegend />}
      <ItemList
        data={collections}
        itemLabel="agreements"
        empty={{
          icon: <FileText />,
          title: "No agreements yet",
          description: "Agreements of this organization will appear here.",
        }}
        renderItem={(collection) => {
          const hasVersions = collection.agreementVersions.length > 0;
          const content = (
            <>
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-1",
                  trackingColor(collection.autoTracking),
                )}
              />
              <ItemContent className="min-w-0">
                <ItemTitle>
                  {collection.displayName || collection.name}
                </ItemTitle>
                {collection.description && (
                  <ItemDescription className="line-clamp-1">
                    {collection.description}
                  </ItemDescription>
                )}
                <span className="sr-only">
                  {collection.autoTracking
                    ? "Automatic monitoring active"
                    : "Automatic monitoring inactive"}
                </span>
              </ItemContent>
              <div className="hidden text-xs text-muted-foreground @lg/main:block">
                {collection.auditableVersionNumber !== null && (
                  <Badge variant="muted">
                    v{collection.auditableVersionNumber}
                  </Badge>
                )}
                {collection.auditableVersionNumber === null &&
                  (hasVersions ? "No active version" : "No versions yet")}
              </div>
            </>
          );

          return (
            <Item
              variant="outline"
              className="relative overflow-hidden pl-5"
              asChild={hasVersions}
            >
              {hasVersions ? (
                <Link
                  href={`/organizations/${orgName}/agreements/${collection._id}`}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </Item>
          );
        }}
      />
    </div>
  );
}
