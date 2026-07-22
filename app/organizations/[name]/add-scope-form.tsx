"use client";

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
import { scopeFormSchema } from "@/schemas/scope";
import { ConfigField, rowsToConfig } from "./config-fields";
import { DetailSection } from "./detail-section";
import { TypeCombobox } from "./type-combobox";
import { ConfigRow, IScopePayload } from "@/types/scope";

export function AddScopeDialog({
  open,
  onOpenChange,
  onCreate,
  existingTypes,
  parentName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    payload: Pick<IScopePayload, "name" | "description" | "type" | "config">, // TODO: replace with IScopePayload when fields/permissions are added
  ) => Promise<boolean>;
  existingTypes: string[];
  parentName?: string;
}) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      type: "",
      config: [] as ConfigRow[],
    },
    validators: {
      onSubmit: scopeFormSchema,
    },
    onSubmit: async ({ value }) => {
      const ok = await onCreate({
        name: value.name,
        description: value.description || undefined,
        type: value.type,
        config: rowsToConfig(value.config),
      });

      if (ok) {
        form.reset();
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new folder</DialogTitle>
          <DialogDescription>
            {parentName
              ? `Fill in the details to create a new folder. It will be created inside ${parentName}.`
              : "Fill in the details to create a new folder. It will be created at the top level of your organization."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-scope-form"
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DetailSection title="General">
            <FieldGroup className="gap-3">
              <form.AppField name="name">
                {(field) => <field.TextField label="Name" autoFocus />}
              </form.AppField>

              <form.AppField name="description">
                {(field) => <field.TextareaField label="Description" />}
              </form.AppField>

              <form.AppField name="type">
                {() => (
                  <TypeCombobox label="Type" existingTypes={existingTypes} />
                )}
              </form.AppField>
            </FieldGroup>
          </DetailSection>

          <DetailSection title="Configuration">
            <form.AppField name="config" mode="array">
              {() => <ConfigField />}
            </form.AppField>
          </DetailSection>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton label="Create folder" formId="add-scope-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
