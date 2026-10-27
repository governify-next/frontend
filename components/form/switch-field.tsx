"use client";

import { useFieldContext } from "./context";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export function SwitchField<T extends string>({
  label,
  description,
  checkedValue,
  uncheckedValue,
}: {
  label: string;
  description?: string;
  checkedValue: T;
  uncheckedValue: T;
}) {
  const field = useFieldContext<T>();

  return (
    <Field
      orientation="horizontal"
      className="rounded-lg border p-4 has-[>[data-slot=field-content]]:items-center"
    >
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <Switch
        id={field.name}
        name={field.name}
        checked={field.state.value === checkedValue}
        onCheckedChange={(checked) =>
          field.handleChange(checked ? checkedValue : uncheckedValue)
        }
      />
    </Field>
  );
}
