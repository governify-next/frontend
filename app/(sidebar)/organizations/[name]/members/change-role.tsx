"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { IRole } from "@/types/organization";
import { useState } from "react";

export function ChangeRoleDialog({
  open,
  onOpenChange,
  memberToChangeRole,
  organizationCreatorId,
  currentRoles,
  roles,
  onSave,
}: {
  open: boolean;
  onOpenChange: () => void;
  memberToChangeRole: {
    userId: string;
    username: string;
    currentRoles: IRole[];
  };
  organizationCreatorId: string;
  currentRoles: IRole[];
  roles: IRole[];
  onSave: (newRolesNames: string[]) => void;
}) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    currentRoles.map((role) => role.name),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Change role of {memberToChangeRole.username}?
          </DialogTitle>
          <DialogDescription>Select new roles:</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          {roles.map((rol) => {
            return (
              <Field key={rol._id} orientation="horizontal">
                <Checkbox
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRoles([...selectedRoles, rol.name]);
                    } else {
                      setSelectedRoles(
                        selectedRoles.filter(
                          (selectedRoleName) => selectedRoleName !== rol.name,
                        ),
                      );
                    }
                  }}
                  id={rol._id}
                  checked={selectedRoles.some(
                    (selectedRoleName) => selectedRoleName === rol.name,
                  )}
                  disabled={
                    organizationCreatorId === memberToChangeRole.userId &&
                    rol.name === "admin"
                  }
                />
                <FieldContent>
                  <FieldLabel htmlFor={rol._id}>{rol.name}</FieldLabel>
                  <FieldDescription>{rol.description}</FieldDescription>
                </FieldContent>
              </Field>
            );
          })}
        </FieldGroup>
        <DialogFooter>
          <Button onClick={() => onSave(selectedRoles)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
