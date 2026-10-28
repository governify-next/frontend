import { useState } from "react";
import { Shield } from "lucide-react";
import { useAppForm } from "@/components/form";
import { IRolePayload } from "@/types/organization";
import { roleFormSchema } from "@/schemas/organization";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { randomColor } from "@/lib/utils/color";

export function AddRoleDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: IRolePayload) => Promise<boolean>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add role</DialogTitle>
          <DialogDescription>
            Define a new role that can be assigned to the organization members.
          </DialogDescription>
        </DialogHeader>

        <AddRoleForm
          onSubmit={async (payload) => {
            if (await onCreate(payload)) {
              onOpenChange(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddRoleForm({
  onSubmit,
}: {
  onSubmit: (payload: IRolePayload) => Promise<void>;
}) {
  const [initialColor] = useState(randomColor);
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      color: initialColor,
    },
    validators: {
      onSubmit: roleFormSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <>
      <DialogBody>
        <form
          id="add-role-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-5">
            <form.AppField name="name">
              {(field) => (
                <field.TextField
                  label="Name"
                  icon={<Shield />}
                  placeholder="auditor"
                  autoFocus
                />
              )}
            </form.AppField>

            <form.AppField name="description">
              {(field) => (
                <field.TextareaField
                  label="Description"
                  placeholder="What can members with this role do?"
                />
              )}
            </form.AppField>
            <form.AppField name="color">
              {(field) => <field.ColorField label="Color" />}
            </form.AppField>
          </FieldGroup>
        </form>
      </DialogBody>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <form.AppForm>
          <form.SubmitButton label="Create role" formId="add-role-form" />
        </form.AppForm>
      </DialogFooter>
    </>
  );
}
