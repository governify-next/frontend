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
import { IRole } from "@/types/organization.types";
import { useState } from "react";

export function ChangeRoleDialog({
  open,
  onOpenChange,
  username,
  currentRoles,
  roles,
  onSave,
}: {
  open: boolean;
  onOpenChange: () => void;
  username: string;
  currentRoles: IRole[];
  roles: IRole[];
  onSave: (newRolesIds: string[]) => void;
}) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    currentRoles.map((role) => role._id),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role of {username}?</DialogTitle>
          <DialogDescription>Select new roles:</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          {roles.map((rol) => {
            return (
              <Field key={rol._id} orientation="horizontal">
                <Checkbox
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRoles([...selectedRoles, rol._id]);
                    } else {
                      setSelectedRoles(
                        selectedRoles.filter(
                          (selectedRoleId) => selectedRoleId !== rol._id,
                        ),
                      );
                    }
                  }}
                  id={rol._id}
                  checked={selectedRoles.some(
                    (selectedRoleId) => selectedRoleId === rol._id,
                  )}
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
