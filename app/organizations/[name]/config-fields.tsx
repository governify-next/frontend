"use client";

import { useFieldContext } from "@/components/form/form-context";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { ConfigRow } from "@/types/scope";

// Record -> rows for the form defaultValues.
export const configToRows = (config: Record<string, unknown>): ConfigRow[] =>
  Object.entries(config).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
  }));

// rows -> Record for the create/update payload.
export const rowsToConfig = (rows: ConfigRow[]) =>
  Object.fromEntries(rows.map(({ key, value }) => [key, value]));

export function ConfigField() {
  const field = useFieldContext<ConfigRow[]>();

  return (
    <Field>
      <FieldLabel>Config</FieldLabel>

      {field.state.value.map((row, i) => (
        <div key={i} className="flex items-start gap-2">
          <Input
            placeholder="Key"
            autoComplete="off"
            value={row.key}
            onBlur={field.handleBlur}
            onChange={(e) =>
              field.replaceValue(i, { ...row, key: e.target.value })
            }
            aria-invalid={field.state.meta.isTouched && row.key.trim() === ""}
          />
          <Input
            placeholder="Value"
            autoComplete="off"
            value={row.value}
            onChange={(e) =>
              field.replaceValue(i, { ...row, value: e.target.value })
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove config entry"
            onClick={() => field.removeValue(i)}
          >
            <X />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => field.pushValue({ key: "", value: "" })}
      >
        <Plus />
        Add config
      </Button>
    </Field>
  );
}
