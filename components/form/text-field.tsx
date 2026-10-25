"use client";

import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { useFieldContext } from "./context";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function TextField({
  label,
  icon,
  autoComplete = "off",
  ...inputProps
}: { label: string; icon?: ReactNode } & ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const controlProps = {
    id: field.name,
    name: field.name,
    value: field.state.value,
    onBlur: field.handleBlur,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      field.handleChange(e.target.value),
    "aria-invalid": isInvalid,
    autoComplete,
    ...inputProps,
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {icon ? (
        <InputGroup data-disabled={inputProps.disabled}>
          <InputGroupAddon>{icon}</InputGroupAddon>
          <InputGroupInput {...controlProps} />
        </InputGroup>
      ) : (
        <Input {...controlProps} />
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
