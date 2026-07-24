"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import { FolderInput, FolderTree, Pencil, Plus, Trash2 } from "lucide-react";

import { IScopeNode, IScopePayload } from "@/types/scope";
import { createScope, deleteScope, updateScope } from "@/data/scopes/actions";
import { Badge } from "@/components/ui/badge";
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
import { AddScopeDialog } from "./add-scope-form";
import { EditScopeDialog } from "./edit-scope-dialog";
import { MoveScopeDialog } from "./move-scope-dialog";
import { ScopeConfigCard } from "./scope-config-card";

function groupByType(nodes: IScopeNode[]): [string, IScopeNode[]][] {
  const groups = new Map<string, IScopeNode[]>();

  for (const node of nodes) {
    const group = groups.get(node.type) ?? [];
    group.push(node);
    groups.set(node.type, group);
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)); // sort alphabetically
}

// Full update payload for a node, update handlers patch over this to change one thing at a time.
const toPayload = (scope: IScopeNode): IScopePayload => ({
  name: scope.name,
  description: scope.description,
  type: scope.type,
  config: scope.config,
  parentId: scope.parentId ?? null,
  fields: scope.fields,
  permissions: scope.permissions,
});

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
  const [addType, setAddType] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
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

  const openAdd = (type: string) => {
    setAddType(type);
    setAddOpen(true);
  };

  const handleCreate = async (
    payload: Pick<IScopePayload, "name" | "description" | "type">,
  ) => {
    const result = await createScope(orgName, {
      ...payload,
      parentId: current?._id ?? null,
      config: {}, // configured later from the Configuration card
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

  const handleSave = async (patch: Partial<IScopePayload>) => {
    if (!current) return false;

    const result = await updateScope(orgName, current._id, {
      ...toPayload(current),
      ...patch,
    });

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    toast.success("Folder updated.");
    router.refresh();
    return true;
  };

  const handleMove = async (newParentId: string | null) => {
    if (!current) return false;

    const result = await updateScope(orgName, current._id, {
      ...toPayload(current),
      parentId: newParentId,
    });

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    toast.success("Folder moved.");
    router.refresh();
    return true;
  };

  const handleDelete = async () => {
    if (!current) return;

    const result = await deleteScope(orgName, current._id);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Folder deleted.");
    setScope(current.parentId ?? null, { history: "push" }); // navigate to parent (or home)
    setConfirmDelete(false);
    router.refresh();
  };

  const addFolderTile = (type: string) => (
    <button
      type="button"
      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-3 text-muted-foreground hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400"
      onClick={() => openAdd(type)}
    >
      <Plus className="size-8" />
      <span className="text-sm">Add folder</span>
    </button>
  );

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
          <Button onClick={() => openAdd("")}>
            <Plus />
            New folder
          </Button>
          {current && (
            <>
              <Button
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 />
                Delete folder
              </Button>
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil />
                Edit
              </Button>
              <Button variant="outline" onClick={() => setMoveOpen(true)}>
                <FolderInput />
                Move to…
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          {current ? (
            <>
              <CardTitle className="flex items-center gap-2">
                {current.name}
                <Badge variant="secondary">{current.type}</Badge>
              </CardTitle>
              <CardDescription>
                {current.description ||
                  "This folder has no description yet. You can add one using the “Edit” button above."}
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Organization structure</CardTitle>
              <CardDescription>
                Browse your organization&apos;s folders. Open one to see its
                contents.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {current && (
            <ScopeConfigCard
              key={current._id} // reset edit mode when navigating to another folder
              config={current.config}
              onSave={(config) => handleSave({ config })}
            />
          )}

          {children.length === 0
            ? !current && (
                <p className="text-sm text-muted-foreground">
                  No folders yet. Create your first folder using the button "New
                  folder" above to start managing your organization.
                </p>
              )
            : groupByType(children).map(([type, nodes]) => (
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
                    {addFolderTile(type)}
                  </div>
                </div>
              ))}
        </CardContent>
      </Card>

      {current && (
        <EditScopeDialog
          key={`edit-${current._id}-${current.updatedAt}`}
          scope={current}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={handleSave}
          existingTypes={existingTypes}
        />
      )}

      {current && (
        <MoveScopeDialog
          key={`move-${current._id}`}
          scope={current}
          tree={tree}
          open={moveOpen}
          onOpenChange={setMoveOpen}
          onMove={handleMove}
        />
      )}

      <AddScopeDialog
        key={`add-${addType}`} // remount so the preset type lands in the form defaults
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={handleCreate}
        existingTypes={existingTypes}
        parentName={current?.name}
        defaultType={addType}
      />

      <AlertDialogDestructive
        open={confirmDelete}
        onOpenChange={() => setConfirmDelete(false)}
        title="Delete this folder?"
        description={`This will permanently delete ${current?.name} and everything inside it. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
