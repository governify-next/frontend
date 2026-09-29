"use client";

import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/form";
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
import { fetchStatesFormSchema } from "@/schemas/agreement";

export function ManualStatesDialog({
  open,
  onOpenChange,
  onGenerate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: {
    startDate: Date;
    endDate: Date;
    replaceExisting: boolean;
  }) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      startDate: null as Date | null,
      endDate: null as Date | null,
      replaceExisting: false,
    },
    validators: {
      onSubmit: fetchStatesFormSchema,
    },
    onSubmit: async ({ value }) => {
      const success = await onGenerate({
        startDate: value.startDate as Date,
        endDate: value.endDate as Date,
        replaceExisting: value.replaceExisting,
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
          <DialogTitle>Track a past period</DialogTitle>
          <DialogDescription>
            Collect past data for the dates you choose. Click run when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="fetch-states-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-4">
            <div className="flex flex-col gap-3">
              <form.AppField name="startDate">
                {(field) => <field.DatePickerField label="Start Date" />}
              </form.AppField>

              <form.AppField name="endDate">
                {(field) => <field.DatePickerField label="End Date" />}
              </form.AppField>
            </div>

            <form.AppField name="replaceExisting">
              {(field) => <field.CheckboxField label="Replace existing data" />}
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
            <form.SubmitButton label="Run" formId="fetch-states-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
