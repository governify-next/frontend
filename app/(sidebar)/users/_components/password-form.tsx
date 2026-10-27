import { useAppForm } from "@/components/form";
import { IUserInfo, IUserPayload } from "@/types/user.types";
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
import { userFormSchema } from "@/schemas/user";

export function EditPasswordDialog({
  user,
  open,
  onOpenChange,
  onUserChange,
}: {
  user: IUserInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserChange: (userId: string, payload: IUserPayload) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: userFormSchema.pick({ password: true }),
    },
    onSubmit: async ({ value }) => {
      const success = await onUserChange(user._id, value);
      if (success) {
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Set a new password for @{user.username}.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id="change-password-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-5">
              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    description="Password must be at least 6 characters long."
                    autoFocus
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
            <form.SubmitButton
              label="Save changes"
              formId="change-password-form"
            />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
