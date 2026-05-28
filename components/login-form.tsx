"use client";

import { useActionState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/auth/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, action] = useActionState(loginAction, undefined);
  const loginError = state?.errors?.login?.[0];
  const passwordError = state?.errors?.password?.[0];

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      action={action}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Field data-invalid={Boolean(loginError)}>
          <FieldLabel htmlFor="login">Email or username</FieldLabel>
          <Input
            id="login"
            name="login"
            type="text"
            placeholder="john@example.com"
            autoComplete="username"
            aria-invalid={Boolean(loginError)}
            required
          />
          {loginError ? <FieldError>{loginError}</FieldError> : null}
        </Field>

        <Field data-invalid={Boolean(passwordError)}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(passwordError)}
            required
          />
          {passwordError ? <FieldError>{passwordError}</FieldError> : null}
        </Field>

        {state?.message ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to sign in</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        ) : null}

        <Field>
          <Button type="submit">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
