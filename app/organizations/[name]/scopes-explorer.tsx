"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import { FolderTree, Info, Plus, Trash2 } from "lucide-react";

import { IScopeNode, IScopePayload } from "@/types/scope";
import { createScope, deleteScope, updateScope } from "@/data/scopes/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlertDialogDestructive } from "@/components/confirm-dialog";
import { FolderIcon } from "./folder-icon";
import { ScopeDetailsDialog } from "./scope-details-dialog";
import { AddScopeDialog } from "./add-scope-form";

function groupByType(nodes: IScopeNode[]): [string, IScopeNode[]][] {
  const groups = new Map<string, IScopeNode[]>();

  for (const node of nodes) {
    const group = groups.get(node.type) ?? [];
    group.push(node);
    groups.set(node.type, group);
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)); // sort alphabetically
}

export function ScopesExplorer({
  orgName,
  tree,
}: {
  orgName: string;
  tree: IScopeNode[];
}) {
  const router = useRouter();
  const [scope, setScope] = useQueryState("scope", parseAsString); // scope = current node _id (null = home)
  const [addOpen, setAddOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Index the tree: node by _id and the distinct organization types.
  const { byId, existingTypes } = useMemo(() => {
    const byId = new Map<string, IScopeNode>();
    const types = new Set<string>();

    const indexTreeLevel = (nodes: IScopeNode[]) => {
      for (const node of nodes) {
        byId.set(node._id, node);
        types.add(node.type);
        indexTreeLevel(node.children);
      }
    };
    indexTreeLevel(tree);

    return {
      byId,
      existingTypes: [...types].sort((a, b) => a.localeCompare(b)),
    };
  }, [tree]);

  const current = scope ? (byId.get(scope) ?? null) : null; // scope not found is treated as home
  const children = current ? current.children : tree; // home treated with root scopes as children

  // Build breadcrumb path from current to root adding parents at the beginning.
  const path: IScopeNode[] = [];
  for (
    let node = current;
    node;
    node = node.parentId ? (byId.get(node.parentId) ?? null) : null
  ) {
    path.unshift(node);
  }
  // Collapse the middle of the path into a "…" when deeper than 3: Home / root / … / parent / current.
  const crumbs: (IScopeNode | null)[] =
    path.length > 3
      ? [path[0], null, path[path.length - 2], path[path.length - 1]]
      : path;

  const handleCreate = async (
    payload: Pick<IScopePayload, "name" | "description" | "type" | "config">, // TODO: replace with IScopePayload when fields/permissions are added
  ) => {
    const result = await createScope(orgName, {
      ...payload,
      parentId: current?._id,
      fields: [],
      permissions: { view: [], edit: [], delete: [], create: [] },
    });

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    toast.success("Folder created.");
    router.refresh();
    return true;
  };

  const handleSave = async (
    payload: Pick<IScopePayload, "name" | "description" | "type" | "config">, // TODO: replace with IScopePayload when fields/permissions are added
  ) => {
    if (!current) return false;

    const result = await updateScope(orgName, current.name, {
      ...payload,
      fields: current.fields,
      permissions: current.permissions,
    });

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    toast.success("Folder updated.");
    router.refresh();
    return true;
  };

  const handleDelete = async () => {
    if (!current) return;

    const result = await deleteScope(orgName, current.name);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Folder deleted.");
    setScope(current.parentId ?? null, { history: "push" }); // navigate to parent (or home)
    setConfirmDelete(false);
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-4">
      <div className="flex flex-col gap-3 @4xl/main:flex-row @4xl/main:items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {current ? (
                <BreadcrumbLink asChild>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1.5"
                    onClick={() => setScope(null, { history: "push" })}
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
                        onClick={() => setScope(node._id, { history: "push" })}
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

        <div className="flex flex-wrap gap-2 @4xl/main:ml-auto @4xl/main:justify-end">
          {current && (
            <Button variant="outline" onClick={() => setDetailsOpen(true)}>
              <Info />
              Details
            </Button>
          )}
          <Button onClick={() => setAddOpen(true)}>
            <Plus />
            New folder
          </Button>
          {current && (
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 />
              Delete folder
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization structure</CardTitle>
          <CardDescription>
            {current
              ? `Browse the folders inside ${current.name}. Open one to see its contents.`
              : "Browse your organization's folders. Open one to see its contents."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {children.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {current
                ? "This folder is empty. Use “New folder” to add one inside."
                : "No folders yet. Create your first folder to start organizing your organization."}
            </p>
          ) : (
            groupByType(children).map(([type, nodes]) => (
              <div key={type} className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {type}
                </p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-1">
                  {nodes.map((child) => (
                    <button
                      key={child._id}
                      type="button"
                      title={child.name}
                      className="flex cursor-pointer flex-col items-center gap-1 rounded-lg p-3 hover:bg-accent"
                      onClick={() => setScope(child._id, { history: "push" })}
                    >
                      <FolderIcon className="w-16 drop-shadow-sm" />
                      <span className="line-clamp-2 w-full break-words text-center text-sm leading-tight">
                        {child.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {child.children.length === 0
                          ? "Empty"
                          : `${child.children.length} ${child.children.length === 1 ? "folder" : "folders"}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {current && (
        <ScopeDetailsDialog
          key={current._id}
          scope={current}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          onSave={handleSave}
          existingTypes={existingTypes}
        />
      )}

      <AddScopeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={handleCreate}
        existingTypes={existingTypes}
        parentName={current?.name}
      />

      <AlertDialogDestructive
        open={confirmDelete}
        onOpenChange={() => setConfirmDelete(false)}
        title="Delete this folder?"
        description={`This will permanently delete "${current?.name}" and everything inside it. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
