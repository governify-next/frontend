"use client";

import type { ComponentProps } from "react";
import { useFieldContext } from "./context";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TextField({
  label,
  autoComplete = "off",
  ...inputProps
}: { label: string } & ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        autoComplete={autoComplete}
        {...inputProps}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
