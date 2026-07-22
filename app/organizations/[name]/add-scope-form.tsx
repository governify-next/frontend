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
import { TypeCombobox } from "./type-combobox";
import { ConfigRow, IScopePayload } from "@/types/scope";

export function AddScopeDialog({
  open,
  onOpenChange,
  onCreate,
  existingTypes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    payload: Pick<IScopePayload, "name" | "description" | "type" | "config">, // TODO: replace with IScopePayload when fields/permissions are added
  ) => Promise<boolean>;
  existingTypes: string[];
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add child scope</DialogTitle>
          <DialogDescription>
            Enter the details of the scope you want to add.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-scope-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
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

            <form.AppField name="config" mode="array">
              {() => <ConfigField />}
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
            <form.SubmitButton label="Add scope" formId="add-scope-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
