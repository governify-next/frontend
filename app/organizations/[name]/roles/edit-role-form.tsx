import { useAppForm } from "@/components/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { IRolePayload } from "@/types/organization.types";
import { roleFormSchema } from "@/schemas/organization";

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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit role</DialogTitle>
          <DialogDescription>
            Make changes to the role here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-role-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" autoFocus />}
            </form.AppField>

            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" />}
            </form.AppField>
          </FieldGroup>
        </form>

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
