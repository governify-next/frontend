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
  user: IUserInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserChange: (userId: string, payload: IUserPayload) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      email: user.email,
      name: user.name,
      surname: user.surname,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const success = await onUserChange(user._id, value);

      if (!success) {
        form.reset();
        return;
      }

      onOpenChange(false);
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
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" autoFocus />}
            </form.AppField>

            <form.AppField name="surname">
              {(field) => <field.TextField label="Surname" />}
            </form.AppField>

            <form.AppField name="email">
              {(field) => <field.TextField label="Email" type="email" />}
            </form.AppField>
          </FieldGroup>
        </form>

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
