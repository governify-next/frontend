"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import { File, Folder, House, Plus, Trash2 } from "lucide-react";

import { IScopeNode, IScopePayload } from "@/types/scope";
import { createScope, deleteScope, updateScope } from "@/data/scopes/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { ScopeCard } from "./scope-card";
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

    toast.success("Scope created.");
    router.refresh();
    return true;
  };

  const handleSave = async (
    payload: Pick<IScopePayload, "name" | "description" | "config">, // TODO: replace with IScopePayload when fields/permissions are added
  ) => {
    if (!current) return false;

    const result = await updateScope(orgName, current.name, {
      ...payload,
      type: current.type,
      fields: current.fields,
      permissions: current.permissions,
    });

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    toast.success("Scope updated.");
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

    toast.success("Scope deleted.");
    setScope(current.parentId ?? null, { history: "push" }); // navigate to parent (or home)
    setConfirmDelete(false);
    router.refresh();
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 pt-4">
      <div className="flex items-center gap-2">
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
                    <House className="size-3.5" />
                    Home
                  </button>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <House className="size-3.5" />
                  Home
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
                    <BreadcrumbPage>{node.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <button
                        type="button"
                        className="cursor-pointer"
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

        <div className="ml-auto flex gap-2">
          <Button onClick={() => setAddOpen(true)}>
            <Plus />
            Add new file
          </Button>
          {current && (
            <Button variant="outline" onClick={() => setConfirmDelete(true)}>
              <Trash2 />
              Delete scope
            </Button>
          )}
        </div>
      </div>

      {current && (
        <ScopeCard key={current._id} scope={current} onSave={handleSave} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Organization structure</CardTitle>
          <CardDescription>
            {current
              ? `Child scopes of ${current.name}.`
              : "Here you can find the organization structure and navigate through it."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {children.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scopes here yet.</p>
          ) : (
            groupByType(children).map(([type, nodes], groupIndex) => (
              <div key={type} className="flex flex-col gap-2">
                {groupIndex > 0 && <Separator />}
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {type}
                </p>
                <div className="flex flex-col gap-1">
                  {nodes.map((child) => (
                    <Button
                      key={child._id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => setScope(child._id, { history: "push" })}
                    >
                      {child.children.length > 0 ? <Folder /> : <File />}
                      {child.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AddScopeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={handleCreate}
        existingTypes={existingTypes}
      />

      <AlertDialogDestructive
        open={confirmDelete}
        onOpenChange={() => setConfirmDelete(false)}
        title="Delete scope?"
        description="This deletes the scope and all of its descendants. This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
