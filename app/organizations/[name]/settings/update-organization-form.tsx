"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function UpdateOrganizationForm({
  organization,
}: {
  organization: IOrganization;
}) {
  const router = useRouter();
  const form = useForm({
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
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="displayName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Display name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-end">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              form="update-organization-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Save changes
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  );
}
