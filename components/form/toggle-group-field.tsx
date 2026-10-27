"use client";

import { useFieldContext } from "./context";
import { Field, FieldTitle } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Option } from "@/types/option";

export function ToggleGroupField({
  label,
  options,
}: {
  label: string;
  options: Option[];
}) {
  const field = useFieldContext<string>();

  return (
    <Field>
      <FieldTitle>{label}</FieldTitle>
      <ToggleGroup
        type="single"
        aria-label={label}
        value={field.state.value}
        onValueChange={(value) => value && field.handleChange(value)}
        className="w-full"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="flex-1"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  );
}
