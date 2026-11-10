"use client";

import { Fragment } from "react";
import { Folders } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

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

export function ScopeBreadcrumb({
  byId,
  currentId,
  onNavigate,
  className,
}: {
  byId: Map<string, IScopeNode>;
  currentId: string | null;
  onNavigate: (id: string | null) => void;
  className?: string;
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
  const ancestors = path.slice(0, -1);
  const collapsedOnDesktop = ancestors.length > 2;

  const ancestorCrumb = (node: IScopeNode) => (
    <Fragment key={node._id}>
      <BreadcrumbSeparator className="max-lg:hidden" />
      <BreadcrumbItem className="max-lg:hidden">
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
      </BreadcrumbItem>
    </Fragment>
  );

  return (
    <Breadcrumb>
      <BreadcrumbList className={className}>
        <BreadcrumbItem>
          {current ? (
            <BreadcrumbLink asChild>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5"
                onClick={() => onNavigate(null)}
              >
                <Folders className="size-3.5" />
                <span className="max-lg:sr-only">All folders</span>
              </button>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="flex items-center gap-1.5">
              <Folders className="size-3.5" />
              <span className="max-lg:sr-only">All folders</span>
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {ancestors.length > 0 && (
          <>
            {ancestorCrumb(ancestors[0])}
            <BreadcrumbSeparator
              className={cn(!collapsedOnDesktop && "lg:hidden")}
            />
            <BreadcrumbItem className={cn(!collapsedOnDesktop && "lg:hidden")}>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex cursor-pointer items-center rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50">
                  <BreadcrumbEllipsis />
                  <span className="sr-only">Show hidden folders</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {ancestors.map((node, i) => (
                    <DropdownMenuItem
                      key={node._id}
                      className={cn(
                        (i === 0 || i === ancestors.length - 1) && "lg:hidden",
                      )}
                      onSelect={() => onNavigate(node._id)}
                    >
                      {node.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {ancestors.length > 1 && ancestorCrumb(ancestors[ancestors.length - 1])}

        {current && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage
                className="block max-w-40 truncate"
                title={current.name}
              >
                {current.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
