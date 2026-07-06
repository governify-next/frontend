"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/form";
import { loginFormSchema } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import { loginAction } from "@/data/auth/actions";
import { toast } from "sonner";

export function LoginUserForm() {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      login: "",
      password: "",
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      const error = await loginAction(value);

      if (error) {
        toast.error(error);
        return;
      }

      router.push("/");
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      id="login-user-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <form.AppField name="login">
          {(field) => (
            <field.TextField
              label="Login"
              type="text"
              autoComplete="username"
              autoFocus
              required
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={isInvalid}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="Login" formId="login-user-form" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
