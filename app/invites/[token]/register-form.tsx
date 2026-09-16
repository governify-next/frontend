"use client";

import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/form";
import { registerFormSchema } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerInOrganizationAction, loginAction } from "@/data/auth/actions";

export function RegisterUserForm({ token }: { token: string }) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      username: "",
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validators: {
      onSubmit: registerFormSchema,
    },
    onSubmit: async ({ value }) => {
      const registerResult = await registerInOrganizationAction(token, value);

      if (!registerResult.ok) {
        toast.error(registerResult.error);
        return;
      }
      const loginError = await loginAction({
        login: value.username,
        password: value.password,
      });
      if (loginError) {
        toast.error(loginError);
        return;
      }
      router.push("/");
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      id="register-user-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="!gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome to Governify</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        <form.AppField name="username">
          {(field) => (
            <field.TextField
              label="Username"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="johnDoe"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label="Name"
              type="text"
              autoComplete="name"
              placeholder="John"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="surname">
          {(field) => (
            <field.TextField
              label="Surname"
              type="text"
              autoComplete="surname"
              placeholder="Doe"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" required />
          )}
        </form.AppField>

        <form.AppField name="passwordConfirmation">
          {(field) => (
            <field.TextField
              label="Confirm Password"
              type="password"
              required
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton
            label="Create Account"
            formId="register-user-form"
          />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
