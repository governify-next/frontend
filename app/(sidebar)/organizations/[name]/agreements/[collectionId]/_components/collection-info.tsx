"use client";

import { IconEdit } from "@tabler/icons-react";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IAgreementCollection } from "@/types/agreement";
import { updateAgreementCollection } from "@/data/agreements/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppForm } from "@/components/form";
import { collectionFormSchema } from "@/schemas/collection";
import { FieldDescription, FieldGroup } from "@/components/ui/field";

export function AgreementCollectionInfo({
  collection,
  onEdit,
}: {
  collection: IAgreementCollection;
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-2xl">
            {collection.displayName.toUpperCase() ||
              collection.name.toUpperCase()}
          </span>
          <Button variant="primarySoft" size="icon-sm" onClick={onEdit}>
            <IconEdit />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {collection.description}
        </span>
      </div>
    </div>
  );
}

export function AgreementCollectionEditCard({
  orgName,
  collection,
  onOpenChange,
}: {
  orgName: string;
  collection: IAgreementCollection;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      displayName: collection.displayName,
      name: collection.name,
      description: collection.description,
    },
    validators: {
      onSubmit: collectionFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        displayName: value.displayName,
        description: value.description,
      };
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

      toast.success("Agreement collection updated.");
      onOpenChange(false);
      router.refresh();
    },
  });

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Editing collection details</CardTitle>
        <CardDescription>
          Make changes to the agreement collection here. Click save when
          you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="update-collection-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 gap-4 @2xl/main:grid-cols-2 @2xl/main:gap-10">
              <div className="flex flex-col gap-2">
                <form.AppField name="displayName">
                  {(field) => <field.TextField label="Display name" />}
                </form.AppField>
                <FieldDescription className="flex items-center gap-1">
                  <Info className="size-4" />
                  <span>Descriptive title of the collection.</span>
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <form.AppField name="name">
                  {(field) => <field.TextField label="Name" />}
                </form.AppField>
                <FieldDescription className="flex items-center gap-1">
                  <Info className="size-4" />
                  <span>Identifier used internally in the system.</span>
                </FieldDescription>
              </div>
            </div>

            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" />}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton
            label="Save changes"
            formId="update-collection-form"
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  );
}
