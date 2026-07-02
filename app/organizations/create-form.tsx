import { useAppForm } from "@/components/form";
import { IOrganizationPayload } from "@/types/organization.types";
import { organizationFormSchema } from "@/schemas/organization";
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

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: IOrganizationPayload) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
    },
    validators: {
      onSubmit: organizationFormSchema,
    },
    onSubmit: async ({ value }) => {
      const success = await onCreate({
        name: value.name,
        description: value.description,
        displayName: value.displayName || undefined,
      });
      if (success) {
        form.reset();
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add organization</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new organization. Click create when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-organization-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-3">
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" autoFocus />}
            </form.AppField>

            <form.AppField name="displayName">
              {(field) => <field.TextField label="Display name" />}
            </form.AppField>

            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" />}
            </form.AppField>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton
              label="Create organization"
              formId="create-organization-form"
            />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
