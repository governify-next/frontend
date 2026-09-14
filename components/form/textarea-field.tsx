"use client";

import type { ComponentProps } from "react";
import { useFieldContext } from "./context";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField({
  label,
  ...textareaProps
}: { label: string } & Omit<
  ComponentProps<typeof Textarea>,
  "maxLength" | "className"
>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...textareaProps}
        maxLength={500} // avoid dialog overflow
        className="max-h-32"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
