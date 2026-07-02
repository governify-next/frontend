import * as z from "zod";
import { useAppForm } from "@/components/form";
import { IUserInfo, IUserPayload } from "@/types/user.types";
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
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

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
      onSubmit: formSchema,
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
          <DialogTitle>Edit user password</DialogTitle>
          <DialogDescription>
            Make changes to the user password here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="change-password-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="password">
              {(field) => (
                <field.TextField label="Password" type="off" autoFocus />
              )}
            </form.AppField>
          </FieldGroup>
        </form>

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
