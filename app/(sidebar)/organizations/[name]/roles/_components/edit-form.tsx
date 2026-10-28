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

export function EditRoleDialog({
  role,
  open,
  onOpenChange,
  onRoleChange,
}: {
  role: IRolePayload;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (payload: IRolePayload) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      name: role.name,
      description: role.description,
      color: role.color,
    },
    validators: {
      onSubmit: roleFormSchema,
    },
    onSubmit: async ({ value }) => {
      const success = await onRoleChange(value);
      if (success) {
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit role</DialogTitle>
          <DialogDescription>
            Update the role name, its color and what it is meant for.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id="edit-role-form"
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
            <form.SubmitButton label="Save changes" formId="edit-role-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
