"use client";

import { useAppForm } from "@/components/form";
import { IScopeNode, IScopePayload } from "@/types/scope";
import { scopeFormSchema } from "@/schemas/scope";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { ConfigField, configToRows, rowsToConfig } from "./config-fields";

export function ScopeCard({
  scope,
  onSave,
}: {
  scope: IScopeNode;
  onSave: (
    payload: Pick<IScopePayload, "name" | "description" | "config">, // TODO: replace with IScopePayload when fields/permissions are added
  ) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      name: scope.name,
      description: scope.description ?? "",
      type: scope.type,
      config: configToRows(scope.config),
    },
    validators: {
      onSubmit: scopeFormSchema,
    },
    onSubmit: async ({ value }) => {
      const ok = await onSave({
        name: value.name,
        description: value.description || undefined,
        config: rowsToConfig(value.config),
      });

      if (!ok) {
        form.reset();
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{scope.name}</CardTitle>
        <CardDescription>
          Type:{" "}
          <span className="font-medium text-foreground">{scope.type}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="scope-card-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-3">
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" />}
            </form.AppField>

            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" />}
            </form.AppField>

            <form.AppField name="config" mode="array">
              {() => <ConfigField />}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-end">
        <form.AppForm>
          <form.SubmitButton label="Save changes" formId="scope-card-form" />
        </form.AppForm>
      </CardFooter>
    </Card>
  );
}
