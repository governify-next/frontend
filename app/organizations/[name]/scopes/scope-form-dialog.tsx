"use client";

import { useAppForm } from "@/components/form";
import { IScopePayload } from "@/types/scope";
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

export type ScopeBasics = Pick<IScopePayload, "name" | "description" | "type">;

// Shared create/edit folder dialog: the parent decides texts, defaults and submit.
export function ScopeFormDialog({
  open,
  onOpenChange,
  onSubmit,
  existingTypes,
  title,
  description,
  submitLabel,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ScopeBasics) => Promise<boolean>;
  existingTypes: string[];
  title: string;
  description: string;
  submitLabel: string;
  defaultValues: { name: string; description: string; type: string };
}) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: scopeBasicsSchema,
    },
    onSubmit: async ({ value }) => {
      const ok = await onSubmit({
        name: value.name,
        description: value.description || undefined,
        type: value.type,
      });

      if (ok) {
        form.reset();
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          id="scope-form"
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
              {() => <TypeCombobox label="Type" existingTypes={existingTypes} />}
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
            <form.SubmitButton label={submitLabel} formId="scope-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
