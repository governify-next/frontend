"use client";

import { Fragment, useState } from "react";
import { Pencil } from "lucide-react";

import { useAppForm } from "@/components/form";
import { IScopeNode, IScopePayload } from "@/types/scope";
import { scopeFormSchema } from "@/schemas/scope";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfigField, configToRows, rowsToConfig } from "./config-fields";
import { DetailSection } from "./detail-section";

type SavePayload = Pick<IScopePayload, "name" | "description" | "config">; // TODO: replace with IScopePayload when fields/permissions are added

export function ScopeDetailsDialog({
  scope,
  open,
  onOpenChange,
  onSave,
}: {
  scope: IScopeNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: SavePayload) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) setEditing(false); // reopening always starts in read mode
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? `Edit ${scope.name}` : `View details of ${scope.name}`}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? `Make changes to ${scope.name} here. Click save when you're done.`
              : "Here you can find all the information about this folder."}
          </DialogDescription>
        </DialogHeader>

        {editing ? (
          <ScopeEditForm
            scope={scope}
            onSave={onSave}
            onDone={() => setEditing(false)}
          />
        ) : (
          <ScopeReadView scope={scope} onEdit={() => setEditing(true)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ScopeReadView({
  scope,
  onEdit,
}: {
  scope: IScopeNode;
  onEdit: () => void;
}) {
  const configRows = configToRows(scope.config);

  return (
    <>
      <div className="flex flex-col gap-3 overflow-y-auto">
        <DetailSection title="General">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="font-medium">Name</dt>
            <dd className="text-muted-foreground">{scope.name}</dd>
            <dt className="font-medium">Description</dt>
            <dd className="text-muted-foreground">
              {scope.description || "No description."}
            </dd>
          </dl>
        </DetailSection>

        <DetailSection title="Configuration">
          {configRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No configuration defined.
            </p>
          ) : (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {configRows.map(({ key, value }) => (
                <Fragment key={key}>
                  <dt className="font-medium">{key}</dt>
                  <dd className="break-all text-muted-foreground">{value}</dd>
                </Fragment>
              ))}
            </dl>
          )}
        </DetailSection>
      </div>

      <DialogFooter>
        <Button onClick={onEdit}>
          <Pencil />
          Edit
        </Button>
      </DialogFooter>
    </>
  );
}

function ScopeEditForm({
  scope,
  onSave,
  onDone,
}: {
  scope: IScopeNode;
  onSave: (payload: SavePayload) => Promise<boolean>;
  onDone: () => void;
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

      if (ok) {
        onDone(); // back to read mode, on error keep values so the user can retry
      }
    },
  });

  return (
    <>
      <form
        id="scope-details-form"
        className="flex flex-col gap-3 overflow-y-auto"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DetailSection title="General">
          <FieldGroup className="gap-3">
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" />}
            </form.AppField>

            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" />}
            </form.AppField>
          </FieldGroup>
        </DetailSection>

        <DetailSection title="Configuration">
          <form.AppField name="config" mode="array">
            {() => <ConfigField />}
          </form.AppField>
        </DetailSection>
      </form>

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton label="Save changes" formId="scope-details-form" />
        </form.AppForm>
      </DialogFooter>
    </>
  );
}
