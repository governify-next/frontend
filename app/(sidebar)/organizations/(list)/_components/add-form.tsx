import { Building2, Hash } from "lucide-react";
import { useAppForm } from "@/components/form";
import { IOrganizationPayload } from "@/types/organization";
import { organizationFormSchema } from "@/schemas/organization";
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add organization</DialogTitle>
          <DialogDescription>
            Register a new organization and describe what it does.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id="create-organization-form"
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
                    icon={<Hash />}
                    placeholder="universidad-sevilla"
                    autoFocus
                  />
                )}
              </form.AppField>

              <form.AppField name="displayName">
                {(field) => (
                  <field.TextField
                    label="Display name"
                    icon={<Building2 />}
                    placeholder="Universidad de Sevilla"
                  />
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.TextareaField
                    label="Description"
                    placeholder="What does this organization do?"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </form>
        </DialogBody>

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
