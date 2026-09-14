"use client";

import { useFormContext } from "./context";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export function SubmitButton({
  label,
  formId,
}: {
  label: string;
  formId: string;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" form={formId} disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
