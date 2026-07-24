"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Pencil, Plus } from "lucide-react";

import { useAppForm } from "@/components/form";
import { scopeConfigSchema } from "@/schemas/scope";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfigField, configToRows, rowsToConfig } from "./config-fields";

type Mode = "read" | "edit" | "add";

export function ScopeConfigCard({
  config,
  onSave,
}: {
  config: Record<string, unknown>;
  onSave: (config: Record<string, unknown>) => Promise<boolean>;
}) {
  const [mode, setMode] = useState<Mode>("read");
  const rows = configToRows(config);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
          Configuration
        </CardTitle>
      </CardHeader>

      {mode === "read" ? (
        <>
          <CardContent className="max-h-64 divide-y overflow-y-auto">
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Start adding configurations to this folder using the button “Add
                configuration” below.
              </p>
            ) : (
              rows.map(({ key, value }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 py-2 text-sm first:pt-0 last:pb-0"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    {key}
                  </span>
                  <span className="break-all text-right text-muted-foreground">
                    {value}
                  </span>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="justify-end">
            {rows.length === 0 ? (
              <Button onClick={() => setMode("add")}>
                <Plus />
                Add configuration
              </Button>
            ) : (
              <Button onClick={() => setMode("edit")}>
                <Pencil />
                Edit
              </Button>
            )}
          </CardFooter>
        </>
      ) : (
        <ConfigEditForm
          config={config}
          withEmptyRow={mode === "add"}
          onSave={onSave}
          onDone={() => setMode("read")}
        />
      )}
    </Card>
  );
}

// Mounted only while editing so the form always starts from the current config.
function ConfigEditForm({
  config,
  withEmptyRow,
  onSave,
  onDone,
}: {
  config: Record<string, unknown>;
  withEmptyRow: boolean;
  onSave: (config: Record<string, unknown>) => Promise<boolean>;
  onDone: () => void;
}) {
  const form = useAppForm({
    defaultValues: {
      config: [
        ...configToRows(config),
        ...(withEmptyRow ? [{ key: "", value: "" }] : []),
      ],
    },
    validators: {
      onSubmit: scopeConfigSchema,
    },
    onSubmit: async ({ value }) => {
      const ok = await onSave(rowsToConfig(value.config));

      if (ok) {
        onDone();
      }
    },
  });

  // Start scrolled to the bottom so "Add property" is visible and the list doesn't look capped.
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    formRef.current?.scrollTo({ top: formRef.current.scrollHeight });
  }, []);

  return (
    <>
      <CardContent>
        <form
          ref={formRef}
          id="scope-config-form"
          className="-m-1 max-h-64 overflow-y-auto p-1"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="config" mode="array">
            {() => <ConfigField />}
          </form.AppField>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton label="Save" formId="scope-config-form" />
        </form.AppForm>
      </CardFooter>
    </>
  );
}
