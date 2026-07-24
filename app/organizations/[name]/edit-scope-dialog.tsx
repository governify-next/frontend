"use client";

import { useAppForm } from "@/components/form";
import { IScopeNode, IScopePayload } from "@/types/scope";
import { scopeBasicsSchema } from "@/schemas/scope";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypeCombobox } from "./type-combobox";

export function EditScopeDialog({
  scope,
  open,
  onOpenChange,
  onSave,
  existingTypes,
}: {
  scope: IScopeNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: Partial<IScopePayload>) => Promise<boolean>;
  existingTypes: string[];
}) {
  const form = useAppForm({
    defaultValues: {
      name: scope.name,
      description: scope.description ?? "",
      type: scope.type,
    },
    validators: {
      onSubmit: scopeBasicsSchema,
    },
    onSubmit: async ({ value }) => {
      const ok = await onSave({
        name: value.name,
        description: value.description || undefined,
        type: value.type,
      });

      if (ok) {
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit folder</DialogTitle>
          <DialogDescription>
            Make changes to {scope.name} here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-scope-form"
          className="-m-1 flex flex-col gap-3 overflow-y-auto p-1"
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
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton label="Save changes" formId="edit-scope-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
