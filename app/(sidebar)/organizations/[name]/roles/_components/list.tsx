"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Users } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ItemList } from "@/components/item/item-list";
import { IRole, IRolePayload } from "@/types/organization";
import { pluralize } from "@/lib/utils/formatter";
import {
  deleteOrganizationRole,
  updateOrganizationRole,
} from "@/data/organizations/actions";
import { EditRoleDialog } from "./edit-form";

export function RolesList({
  orgName,
  roles,
}: {
  orgName: string;
  roles: (IRole & { members: number })[];
}) {
  const router = useRouter();
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<IRolePayload | null>(null);

  const handleRoleDelete = async () => {
    const result = await deleteOrganizationRole(orgName, roleToDelete!);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setRoleToDelete(null);
    router.refresh();
    toast.success("Role deleted.");
  };

  const handleRoleEdit = async (payload: IRolePayload) => {
    const result = await updateOrganizationRole(
      orgName,
      roleToEdit!.name,
      payload,
    );

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    router.refresh();
    toast.success("Role updated.");
    return true;
  };

  return (
    <>
      <ItemList
        className="w-full"
        data={roles}
        itemLabel="roles"
        renderItem={(role) => {
          const isAdmin = role.name === "admin";

          return (
            <Item variant="outline" className="relative overflow-hidden pl-5">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: role.color }}
              />
              <ItemContent className="min-w-0">
                <ItemTitle>
                  {role.name}
                  {isAdmin && <Badge variant="outline">Default</Badge>}
                </ItemTitle>
                {role.description && (
                  <ItemDescription className="break-words">
                    {role.description}
                  </ItemDescription>
                )}
              </ItemContent>
              <ItemActions className="gap-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                  <Users className="size-3.5 text-sky" />
                  <span aria-hidden>{role.members}</span>
                  <span className="sr-only">
                    {pluralize(role.members, "member")}
                  </span>
                </span>
                <Separator
                  orientation="vertical"
                  className="mx-2 data-vertical:h-5 data-vertical:self-center"
                />
                <Button
                  variant="warning"
                  size="icon-sm"
                  aria-label={`Edit role ${role.name}`}
                  disabled={isAdmin}
                  onClick={() => setRoleToEdit(role)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Delete role ${role.name}`}
                  disabled={isAdmin}
                  onClick={() => setRoleToDelete(role.name)}
                >
                  <Trash2 />
                </Button>
              </ItemActions>
            </Item>
          );
        }}
      />
      <ConfirmDialog
        open={roleToDelete !== null}
        onOpenChange={() => setRoleToDelete(null)}
        title="Delete role?"
        description="This will remove this role from the organization."
        onConfirm={handleRoleDelete}
      />
      {roleToEdit && (
        <EditRoleDialog
          role={roleToEdit}
          open={true}
          onOpenChange={() => setRoleToEdit(null)}
          onRoleChange={handleRoleEdit}
        />
      )}
    </>
  );
}
