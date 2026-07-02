"use client";

import { useFieldContext } from "./form-context";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectField({
  label,
  options,
}: {
  label: string;
  options: readonly string[];
}) {
  const field = useFieldContext<string>();

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger id={field.name} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
