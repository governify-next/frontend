"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Hash, Pencil, Type } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAppForm } from "@/components/form";
import { IOrganization, IOrganizationPayload } from "@/types/organization";
import { organizationFormSchema } from "@/schemas/organization";
import { updateOrganization } from "@/data/organizations/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { OrganizationAvatar } from "@/components/avatar/organization-avatar";

function DetailsHeader({
  organization,
  children,
}: {
  organization: IOrganization;
  children: React.ReactNode;
}) {
  return (
    <CardHeader className="flex flex-wrap items-center gap-4">
      <OrganizationAvatar
        label={organization.displayName || organization.name}
        className="size-12"
        fallbackClassName="text-base font-medium"
      />
      <div className="flex min-w-48 flex-1 flex-col gap-1">
        <CardTitle>Organization details</CardTitle>
        <CardDescription>
          Update the organization&apos;s public information.
        </CardDescription>
      </div>
      <CardAction className="ml-auto flex gap-2 self-center">
        {children}
      </CardAction>
    </CardHeader>
  );
}

function DetailItem({
  label,
  icon,
  multiline,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3",
        multiline && "@2xl/main:col-span-2",
      )}
    >
      <dt className="text-sm leading-snug font-medium">{label}</dt>
      <dd
        className={cn(
          "flex gap-2 rounded-md border bg-muted/40 px-2.5 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
          multiline
            ? "max-h-32 min-h-16 items-start overflow-y-auto py-2"
            : "min-h-9 items-center py-1.5",
        )}
      >
        {icon}
        <span className="min-w-0 break-words">{children}</span>
      </dd>
    </div>
  );
}

export function OrganizationDetails({
  organization,
}: {
  organization: IOrganization;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOrganizationChange = async (payload: IOrganizationPayload) => {
    const result = await updateOrganization(organization.name, payload);

    if (!result.ok) {
      toast.error(result.error);
      return false;
    }

    // Same transition as the refresh so read mode only shows once the new data has arrived.
    startTransition(() => {
      if (result.data.name !== organization.name) {
        router.push(`/organizations/${result.data.name}/settings`);
      } else {
        router.refresh();
      }
      setEditing(false);
    });
    toast.success("Organization updated.");
    return true;
  };

  return (
    <Card>
      {editing ? (
        <EditOrganizationForm
          organization={organization}
          pending={isPending}
          onOrganizationChange={handleOrganizationChange}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <DetailsHeader organization={organization}>
            <Button onClick={() => setEditing(true)}>
              <Pencil />
              Edit details
            </Button>
          </DetailsHeader>
          <CardContent>
            <dl className="grid gap-5 @2xl/main:grid-cols-2">
              <DetailItem label="Name" icon={<Hash />}>
                {organization.name}
              </DetailItem>
              <DetailItem label="Display name" icon={<Type />}>
                {organization.displayName || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </DetailItem>
              <DetailItem label="Description" multiline>
                {organization.description}
              </DetailItem>
            </dl>
          </CardContent>
        </>
      )}
    </Card>
  );
}

function EditOrganizationForm({
  organization,
  pending,
  onOrganizationChange,
  onCancel,
}: {
  organization: IOrganization;
  pending: boolean;
  onOrganizationChange: (payload: IOrganizationPayload) => Promise<boolean>;
  onCancel: () => void;
}) {
  const form = useAppForm({
    defaultValues: {
      name: organization.name,
      displayName: organization.displayName ?? "",
      description: organization.description,
    },
    validators: {
      onSubmit: organizationFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onOrganizationChange({
        name: value.name,
        displayName: value.displayName || undefined,
        description: value.description,
      });
    },
  });

  return (
    <>
      <DetailsHeader organization={organization}>
        <Button variant="outline" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton
            label="Save changes"
            formId="edit-organization-form"
            pending={pending}
          />
        </form.AppForm>
      </DetailsHeader>
      <CardContent>
        <form
          id="edit-organization-form"
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
                    placeholder="universidad-sevilla"
                    autoFocus
                  />
                )}
              </form.AppField>
              <form.AppField name="displayName">
                {(field) => (
                  <field.TextField
                    label="Display name"
                    icon={<Type />}
                    placeholder="Universidad de Sevilla"
                  />
                )}
              </form.AppField>
            </div>
            <form.AppField name="description">
              {(field) => (
                <field.TextareaField
                  label="Description"
                  placeholder="What does this organization do?"
                />
              )}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>
    </>
  );
}
