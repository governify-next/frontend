"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronRight, FolderTree } from "lucide-react";

import { IScopeNode } from "@/types/scope";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderIcon } from "./folder-icon";

export function MoveScopeDialog({
  scope,
  tree,
  open,
  onOpenChange,
  onMove,
}: {
  scope: IScopeNode;
  tree: IScopeNode[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (newParentId: string | null) => Promise<boolean>;
}) {
  const [browsingId, setBrowsingId] = useState<string | null>(null); // folder shown in the dialog (null = root)
  const [selectedId, setSelectedId] = useState<string | null>(null); // selected row within the browsed folder
  const [moving, setMoving] = useState(false);

  const byId = useMemo(() => {
    const byId = new Map<string, IScopeNode>();
    const indexTreeLevel = (nodes: IScopeNode[]) => {
      for (const node of nodes) {
        byId.set(node._id, node);
        indexTreeLevel(node.children);
      }
    };
    indexTreeLevel(tree);
    return byId;
  }, [tree]);

  const browsing = browsingId ? (byId.get(browsingId) ?? null) : null;
  const rows = (browsing ? browsing.children : tree)
    .filter((node) => node._id !== scope._id) // hiding the moved folder to make its whole subtree unreachable
    .sort(
      (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name),
    );

  // Destination = selected row, or the folder being browsed when nothing is selected.
  const destinationId = selectedId ?? browsingId;
  const destinationName = destinationId
    ? (byId.get(destinationId)?.name ?? "")
    : "All folders";
  const isNoop = destinationId === (scope.parentId ?? null); // moving where it already lives

  const currentLocation = scope.parentId
    ? (byId.get(scope.parentId)?.name ?? "")
    : "All folders";

  // Build breadcrumb path
  const path: IScopeNode[] = [];
  for (
    let node = browsing;
    node;
    node = node.parentId ? (byId.get(node.parentId) ?? null) : null
  ) {
    path.unshift(node);
  }
  const crumbs: (IScopeNode | null)[] =
    path.length > 3
      ? [path[0], null, path[path.length - 2], path[path.length - 1]]
      : path;

  const browseTo = (id: string | null) => {
    setBrowsingId(id);
    setSelectedId(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) browseTo(null); // reopening always starts at root
    onOpenChange(open);
  };

  const handleConfirm = async () => {
    setMoving(true);
    const ok = await onMove(destinationId);
    setMoving(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Move {scope.name} to a new folder</DialogTitle>
          <DialogDescription className="inline-flex flex-wrap items-center gap-1.5">
            Current location:
            <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5">
              <FolderIcon className="size-3.5" />
              <strong>{currentLocation}</strong>
            </span>
          </DialogDescription>
        </DialogHeader>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {browsing ? (
                <BreadcrumbLink asChild>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1.5"
                    onClick={() => browseTo(null)}
                  >
                    <FolderTree className="size-3.5" />
                    All folders
                  </button>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <FolderTree className="size-3.5" />
                  All folders
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {crumbs.map((node, i) => (
              <Fragment key={node ? node._id : "ellipsis"}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {node === null ? (
                    <BreadcrumbEllipsis />
                  ) : i === crumbs.length - 1 ? (
                    <BreadcrumbPage
                      className="block max-w-40 truncate"
                      title={node.name}
                    >
                      {node.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <button
                        type="button"
                        className="max-w-40 cursor-pointer truncate"
                        title={node.name}
                        onClick={() => browseTo(node._id)}
                      >
                        {node.name}
                      </button>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex h-72 flex-col gap-1 overflow-y-auto">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This folder has no subfolders.
            </p>
          ) : (
            rows.map((row) => (
              <div
                key={row._id}
                role="button"
                tabIndex={0}
                title={row.name}
                onClick={() => setSelectedId(row._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(row._id);
                  }
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent",
                  selectedId === row._id && "bg-accent",
                )}
              >
                <FolderIcon className="w-6 shrink-0" />
                <span className="truncate text-sm">{row.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {row.type}
                </span>
                <Button
                  variant="outline"
                  size="icon-xs"
                  className="hover:bg-primary hover:text-primary-foreground"
                  aria-label={`Open ${row.name}`}
                  onClick={(e) => {
                    e.stopPropagation(); // navigate without selecting the row
                    browseTo(row._id);
                  }}
                >
                  <ChevronRight />
                </Button>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isNoop || moving} onClick={handleConfirm}>
            Move to &quot;{destinationName}&quot;
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
