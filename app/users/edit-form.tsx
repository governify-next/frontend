import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { UserInfo, UserPayload } from "@/types/user.types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(30, "Name must be at most 30 characters."),
  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters.")
    .max(50, "Surname must be at most 50 characters."),
});

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserChange,
}: {
  user: UserInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserChange: (userId: string, payload: UserPayload) => Promise<boolean>;
}) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: user.email,
      name: user.name,
      surname: user.surname,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      const success = await onUserChange(user._id, value);

      if (success) {
        onOpenChange(false);
      } else {
        setError("Something went wrong while updating the user. Please try again.");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Make changes to the user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-user-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
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
                      autoFocus={true}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="surname"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Surname</FieldLabel>
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
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
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
          </FieldGroup>
        </form>

        {error ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to save changes</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                form="edit-user-form"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2Icon className="animate-spin" />}
                Save changes
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
