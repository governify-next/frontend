"use client";

import { AlertDialogDestructive } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import {
  deleteOrganizationRole,
  updateOrganizationRole,
} from "@/data/organizations/actions";
import { IRole, IRolePayload } from "@/types/organization";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EditRoleDialog } from "./edit-role-form";

export function RolesList({
  orgName,
  roles,
}: {
  orgName: string;
  roles: IRole[];
}) {
  const router = useRouter();
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<IRolePayload | null>(null);

  const handleDeleteRole = async (roleName: string) => {
    const result = await deleteOrganizationRole(orgName, roleName);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Role deleted.");
    setRoleToDelete(null);
    router.refresh();
  };

  const handleEditRole = async (payload: IRolePayload) => {
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
      <ItemGroup>
        {roles.map((role) => (
          <Item key={role._id} variant="outline">
            <ItemContent>
              <ItemTitle>{role.name}</ItemTitle>
              <ItemDescription>{role.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Role options">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() =>
                      setRoleToEdit({
                        name: role.name,
                        description: role.description,
                      })
                    }
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setRoleToDelete(role.name)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
      <AlertDialogDestructive
        open={roleToDelete !== null}
        onOpenChange={() => setRoleToDelete(null)}
        title="Delete role?"
        description="This will remove this role from the organization."
        onConfirm={() => handleDeleteRole(roleToDelete!)}
      />
      {roleToEdit && (
        <EditRoleDialog
          role={roleToEdit}
          open={true}
          onOpenChange={() => setRoleToEdit(null)}
          onRoleChange={handleEditRole}
        />
      )}
    </>
  );
}
