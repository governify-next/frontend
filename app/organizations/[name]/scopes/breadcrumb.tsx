"use client";

import { Fragment } from "react";
import { FolderTree } from "lucide-react";

import { IScopeNode } from "@/types/scope";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Index the tree by node _id for parent/child lookups.
export function indexScopeTree(tree: IScopeNode[]): Map<string, IScopeNode> {
  const byId = new Map<string, IScopeNode>();

  const indexTreeLevel = (nodes: IScopeNode[]) => {
    for (const node of nodes) {
      byId.set(node._id, node);
      indexTreeLevel(node.children);
    }
  };
  indexTreeLevel(tree);

  return byId;
}

// Path from "All folders" down to the current node, collapsing the middle
// into a "…" when deeper than 3: Home / root / … / parent / current.
export function ScopeBreadcrumb({
  byId,
  currentId,
  onNavigate,
}: {
  byId: Map<string, IScopeNode>;
  currentId: string | null;
  onNavigate: (id: string | null) => void;
}) {
  const current = currentId ? (byId.get(currentId) ?? null) : null;

  const path: IScopeNode[] = [];
  for (
    let node = current;
    node;
    node = node.parentId ? (byId.get(node.parentId) ?? null) : null
  ) {
    path.unshift(node);
  }
  const crumbs: (IScopeNode | null)[] =
    path.length > 3
      ? [path[0], null, path[path.length - 2], path[path.length - 1]]
      : path;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {current ? (
            <BreadcrumbLink asChild>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5"
                onClick={() => onNavigate(null)}
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
                    onClick={() => onNavigate(node._id)}
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
  );
}
