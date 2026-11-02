"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Hash, SquarePen, Type } from "lucide-react";
import { useAppForm } from "@/components/form";
import {
  IAgreementCollection,
  IAgreementCollectionPayload,
} from "@/types/agreement";
import { collectionFormSchema } from "@/schemas/collection";
import { updateAgreementCollection } from "@/data/agreements/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export function AgreementCollectionDetails({
  orgName,
  collection,
}: {
  orgName: string;
  collection: IAgreementCollection;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCollectionChange = async (
    payload: IAgreementCollectionPayload,
  ) => {
    const result = await updateAgreementCollection(
      orgName,
      collection._id,
      collection.auditableVersionNumber,
      payload,
    );

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    startTransition(() => {
      router.refresh();
      setEditing(false);
    });
    toast.success("Agreement collection updated.");
  };

  if (editing) {
    return (
      <EditCollectionForm
        collection={collection}
        pending={isPending}
        onCollectionChange={handleCollectionChange}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-2xl">
          {(collection.displayName || collection.name).toUpperCase()}
        </span>
        <Button
          variant="primarySoft"
          size="icon-sm"
          onClick={() => setEditing(true)}
        >
          <SquarePen />
        </Button>
      </div>
      <span className="text-sm text-muted-foreground">
        {collection.description}
      </span>
    </div>
  );
}

function EditCollectionForm({
  collection,
  pending,
  onCollectionChange,
  onCancel,
}: {
  collection: IAgreementCollection;
  pending: boolean;
  onCollectionChange: (payload: IAgreementCollectionPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const form = useAppForm({
    defaultValues: {
      name: collection.name,
      displayName: collection.displayName,
      description: collection.description,
    },
    validators: {
      onSubmit: collectionFormSchema,
    },
    onSubmit: ({ value }) => onCollectionChange(value),
  });

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Editing collection details</CardTitle>
        <CardDescription>
          Update the collection&apos;s name and description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="edit-collection-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-5">
            <div className="grid gap-5 @2xl/main:grid-cols-2">
              <form.AppField name="name">
                {(field) => (
                  <field.TextField
                    label="Name"
                    icon={<Hash />}
                    placeholder="sla-2026"
                    autoFocus
                  />
                )}
              </form.AppField>
              <form.AppField name="displayName">
                {(field) => (
                  <field.TextField
                    label="Display name"
                    icon={<Type />}
                    placeholder="SLA 2026"
                  />
                )}
              </form.AppField>
            </div>
            <form.AppField name="description">
              {(field) => (
                <field.TextareaField
                  label="Description"
                  placeholder="What agreements does this collection group?"
                />
              )}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton
            label="Save changes"
            formId="edit-collection-form"
            pending={pending}
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  );
}
