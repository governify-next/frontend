import { AtSign, Mail } from "lucide-react";
import { useAppForm } from "@/components/form";
import {
  ICreateIUserPayload,
  SystemRole,
  UserStatus,
} from "@/types/user.types";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { assignableRoleOptions } from "@/lib/utils/roles";
import { userFormSchema } from "@/schemas/user";

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
      onSubmit: userFormSchema,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            Create a new account and choose what it can access.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id="create-user-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-5">
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                <form.AppField name="name">
                  {(field) => <field.TextField label="Name" autoFocus />}
                </form.AppField>

                <form.AppField name="surname">
                  {(field) => <field.TextField label="Surname" />}
                </form.AppField>
              </div>

              <form.AppField name="username">
                {(field) => (
                  <field.TextField
                    label="Username"
                    icon={<AtSign />}
                    placeholder="johndoe"
                  />
                )}
              </form.AppField>

              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    label="Email"
                    type="email"
                    icon={<Mail />}
                    placeholder="johndoe@example.com"
                  />
                )}
              </form.AppField>

              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    description="Password must be at least 6 characters long."
                  />
                )}
              </form.AppField>

              <form.AppField name="systemRole">
                {(field) => (
                  <field.ToggleGroupField
                    label="Role"
                    options={assignableRoleOptions(currentUserRole)}
                  />
                )}
              </form.AppField>

              <form.AppField name="status">
                {(field) => (
                  <field.SwitchField
                    label="Active account"
                    description="Disabled users can't sign in until enabled."
                    checkedValue={UserStatus.ACTIVE}
                    uncheckedValue={UserStatus.DISABLED}
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </form>
        </DialogBody>

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
