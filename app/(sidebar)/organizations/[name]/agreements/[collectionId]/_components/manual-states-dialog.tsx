"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DateRangeInputs,
  validateDateRange,
} from "@/components/date/date-range-inputs";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

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
  const [inputs, setInputs] = useState({ from: "", to: "" });
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { range, errors } = validateDateRange(inputs, {
    disableFuture: true,
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setInputs({ from: "", to: "" });
      setReplaceExisting(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Track a past period</DialogTitle>
          <DialogDescription>
            Collect past data for the dates you choose. Click run when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4">
          <DateRangeInputs
            id="manual-states"
            value={inputs}
            errors={errors}
            onChange={setInputs}
            disableFuture
          />
          <Field orientation="horizontal">
            <Checkbox
              id="manual-states-replace-existing"
              checked={replaceExisting}
              onCheckedChange={(checked) =>
                setReplaceExisting(checked === true)
              }
            />
            <FieldLabel htmlFor="manual-states-replace-existing">
              Replace existing data
            </FieldLabel>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={!range || isPending}
            onClick={() =>
              range &&
              startTransition(async () => {
                const success = await onGenerate({
                  startDate: range.from,
                  endDate: range.to,
                  replaceExisting,
                });
                if (success) handleOpenChange(false);
              })
            }
          >
            {isPending && <Spinner />}
            Run
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
