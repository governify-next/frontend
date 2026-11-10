"use client";

import { useFormContext } from "./context";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export function SubmitButton({
  label,
  formId,
  pending = false,
}: {
  label: string;
  formId: string;
  pending?: boolean;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" form={formId} disabled={isSubmitting || pending}>
          {(isSubmitting || pending) && (
            <Loader2Icon className="animate-spin" />
          )}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
