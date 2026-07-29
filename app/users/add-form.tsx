import * as z from "zod";
import { useAppForm } from "@/components/form";
import {
  ICreateIUserPayload,
  SystemRole,
  UserStatus,
} from "@/types/user.types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username must be at most 50 characters."),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(30, "Name must be at most 30 characters."),
  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters.")
    .max(50, "Surname must be at most 50 characters."),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  systemRole: z.enum(SystemRole),
  status: z.enum(UserStatus),
});

export function CreateUserDialog({
  open,
  onOpenChange,
  onCreate,
  currentUserRole,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: ICreateIUserPayload) => Promise<boolean>;
  currentUserRole: SystemRole;
}) {
  const systemRoleOptions =
    currentUserRole === SystemRole.SUPERADMIN
      ? Object.values(SystemRole)
      : [SystemRole.ADMIN, SystemRole.USER];

  const form = useAppForm({
    defaultValues: {
      username: "",
      name: "",
      surname: "",
      email: "",
      password: "",
      systemRole: SystemRole.USER,
      status: UserStatus.ACTIVE,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const success = await onCreate(value);
      if (success) {
        form.reset();
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user. Click create when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-user-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-3">
            <form.AppField name="username">
              {(field) => <field.TextField label="Username" autoFocus />}
            </form.AppField>

            <form.AppField name="name">
              {(field) => <field.TextField label="Name" />}
            </form.AppField>

            <form.AppField name="surname">
              {(field) => <field.TextField label="Surname" />}
            </form.AppField>

            <form.AppField name="email">
              {(field) => <field.TextField label="Email" type="email" />}
            </form.AppField>

            <form.AppField name="password">
              {(field) => <field.TextField label="Password" type="off" />}
            </form.AppField>

            <form.AppField name="systemRole">
              {(field) => (
                <field.SelectField
                  label="System Role"
                  options={systemRoleOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="status">
              {(field) => (
                <field.SelectField
                  label="Status"
                  options={Object.values(UserStatus)}
                />
              )}
            </form.AppField>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton label="Create user" formId="create-user-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
