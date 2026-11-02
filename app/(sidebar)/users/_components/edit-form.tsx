import { AtSign, Mail } from "lucide-react";
import { useAppForm } from "@/components/form";
import {
  IUserInfo,
  IUserPayload,
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { assignableRoleOptions } from "@/lib/utils/roles";
import { userFormSchema } from "@/schemas/user";

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserChange,
  currentUserRole,
}: {
  user: IUserInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserChange: (userId: string, payload: IUserPayload) => Promise<boolean>;
  currentUserRole: SystemRole;
}) {
  const form = useAppForm({
    defaultValues: {
      email: user.email,
      name: user.name,
      surname: user.surname,
      systemRole: user.systemRole,
      status: user.status,
    },
    validators: {
      onSubmit: userFormSchema.omit({ username: true, password: true }),
    },
    onSubmit: async ({ value: { systemRole, status, ...value } }) => {
      const success = await onUserChange(user._id, {
        ...value,
        ...(systemRole !== user.systemRole && { systemRole }),
        ...(status !== user.status && { status }),
      });

      if (!success) {
        form.reset();
        return;
      }

      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update the account details and what it can access.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id="edit-user-form"
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

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <InputGroup data-disabled>
                  <InputGroupAddon>
                    <AtSign />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="username"
                    value={user.username}
                    disabled
                  />
                </InputGroup>
              </Field>

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
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton label="Save changes" formId="edit-user-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
