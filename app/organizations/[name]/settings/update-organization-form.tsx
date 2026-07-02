"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { IOrganization } from "@/types/organization.types";
import { organizationFormSchema } from "@/schemas/organization";
import { updateOrganization } from "@/lib/organizations/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export function UpdateOrganizationForm({
  organization,
}: {
  organization: IOrganization;
}) {
  const router = useRouter();
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
      const payload = {
        name: value.name,
        displayName: value.displayName || undefined,
        description: value.description,
      };
      const result = await updateOrganization(organization.name, payload);

      if (!result.ok) {
        toast.error(result.error);
        form.reset();
        return;
      }

      toast.success("Organization updated.");

      if (result.data.name !== organization.name) {
        router.push(`/organizations/${result.data.name}/settings`);
      } else {
        router.refresh();
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization details</CardTitle>
        <CardDescription>
          Update the organization&apos;s public information.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="update-organization-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-3">
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" />}
            </form.AppField>

            <form.AppField name="displayName">
              {(field) => <field.TextField label="Display name" />}
            </form.AppField>

            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" />}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-end">
        <form.AppForm>
          <form.SubmitButton
            label="Save changes"
            formId="update-organization-form"
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  );
}
