"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { toast } from "sonner";
import { Ellipsis, FolderInput, Pencil, Plus, Trash2 } from "lucide-react";

import { IScopeNode, IScopePayload } from "@/types/scope";
import { createScope, deleteScope, updateScope } from "@/data/scopes/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { cn } from "@/lib/utils/cn";
import { FolderIcon } from "./folder-icon";
import { indexScopeTree, ScopeBreadcrumb } from "./breadcrumb";
import { ScopeConfigCard } from "./config-card";
import { ScopeBasics, ScopeFormDialog } from "./form";
import { MoveScopeDialog } from "./move-dialog";

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
    const byId = indexScopeTree(tree);
    const types = new Set([...byId.values()].map((node) => node.type));
    return {
      byId,
      existingTypes: [...types].sort((a, b) => a.localeCompare(b)),
    };
  }, [tree]);

  const current = scope ? (byId.get(scope) ?? null) : null; // scope not found is treated as home
  const children = current ? current.children : tree; // home treated with root scopes as children

  const openAdd = (type: string) => {
    setAddType(type);
    setAddOpen(true);
  };

  const handleCreate = async (payload: ScopeBasics) => {
    const result = await createScope(orgName, {
      ...payload,
      parentId: current?._id ?? null,
      config: {}, // configured later from the configuration card
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

  const handleUpdate = async (
    patch: Partial<IScopePayload>,
    successMessage: string,
  ) => {
    if (!current) return false;

    const result = await updateScope(orgName, current._id, {
      ...toPayload(current),
      ...patch,
    });

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    toast.success(successMessage);
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
      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed p-3 text-muted-foreground outline-none transition-colors duration-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400"
      onClick={() => openAdd(type)}
    >
      <Plus className="size-8" />
      <span className="text-sm">Add folder</span>
    </button>
  );

  return (
    <>
      <Card>
        <CardHeader>
          {current ? (
            <>
              <ScopeBreadcrumb
                byId={byId}
                currentId={scope}
                onNavigate={(id) => setScope(id, { history: "push" })}
                className="mb-1 text-xs sm:gap-1.5"
              />
              <CardTitle className="flex items-center gap-2">
                {current.name}
                <Badge variant="secondary">{current.type}</Badge>
              </CardTitle>
              <CardDescription>
                {current.description ||
                  "This folder has no description yet. You can add one using the “Edit” button."}
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>All folders</CardTitle>
              <CardDescription>
                Top-level folders of the organization. Open one to see its
                contents and configuration.
              </CardDescription>
            </>
          )}
          <CardAction
            className={cn(
              "flex items-center gap-2 self-center",
              current && "row-span-3",
            )}
          >
            <Button onClick={() => openAdd("")} className="max-lg:size-9">
              <Plus />
              <span className="max-lg:sr-only">New folder</span>
            </Button>
            {current && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="data-[state=open]:bg-muted"
                  >
                    <Ellipsis />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                    <Pencil />
                    Edit folder
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setMoveOpen(true)}>
                    <FolderInput />
                    Move to…
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setConfirmDelete(true)}
                  >
                    <Trash2 />
                    Delete folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {current && (
            <ScopeConfigCard
              key={current._id} // reset edit mode when navigating to another folder
              config={current.config}
              onSave={(config) => handleUpdate({ config }, "Folder updated.")}
            />
          )}

          {children.length === 0
            ? !current && (
                <p className="text-sm text-muted-foreground">
                  No folders yet. Create your first folder using the button
                  &quot;New folder&quot; to start managing your organization.
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
                        className="flex cursor-pointer flex-col items-center gap-1 rounded-md p-3 outline-none transition-colors duration-100 hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        onClick={() => setScope(child._id, { history: "push" })}
                      >
                        <FolderIcon className="w-16 drop-shadow-sm" />
                        <span className="line-clamp-2 w-full break-words text-center text-sm leading-tight">
                          {child.name}
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
        <ScopeFormDialog
          key={`edit-${current._id}-${current.updatedAt}`}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={(patch) => handleUpdate(patch, "Folder updated.")}
          existingTypes={existingTypes}
          title="Edit folder"
          description={`Make changes to ${current.name} here. Click save when you're done.`}
          submitLabel="Save changes"
          defaultValues={{
            name: current.name,
            description: current.description ?? "",
            type: current.type,
          }}
        />
      )}

      {current && (
        <MoveScopeDialog
          key={`move-${current._id}`}
          scope={current}
          tree={tree}
          open={moveOpen}
          onOpenChange={setMoveOpen}
          onMove={(newParentId) =>
            handleUpdate({ parentId: newParentId }, "Folder moved.")
          }
        />
      )}

      <ScopeFormDialog
        key={`add-${addType}`} // remount so the preset type lands in the form defaults
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleCreate}
        existingTypes={existingTypes}
        title="Create a new folder"
        description={
          current
            ? `Fill in the details to create a new folder. It will be created inside ${current.name}.`
            : "Fill in the details to create a new folder. It will be created at the top level of your organization."
        }
        submitLabel="Create folder"
        defaultValues={{ name: "", description: "", type: addType }}
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={() => setConfirmDelete(false)}
        title="Delete this folder?"
        description={`This will permanently delete ${current?.name} and everything inside it.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
